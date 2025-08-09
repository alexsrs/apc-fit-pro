import {
  UserRepositoryClass as ExternalUserRepositoryClass,
  UserRepositoryClass,
} from "../repositories/users-repository";
import { UserProfileRepository } from "../repositories/user-profile-repository";
import { Grupo, User, UserPerfil } from "../models/user-model";
import { userProfileSchema } from "../validators/user-profile.validator";
import { grupoSchema } from "../validators/group.validator";
import { classificarObjetivoAnamnese } from "../utils/avaliacaoProcessor";
import { calcularIndicesMedidas } from "../utils/avaliacaoMedidas";
import { Genero, isGenero } from "../models/genero-model";
import { NovaAvaliacaoMessage } from "../utils/messaging";
import { converterSexoParaGenero, isSexoValido, SexoInput } from "../utils/genero-converter";

function handleServiceError(error: unknown, message: string): never {
  console.error(message, error);
  throw new Error(message);
}

// Adaptador para o tipo User
export class UsersService {
  [x: string]: any;
  private userRepository: UserRepositoryClass;
  private userProfileRepository = new UserProfileRepository();

  constructor() {
    this.userRepository = new ExternalUserRepositoryClass();
  }

  // Buscar perfil do aluno via userPerfilId
  async getUserProfileByPerfilId(userPerfilId: string): Promise<UserPerfil | null> {
    try {
      return await this.userProfileRepository.findProfileById(userPerfilId);
    } catch (error) {
      handleServiceError(error, "Não foi possível buscar o perfil pelo userPerfilId.");
    }
  }

  async findUserById(userId: string): Promise<User | null> {
    const user = await this.userRepository.getById(userId); // Certifique-se de que o método `findById` existe no repositório
    if (user) {
      return {
        ...user,
        name: user.name ?? "sem nome", // Substitui null por um valor padrão
        email: user.email ?? "", // Garante que email seja sempre uma string
      };
    }
    return null;
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.getAll(); // Certifique-se de que getAll retorna o tipo correto
      return users.map((user) => ({
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        name: user.name ?? "Nome Padrão", // Substitui null por um valor padrão
        email: user.email ?? "", // Substitui null por uma string vazia
        image: user.image ?? null, // Substitui undefined por null
        emailVerified: user.emailVerified ?? null, // Substitui undefined por null
      }));
    } catch (error) {
      handleServiceError(error, "Não foi possível buscar os usuários.");
    }
  }

  async getUser(): Promise<{
    id: string;
    name: string | null;
    email: string;
  } | null> {
    try {
      const user = await this.userRepository.getUser(); // Certifique-se de que getUser retorna o tipo correto
      return user ?? null; // Retorne null se user for undefined
    } catch (error) {
      handleServiceError(error, "Não foi possível buscar o usuário.");
      return null; // Retorne null em caso de erro
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      handleServiceError(error, "Não foi possível deletar o usuário.");
    }
  }

  async deleteUserProfile(userId: string, profileId: string): Promise<void> {
    await this.userProfileRepository.deleteProfile(userId, profileId); // Certifique-se de que o método `deleteProfile` existe no repositório
  }

  async getUserProfiles(userId: string): Promise<UserPerfil[]> {
    return this.userProfileRepository.findProfilesByUserId(userId);
  }

  async createUserProfile(
    userId: string,
    data: Partial<UserPerfil>
  ): Promise<UserPerfil> {
    try {
      console.log("Validando dados:", data);

      const validatedData = userProfileSchema.parse(data);

      console.log("Dados validados:", validatedData);

      const newProfile = await this.userProfileRepository.createProfile(
        userId,
        {
          ...validatedData,
          telefone: validatedData.telefone ?? undefined,
          dataNascimento: validatedData.dataNascimento
            ? new Date(validatedData.dataNascimento)
            : undefined,
          professorId: validatedData.professorId ?? undefined, // garantir que professorId é passado
        }
      );

      console.log("Perfil criado com sucesso:", newProfile);

      return newProfile;
    } catch (error) {
      console.error("Erro na camada de serviço:", error);
      throw new Error("Erro ao criar o perfil do usuário.");
    }
  }

  async getUserGroups(userId: string): Promise<Grupo[]> {
    try {
      const groups = await this.userRepository.getUserGroups(userId);
      return groups.map((group) => this.processGroup(group));
    } catch (error) {
      handleServiceError(
        error,
        "Não foi possível buscar os grupos do usuário."
      );
    }
  }

  async getUserProfile(userId: string): Promise<UserPerfil | null> {
    try {
      const userProfile = await this.userProfileRepository.findProfilesByUserId(
        userId
      );
      return userProfile.length > 0 ? userProfile[0] : null; // Retorna o primeiro perfil ou null se não houver perfis
    } catch (error) {
      handleServiceError(error, "Não foi possível buscar o perfil do usuário.");
    }
  }

  async getProfessores(): Promise<User[]> {
    try {
      const professores = await this.getUsersByRole("professor");
      return professores;
    } catch (error) {
      handleServiceError(error, "Não foi possível buscar os professores.");
    }
  }

  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const users = await this.userRepository.getByRole(role);
      return users.map((user) => ({
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        name: user.name ?? "Nome Padrão",
        email: user.email ?? "",
        image: user.image ?? null,
        emailVerified: user.emailVerified ?? null,
      }));
    } catch (error) {
      handleServiceError(
        error,
        "Não foi possível buscar os usuários por papel."
      );
    }
  }

  async getUserStudents(userId: string) {
    try {
      const students = await this.userRepository.getUserStudents(userId);
      return students.map((perfil: any) => ({
        id: perfil.id,
        name: perfil.user?.name ?? "Aluno sem nome",
        email: perfil.user?.email ?? "",
        image: perfil.user?.image ?? null,
        telefone: perfil.telefone ?? "",
        dataNascimento: perfil.dataNascimento ?? null,
        genero: perfil.genero ?? "",
        grupos: perfil.grupos?.map((grupo: any) => ({
          id: grupo.id,
          nome: grupo.nome
        })) || [], // Inclui os grupos do aluno formatados
      }));
    } catch (error) {
      handleServiceError(
        error,
        "Não foi possível buscar os alunos do professor."
      );
    }
  }
  async addStudentToUser(userId: string, body: any) {
    try {
      // Valida se o professor existe
      const professor = await this.userRepository.getUserProfileById(userId);
      if (!professor || professor.role !== "professor") {
        throw new Error("Usuário não é um professor válido");
      }

      // Valida dados do aluno
      if (!body.userId || !body.telefone || !body.dataNascimento) {
        throw new Error("Dados do aluno são obrigatórios: userId, telefone, dataNascimento");
      }

      // Cria o perfil do aluno vinculado ao professor
      const aluno = await this.userRepository.addStudentToUser(userId, {
        userId: body.userId,
        role: "aluno",
        telefone: body.telefone,
        dataNascimento: new Date(body.dataNascimento),
        genero: body.genero || null,
        professorId: userId,
      });

      return aluno;
    } catch (error) {
      handleServiceError(error, "Erro ao adicionar aluno ao professor.");
    }
  }

  async updateUserStudent(userId: string, studentId: string, body: any) {
    try {
      // Valida se o professor existe e se o aluno pertence a ele
      const professor = await this.userRepository.getUserProfileById(userId);
      if (!professor || professor.role !== "professor") {
        throw new Error("Usuário não é um professor válido");
      }

      const aluno = await this.userRepository.getUserProfileById(studentId);
      if (!aluno || aluno.professorId !== userId) {
        throw new Error("Aluno não encontrado ou não pertence a este professor");
      }

      // Atualiza apenas campos permitidos
      const dadosPermitidos = {
        telefone: body.telefone,
        dataNascimento: body.dataNascimento ? new Date(body.dataNascimento) : undefined,
        genero: body.genero,
      };

      // Remove campos undefined
      Object.keys(dadosPermitidos).forEach(key => 
        dadosPermitidos[key as keyof typeof dadosPermitidos] === undefined && 
        delete dadosPermitidos[key as keyof typeof dadosPermitidos]
      );

      const alunoAtualizado = await this.userRepository.updateUserStudent(
        userId, 
        studentId, 
        dadosPermitidos
      );

      return alunoAtualizado;
    } catch (error) {
      handleServiceError(error, "Erro ao atualizar informações do aluno.");
    }
  }

  async removeStudentFromUser(userId: string, studentId: string) {
    try {
      // Valida se o professor existe e se o aluno pertence a ele
      const professor = await this.userRepository.getUserProfileById(userId);
      if (!professor || professor.role !== "professor") {
        throw new Error("Usuário não é um professor válido");
      }

      const aluno = await this.userRepository.getUserProfileById(studentId);
      if (!aluno || aluno.professorId !== userId) {
        throw new Error("Aluno não encontrado ou não pertence a este professor");
      }

      // Remove o vínculo (apenas o perfil, não o usuário)
      await this.userRepository.removeStudentFromUser(userId, studentId);
      
      return { message: "Aluno removido com sucesso" };
    } catch (error) {
      handleServiceError(error, "Erro ao remover aluno do professor.");
    }
  }
  async createUserGroup(userId: string, body: any) {
    try {
      // Validação dos dados do grupo
      const validatedData = grupoSchema
        .omit({
          id: true,
          criadoPorId: true,
          criadoEm: true,
          atualizadoEm: true,
          membros: true,
        })
        .parse(body);
      // Criação do grupo no repositório
      const grupoCriado = await this.userRepository.createUserGroup(userId, {
        ...validatedData,
      });
      // Busca o grupo completo para retornar com membros (se necessário)
      return this.processGroup(grupoCriado);
    } catch (error) {
      handleServiceError(error, "Não foi possível criar o grupo.");
    }
  }
  async updateUserGroup(userId: string, groupId: string, body: any) {
    try {
      // Validação dos dados do grupo
      const validatedData = grupoSchema
        .omit({
          id: true,
          criadoPorId: true,
          criadoEm: true,
          atualizadoEm: true,
          membros: true,
        })
        .parse(body);

      // Buscar o perfil do professor
      const professorPerfil = await this.userRepository.getUserProfileByUserId(userId);
      if (!professorPerfil || professorPerfil.role !== 'professor') {
        throw new Error("Professor não encontrado");
      }

      // Verificar se o grupo pertence ao usuário
      const grupoExistente = await this.userRepository.getUserGroupById(professorPerfil.id, groupId);
      if (!grupoExistente) {
        throw new Error("Grupo não encontrado ou não pertence ao usuário");
      }

      // Atualizar o grupo no repositório
      const grupoAtualizado = await this.userRepository.updateUserGroup(userId, groupId, validatedData);
      
      return this.processGroup(grupoAtualizado);
    } catch (error) {
      handleServiceError(error, "Não foi possível atualizar o grupo.");
    }
  }

  async deleteUserGroup(userId: string, groupId: string) {
    try {
      // Buscar o perfil do professor
      const professorPerfil = await this.userRepository.getUserProfileByUserId(userId);
      if (!professorPerfil || professorPerfil.role !== 'professor') {
        throw new Error("Professor não encontrado");
      }

      // Verificar se o grupo pertence ao usuário
      const grupoExistente = await this.userRepository.getUserGroupById(professorPerfil.id, groupId);
      if (!grupoExistente) {
        throw new Error("Grupo não encontrado ou não pertence ao usuário");
      }

      // Deletar o grupo
      await this.userRepository.deleteUserGroup(userId, groupId);
      
      return { message: "Grupo deletado com sucesso" };
    } catch (error) {
      handleServiceError(error, "Não foi possível deletar o grupo.");
    }
  }

  async addStudentToGroup(userId: string, groupId: string, studentId: string) {
    try {
      console.log('[addStudentToGroup] ======== INICIANDO ADIÇÃO DE ALUNO AO GRUPO ========');
      console.log('[addStudentToGroup] Parâmetros recebidos:', { userId, groupId, studentId });
      
      // Buscar o perfil do professor (userId é User.id, precisamos do UserPerfil.id)
      const professorPerfil = await this.userRepository.getUserProfileByUserId(userId);
      console.log('[addStudentToGroup] Professor perfil encontrado:', {
        id: professorPerfil?.id,
        userId: professorPerfil?.userId,
        role: professorPerfil?.role,
        professorId: professorPerfil?.professorId,
      });
      
      if (!professorPerfil || professorPerfil.role !== 'professor') {
        console.log('[addStudentToGroup] ❌ ERRO: Professor não encontrado ou não é professor');
        throw new Error("Professor não encontrado");
      }

      // Verificar se o grupo pertence ao professor
      const grupo = await this.userRepository.getUserGroupById(professorPerfil.id, groupId);
      console.log('[addStudentToGroup] Grupo encontrado:', {
        id: grupo?.id,
        nome: grupo?.nome,
        criadoPorId: grupo?.criadoPorId,
        professorPerfilId: professorPerfil.id
      });
      
      if (!grupo) {
        console.log('[addStudentToGroup] ❌ ERRO: Grupo não encontrado ou não pertence ao professor');
        throw new Error("Grupo não encontrado ou não pertence ao usuário");
      }

      // Verificar se o aluno pertence ao professor
      const aluno = await this.userRepository.getUserProfileById(studentId);
      console.log('[addStudentToGroup] Aluno encontrado:', {
        id: aluno?.id,
        userId: aluno?.userId,
        role: aluno?.role,
        professorId: aluno?.professorId,
        grupoId: aluno?.grupoId,
        expectedProfessorId: userId
      });
      
      if (!aluno || aluno.professorId !== userId) {
        console.log('[addStudentToGroup] ❌ ERRO: Aluno não encontrado ou não pertence a este professor');
        console.log('[addStudentToGroup] Comparação: aluno.professorId =', aluno?.professorId, 'vs userId =', userId);
        throw new Error("Aluno não encontrado ou não pertence a este professor");
      }

      // Verificar se aluno já está no grupo
      if (aluno.grupoId === groupId) {
        console.log('[addStudentToGroup] ⚠️ AVISO: Aluno já está neste grupo');
        return { message: "Aluno já está neste grupo", aluno };
      }

      // Adicionar aluno ao grupo
      console.log('[addStudentToGroup] 🔄 Executando atualização no banco...');
      const resultado = await this.userRepository.addStudentToGroup(groupId, studentId);
      console.log('[addStudentToGroup] ✅ Resultado da operação:', resultado);
      console.log('[addStudentToGroup] ======== ADIÇÃO CONCLUÍDA COM SUCESSO ========');
      
      return { message: "Aluno adicionado ao grupo com sucesso", aluno: resultado };
    } catch (error) {
      console.error('[addStudentToGroup] ❌ ERRO FINAL:', error);
      handleServiceError(error, "Não foi possível adicionar aluno ao grupo.");
    }
  }

  async removeStudentFromGroup(userId: string, groupId: string, studentId: string) {
    try {
      console.log('[removeStudentFromGroup] Iniciando remoção - userId:', userId, 'groupId:', groupId, 'studentId:', studentId);
      
      // Buscar o perfil do professor (userId é User.id, precisamos do UserPerfil.id)
      const professorPerfil = await this.userRepository.getUserProfileByUserId(userId);
      console.log('[removeStudentFromGroup] Professor perfil encontrado:', professorPerfil?.id, professorPerfil?.role);
      
      if (!professorPerfil || professorPerfil.role !== 'professor') {
        throw new Error("Professor não encontrado");
      }

      // Verificar se o grupo pertence ao professor
      const grupo = await this.userRepository.getUserGroupById(professorPerfil.id, groupId);
      console.log('[removeStudentFromGroup] Grupo encontrado:', grupo?.id, grupo?.nome);
      console.log('[removeStudentFromGroup] Grupo criadoPorId:', grupo?.criadoPorId, 'esperado:', professorPerfil.id);
      
      if (!grupo) {
        throw new Error("Grupo não encontrado ou não pertence ao usuário");
      }

      // Verificar se o aluno pertence ao professor
      const aluno = await this.userRepository.getUserProfileById(studentId);
      console.log('[removeStudentFromGroup] Aluno encontrado:', aluno?.id, aluno?.professorId, 'esperado professorId (User.id):', userId);
      
      if (!aluno || aluno.professorId !== userId) {
        throw new Error("Aluno não encontrado ou não pertence a este professor");
      }

      // Remover aluno do grupo
      const resultado = await this.userRepository.removeStudentFromGroup(groupId, studentId);
      console.log('[removeStudentFromGroup] Resultado:', resultado);
      
      return resultado;
    } catch (error) {
      console.error('[removeStudentFromGroup] Erro:', error);
      handleServiceError(error, "Não foi possível remover aluno do grupo.");
    }
  }

  async getGroupStudents(userId: string, groupId: string) {
    try {
      // Buscar o perfil do professor (userId é User.id, precisamos do UserPerfil.id)
      const professorPerfil = await this.userRepository.getUserProfileByUserId(userId);
      if (!professorPerfil || professorPerfil.role !== 'professor') {
        throw new Error("Professor não encontrado");
      }

      // Verificar se o grupo pertence ao professor
      const grupo = await this.userRepository.getUserGroupById(professorPerfil.id, groupId);
      if (!grupo) {
        throw new Error("Grupo não encontrado ou não pertence ao usuário");
      }

      // Buscar membros do grupo
      const membros = await this.userRepository.getGroupStudents(groupId);
      
      return membros.map((membro: any) => ({
        id: membro.id,
        name: membro.user?.name ?? "Aluno sem nome",
        email: membro.user?.email ?? "",
        image: membro.user?.image ?? null,
        telefone: membro.telefone ?? "",
        dataNascimento: membro.dataNascimento ?? null,
        genero: membro.genero ?? "",
      }));
    } catch (error) {
      handleServiceError(error, "Não foi possível buscar membros do grupo.");
    }
  }

  async alunoPossuiAvaliacaoValida(userPerfilId: string): Promise<boolean> {
    try {
      return await this.userRepository.hasValidAvaliacao(userPerfilId);
    } catch (error) {
      handleServiceError(error, "Erro ao verificar avaliação válida do aluno.");
    }
  }

  async listarAvaliacoesAluno(userPerfilId: string) {
    try {
      return await this.userRepository.listarAvaliacoesAluno(userPerfilId);
    } catch (error) {
      handleServiceError(error, "Erro ao listar avaliações do aluno.");
    }
  }

  async cadastrarAvaliacaoAluno(userPerfilId: string, dados: any, usuarioLogado?: any) {
    try {
      let objetivoClassificado: string | null = null;
      let resultado = dados.resultado;

      // Verificar se quem está criando é um professor
      let isProfessor = false;
      if (usuarioLogado?.id) {
        const perfilUsuarioLogado = await this.userRepository.getUserProfileByUserId(usuarioLogado.id);
        isProfessor = perfilUsuarioLogado?.role === 'professor';
      }

      if (dados.tipo === "medidas" && dados.resultado) {
        let {
          membrosSuperiores = {},
          tronco = {},
          membrosInferiores = {},
          pescoco,
          ...principais
        } = dados.resultado;

        const medidasCompletas = {
          ...principais,
          ...membrosSuperiores,
          ...tronco,
          ...membrosInferiores,
        };

        const indicesCalculados = calcularIndicesMedidas(medidasCompletas);

        // Filtra apenas índices e classificações
        const indices = Object.fromEntries(
          Object.entries(indicesCalculados).filter(
            ([key]) =>
              key.startsWith("classificacao") ||
              key.includes("percentual") ||
              key.includes("massaMuscular") ||
              key === "imc" ||
              key === "rcq" ||
              key === "ca"
          )
        );

        resultado = {
          ...principais,
          tronco,
          membrosSuperiores,
          membrosInferiores,
          indices,
        };
      }

      if (dados.tipo === "triagem" && dados.resultado) {
        objetivoClassificado = classificarObjetivoAnamnese(dados.resultado);
      }
      if (dados.tipo === "alto_rendimento") {
        objetivoClassificado = "alto_rendimento";
      }

      // Calcular validade se for professor e especificou dias de validade
      let validadeAte = null;
      if (dados.diasValidade && typeof dados.diasValidade === 'number' && dados.diasValidade > 0) {
        validadeAte = new Date();
        validadeAte.setDate(validadeAte.getDate() + dados.diasValidade);
      }

      // Determinar status da avaliação baseado em quem está criando
      let statusAvaliacao = 'pendente'; // Padrão para alunos
      
      if (isProfessor) {
        // Se é professor criando, a avaliação já é válida automaticamente
        statusAvaliacao = 'aprovada';
      } else if (validadeAte) {
        // Se especificou validade (era lógica antiga), aprova automaticamente
        statusAvaliacao = 'aprovada';
      } else if (dados.status) {
        // Usa status explícito se fornecido
        statusAvaliacao = dados.status;
      }

      const avaliacaoParaSalvar = {
        ...dados,
        resultado,
        objetivoClassificado,
        validadeAte,
        status: statusAvaliacao
      };

      // Salva avaliação no banco
      const avaliacao = await this.userRepository.cadastrarAvaliacaoAluno(
        userPerfilId,
        avaliacaoParaSalvar
      );

      // Publica mensagem na fila do RabbitMQ (CloudAMQP)
      try {
        console.log("[DEBUG] Iniciando publicação de alerta na fila RabbitMQ");
        // Busca o perfil do aluno e do professor para compor a mensagem
        const alunoPerfil = await this.userRepository.getUserProfileById(
          userPerfilId
        );
        console.log("[DEBUG] Perfil do aluno:", alunoPerfil);
        const professorId = alunoPerfil?.professorId;
        if (professorId) {
          // Importação dinâmica para evitar dependência circular
          const { publishToQueue } = await import("../utils/messaging");
          const alerta = {
            mensagem: `[user:${professorId}] Novo aluno realizou uma avaliação. Clique para analisar.`,
            avaliacaoId: avaliacao.id,
          };
          console.log("[DEBUG] Alerta a ser enviado:", alerta);
          // Publica na fila correta consumida pelo frontend
          await publishToQueue("alertas_inteligentes", alerta);
          console.log(
            "[DEBUG] Mensagem publicada com sucesso na fila alertas_inteligentes"
          );
        } else {
          console.warn(
            "[DEBUG] professorId não encontrado no perfil do aluno. Alerta não enviado."
          );
        }
      } catch (err) {
        // Loga erro, mas não impede o fluxo principal
        console.error(
          "[DEBUG] Erro ao publicar mensagem na fila RabbitMQ:",
          err
        );
      }

      return avaliacao;
    } catch (error) {
      handleServiceError(error, "Erro ao cadastrar avaliação do aluno.");
    }
  }

  // Busca professor por ID
  async getProfessorById(id: string) {
    // Busca apenas se for professor
    return await this.userRepository.getProfessorById(id);
  }

  async getProximaAvaliacaoAluno(userPerfilId: string) {
    try {
      const avaliacoes = await this.userRepository.listarAvaliacoesAluno(
        userPerfilId
      );
      if (!avaliacoes || avaliacoes.length === 0) return null;

      const [maisRecente, anterior] = avaliacoes;
      if (!maisRecente || !anterior)
        throw new Error("Avaliações insuficientes");

      // Se as medidas estão em resultado (JSON), extraia assim:
      const medidasRecente = {
        ...maisRecente,
        ...(typeof maisRecente.resultado === "object"
          ? maisRecente.resultado
          : {}),
      };
      const medidasAnterior = {
        ...anterior,
        ...(typeof anterior.resultado === "object" ? anterior.resultado : {}),
      };

      // Agora use medidasRecente e medidasAnterior para calcular os índices

      const indicesCalculados = calcularIndicesMedidas({
        peso: 0,
        altura: 0,
        idade: 0,
        cintura: 0,
        genero: Genero.Masculino,
      });

      // Filtra apenas índices e classificações
      const indices = Object.fromEntries(
        Object.entries(indicesCalculados).filter(
          ([key]) =>
            key.startsWith("classificacao") ||
            key.includes("percentual") ||
            key.includes("massaMuscular") ||
            key === "imc" ||
            key === "rcq" ||
            key === "ca"
        )
      );

      const dataProxima = maisRecente.validadeAte
        ? new Date(maisRecente.validadeAte)
        : null;

      return {
        data: dataProxima,
        tipo: maisRecente.tipo,
        validadeMeses: 2, // Padrão, já que agora calculamos a validade com base nas datas
        indices,
      };
    } catch (error) {
      throw new Error("Erro ao calcular próxima avaliação.");
    }
  }

  async getEvolucaoFisica(userPerfilId: string) {
    try {
      const avaliacoes =
        await this.userRepository.buscarUltimasAvaliacoesMedidas(userPerfilId);
      console.log("Avaliações retornadas:", avaliacoes);

      if (!avaliacoes || avaliacoes.length < 2) {
        console.error("Menos de 2 avaliações encontradas");
        return null;
      }

      const [maisRecente, anterior] = avaliacoes;

      const perfil = await this.userProfileRepository.findProfileById(
        userPerfilId
      );
      console.log("Perfil retornado:", perfil);

      if (!perfil) {
        console.error(
          "Perfil não encontrado para o userPerfilId:",
          userPerfilId
        );
        throw new Error(
          "Perfil não encontrado para o userPerfilId: " + userPerfilId
        );
      }

      // Ajuste aqui: verifique se a propriedade correta é 'genero' ou similar
      const genero = perfil.genero;
      const sexo: SexoInput = isSexoValido(genero) ? genero : "feminino"; // valor padrão seguro
      const sexoNum = converterSexoParaGenero(sexo);

      if (!maisRecente || !anterior) {
        console.error("Avaliações insuficientes para cálculo.");
        throw new Error("Avaliações insuficientes para cálculo.");
      }

      function getNumberProp(obj: Record<string, any>, prop: string): number {
        const value = obj[prop];
        return typeof value === "number" ? value : Number(value) || 0;
      }

      function isJsonObject(obj: unknown): obj is Record<string, any> {
        return typeof obj === "object" && obj !== null && !Array.isArray(obj);
      }

      const medidasRecente = isJsonObject(maisRecente.resultado)
        ? maisRecente.resultado
        : {};
      const medidasAnterior = isJsonObject(anterior.resultado)
        ? anterior.resultado
        : {};

      console.log("Medidas recente:", medidasRecente);
      console.log("Medidas anterior:", medidasAnterior);

      const indicesRecente = calcularIndicesMedidas({
        peso: getNumberProp(medidasRecente, "peso"),
        altura: getNumberProp(medidasRecente, "altura"),
        idade: getNumberProp(medidasRecente, "idade"),
        genero: sexoNum,
        cintura: getNumberProp(medidasRecente, "cintura"),
        quadril: getNumberProp(medidasRecente, "quadril"),
        pescoco: getNumberProp(medidasRecente, "pescoco"),
        abdomen: getNumberProp(medidasRecente, "abdomen"),
      });
      const indicesAnterior = calcularIndicesMedidas({
        peso: getNumberProp(medidasAnterior, "peso"),
        altura: getNumberProp(medidasAnterior, "altura"),
        idade: getNumberProp(medidasAnterior, "idade"),
        genero: sexoNum,
        cintura: getNumberProp(medidasAnterior, "cintura"),
        quadril: getNumberProp(medidasAnterior, "quadril"),
        pescoco: getNumberProp(medidasAnterior, "pescoco"),
        abdomen: getNumberProp(medidasAnterior, "abdomen"),
      });

      return {
        peso:
          getNumberProp(medidasRecente, "peso") -
          getNumberProp(medidasAnterior, "peso"),
        percentualGC_Marinha:
          (indicesRecente.percentualGC_Marinha ?? 0) -
          (indicesAnterior.percentualGC_Marinha ?? 0),
        imc: (indicesRecente.imc ?? 0) - (indicesAnterior.imc ?? 0),
      };
    } catch (error) {
      console.error("Erro detalhado ao calcular evolução física:", error);
      throw new Error("Erro ao buscar evolução física.");
    }
  }

  private processGroup(group: any): Grupo {
    return {
      ...grupoSchema.parse({
        ...group,
        criadoEm: group.criadoEm ?? new Date(),
        atualizadoEm: group.atualizadoEm ?? new Date(),
      }),
      membros: (group.membros ?? []).map((membro: any) => ({
        id: membro.id,
        professorId: membro.professorId ?? undefined,
        grupoId: membro.grupoId !== null && membro.grupoId !== undefined ? membro.grupoId as string : undefined,
        telefone: membro.telefone !== null && membro.telefone !== undefined ? membro.telefone : undefined,
      })),
    };
  }

  /**
   * Busca o gênero do perfil do usuário pelo ID do perfil.
   */
  static async getGeneroFromUserPerfil(
    userPerfilId: string
  ): Promise<Genero | null> {
    // Busca o perfil usando o repositório, seguindo a arquitetura em camadas
    const userProfileRepository = new UserProfileRepository();
    const perfil = await userProfileRepository.findProfileById(userPerfilId);

    if (perfil && isGenero(perfil.genero)) {
      return perfil.genero;
    }
    return null;
  }

  async aprovarAvaliacao(avaliacaoId: string, validadeDias: number) {
    try {
      const validadeAte = new Date();
      validadeAte.setDate(validadeAte.getDate() + validadeDias);

      const avaliacao = await this.userRepository.atualizarAvaliacaoAluno(
        avaliacaoId,
        {
          status: 'aprovada',
          validadeAte
        }
      );

      return avaliacao;
    } catch (error) {
      handleServiceError(error, "Erro ao aprovar avaliação do aluno.");
    }
  }

  async reprovarAvaliacao(avaliacaoId: string, motivo?: string) {
    try {
      // Buscar a avaliação atual primeiro
      const avaliacaoAtual = await this.userRepository.buscarAvaliacaoPorId(avaliacaoId);
      
      const avaliacao = await this.userRepository.atualizarAvaliacaoAluno(
        avaliacaoId,
        {
          status: 'reprovada',
          resultado: motivo ? { 
            ...(typeof avaliacaoAtual?.resultado === "object" && avaliacaoAtual?.resultado !== null ? avaliacaoAtual.resultado : {}), 
            motivoReprovacao: motivo 
          } : avaliacaoAtual?.resultado
        }
      );

      return avaliacao;
    } catch (error) {
      handleServiceError(error, "Erro ao reprovar avaliação do aluno.");
    }
  }
}
