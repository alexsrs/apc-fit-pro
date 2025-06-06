import {
  UserRepositoryClass as ExternalUserRepositoryClass,
  UserRepositoryClass,
} from "../repositories/users-repository";
import { UserProfileRepository } from "../repositories/user-profile-repository";
import { Grupo, User, UserPerfil } from "../models/user-model";
import { userProfileSchema } from "../validators/user-profile.validator";
import { grupoSchema } from "../validators/group.validator";
import { classificarObjetivoAnamnese } from "../utils/avaliacaoProcessor";
import {
  calcularIndicesMedidas,
  sexoToNumber,
} from "../utils/avaliacaoMedidas";
import { addMonths } from "date-fns";

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
      }));
    } catch (error) {
      handleServiceError(
        error,
        "Não foi possível buscar os alunos do professor."
      );
    }
  }
  addStudentToUser(userId: string, body: any) {
    throw new Error("Method not implemented.");
  }
  updateUserStudent(userId: string, studentId: string, body: any) {
    throw new Error("Method not implemented.");
  }
  removeStudentFromUser(userId: string, studentId: string) {
    throw new Error("Method not implemented.");
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
  updateUserGroup(userId: string, groupId: string, body: any) {
    throw new Error("Method not implemented.");
  }
  deleteUserGroup(userId: string, groupId: string) {
    throw new Error("Method not implemented.");
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

  async cadastrarAvaliacaoAluno(userPerfilId: string, dados: any) {
    try {
      let objetivoClassificado: string | null = null;
      let resultado = dados.resultado;

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

      const avaliacaoParaSalvar = {
        ...dados,
        resultado,
        objetivoClassificado,
      };

      return await this.userRepository.cadastrarAvaliacaoAluno(
        userPerfilId,
        avaliacaoParaSalvar
      );
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
        ...medidasRecente,
        ...medidasAnterior,
        peso: 0,
        altura: 0,
        idade: 0,
        sexo: 0,
        cintura: 0,
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
      const sexo: Sexo = isSexo(genero) ? genero : "feminino"; // valor padrão seguro
      const sexoNum = sexoToNumber(sexo);

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
        sexo,
        cintura: getNumberProp(medidasRecente, "cintura"),
        quadril: getNumberProp(medidasRecente, "quadril"),
        pescoco: getNumberProp(medidasRecente, "pescoco"),
        abdomen: getNumberProp(medidasRecente, "abdomen"),
      });
      const indicesAnterior = calcularIndicesMedidas({
        peso: getNumberProp(medidasAnterior, "peso"),
        altura: getNumberProp(medidasAnterior, "altura"),
        idade: getNumberProp(medidasAnterior, "idade"),
        sexo,
        cintura: getNumberProp(medidasAnterior, "cintura"),
        quadril: getNumberProp(medidasAnterior, "quadril"),
        pescoco: getNumberProp(medidasAnterior, "pescoco"),
        abdomen: getNumberProp(medidasAnterior, "abdomen"),
      });

      return {
        peso:
          getNumberProp(medidasRecente, "peso") -
          getNumberProp(medidasAnterior, "peso"),
        massaMagra:
          (indicesRecente.massaMuscular_Lee ?? 0) -
          (indicesAnterior.massaMuscular_Lee ?? 0),
        percentualGC_Deurenberg:
          (indicesRecente.percentualGC_Deurenberg ?? 0) -
          (indicesAnterior.percentualGC_Deurenberg ?? 0),
        percentualGC_Gomez:
          (indicesRecente.percentualGC_Gomez ?? 0) -
          (indicesAnterior.percentualGC_Gomez ?? 0),
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

  private processGroup(group: Grupo): Grupo {
    return {
      ...grupoSchema.parse({
        ...group,
        criadoEm: group.criadoEm ?? new Date(),
        atualizadoEm: group.atualizadoEm ?? new Date(),
      }),
      membros: (group.membros ?? []).map((membro) => ({
        ...membro,
        professorId: membro.professorId ?? undefined,
      })),
    };
  }
}

export { UserRepositoryClass };
type Sexo = "masculino" | "feminino" | 1 | 0;

function isSexo(value: any): value is Sexo {
  return value === "masculino" || value === "feminino" || value === 1 || value === 0;
}
