import { User, UserPerfil, Grupo, Prisma, Session } from "@prisma/client";
import prisma from "../prisma";

export class UserRepositoryClass {
  [x: string]: any;
  getCurrentUser() {
    throw new Error("Method not implemented.");
  }
  async getAll(): Promise<User[]> {
    return prisma.user.findMany({
      include: {
        accounts: true, // Use o nome correto da relação
        sessions: true,
      },
    });
  }

  async getById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true, // Use o nome correto da relação
        sessions: true,
      },
    });
  }

  async getByRole(role: string): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        userPerfil: {
          some: {
            role: role,
          },
        },
      },
      include: {
        userPerfil: true,
      },
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async getUserProfiles(userId: string): Promise<UserPerfil[]> {
    return prisma.userPerfil.findMany({
      where: { userId },
    });
  }

  async createUserProfile(
    userId: string,
    data: Partial<UserPerfil>
  ): Promise<UserPerfil> {
    return prisma.userPerfil.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async updateUserProfile(
    userId: string,
    profileId: string,
    data: Partial<UserPerfil>
  ): Promise<UserPerfil> {
    return prisma.userPerfil.update({
      where: {
        id: profileId,
        userId: userId, // Garante que o perfil pertence ao usuário
      },
      data: {
        ...data, // Atualiza apenas os campos fornecidos
      },
    });
  }

  async deleteUserProfile(userId: string, profileId: string): Promise<void> {
    await prisma.userPerfil.delete({
      where: {
        id: profileId,
        userId: userId,
      },
    });
  }

  // Método para buscar o perfil pelo ID
  async getUserProfileById(profileId: string): Promise<UserPerfil | null> {
    return prisma.userPerfil.findUnique({
      where: { id: profileId },
    });
  }

  async getUserProfileByUserId(userId: string): Promise<UserPerfil | null> {
    return prisma.userPerfil.findFirst({
      where: { userId: userId },
    });
  }

  // Buscar alunos relacionados a um usuário (professor)
  async getUserStudents(userId: string) {
    return prisma.userPerfil.findMany({
      where: {
        professorId: userId,
        role: "aluno", // garante que só retorna perfis de alunos
      },
      include: {
        user: true, // inclui dados do usuário vinculado ao perfil
        grupos: {
          select: {
            id: true,
            nome: true,
          }
        }, // inclui grupos do aluno
      },
    });
  }

  // Adicionar um aluno a um usuário
  async addStudentToUser(userId: string, studentData: any) {
    return prisma.userPerfil.create({
      data: {
        ...studentData,
        professorId: userId,
      },
    });
  }

  // Atualizar informações de um aluno relacionado
  async updateUserStudent(userId: string, studentId: string, studentData: any) {
    return prisma.userPerfil.update({
      where: { id: studentId },
      data: {
        ...studentData,
        professorId: userId,
      },
    });
  }

  // Remover um aluno relacionado
  async removeStudentFromUser(userId: string, studentId: string) {
    return prisma.userPerfil.delete({
      where: { id: studentId },
    });
  }

  // Métodos para grupos
  async getUserGroups(userId: string): Promise<Grupo[]> {
    // Primeiro buscar o UserPerfil.id baseado no User.id
    const userPerfil = await prisma.userPerfil.findUnique({
      where: { userId: userId },
      select: { id: true }
    });

    if (!userPerfil) {
      return []; // Retorna array vazio se não encontrar o perfil
    }

    return prisma.grupo.findMany({
      where: { criadoPorId: userPerfil.id },
      select: {
        id: true,
        nome: true,
        criadoPorId: true,
        criadoEm: true,
        atualizadoEm: true,
        membros: {
          select: {
            id: true,
            userId: true,
            role: true,
            telefone: true,
            dataNascimento: true,
            genero: true,
            professorId: true,
            grupoId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async createUserGroup(userId: string, groupData: any) {
    // Primeiro buscar o UserPerfil.id baseado no User.id
    const userPerfil = await prisma.userPerfil.findUnique({
      where: { userId: userId },
      select: { id: true }
    });

    if (!userPerfil) {
      throw new Error(`UserPerfil não encontrado para userId: ${userId}`);
    }

    return prisma.grupo.create({
      data: {
        ...groupData,
        criadoPorId: userPerfil.id,
      },
      select: {
        id: true,
        nome: true,
        criadoPorId: true,
        criadoEm: true,
        atualizadoEm: true,
        membros: {
          select: {
            id: true,
            userId: true,
            role: true,
            telefone: true,
            dataNascimento: true,
            genero: true,
            professorId: true,
            grupoId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async updateUserGroup(userId: string, groupId: string, groupData: any) {
    // Primeiro buscar o UserPerfil.id baseado no User.id
    const userPerfil = await prisma.userPerfil.findUnique({
      where: { userId: userId },
      select: { id: true }
    });

    if (!userPerfil) {
      throw new Error(`UserPerfil não encontrado para userId: ${userId}`);
    }

    return prisma.grupo.update({
      where: { id: groupId },
      data: {
        ...groupData,
        criadoPorId: userPerfil.id,
      },
      select: {
        id: true,
        nome: true,
        criadoPorId: true,
        criadoEm: true,
        atualizadoEm: true,
        membros: {
          select: {
            id: true,
            userId: true,
            role: true,
            telefone: true,
            dataNascimento: true,
            genero: true,
            professorId: true,
            grupoId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async deleteUserGroup(userId: string, groupId: string) {
    try {
      console.log(`[Repository] Iniciando exclusão do grupo ${groupId} para userId ${userId}`);
      
      // Buscar o perfil do professor (userId é User.id, precisamos do UserPerfil.id)
      const professorPerfil = await this.getUserProfileByUserId(userId);
      if (!professorPerfil || professorPerfil.role !== 'professor') {
        throw new Error("Professor não encontrado");
      }

      // Verificar se o grupo existe e pertence ao professor
      const grupo = await prisma.grupo.findFirst({
        where: {
          id: groupId,
          criadoPorId: professorPerfil.id // usar o ID do perfil, não do user
        },
        include: {
          membros: true
        }
      });

      if (!grupo) {
        throw new Error('Grupo não encontrado ou não pertence ao professor');
      }

      console.log(`[Repository] Grupo encontrado: ${grupo.nome} com ${grupo.membros.length} membros`);

      // Usar transação para garantir consistência
      return await prisma.$transaction(async (tx) => {
        console.log(`[Repository] Removendo ${grupo.membros.length} membros do grupo`);
        
        // 1. Remover todos os membros do grupo (limpar relação many-to-many)
        await tx.grupo.update({
          where: { id: groupId },
          data: {
            membros: {
              set: [] // Remove todos os relacionamentos
            }
          }
        });

        // 2. Deletar o grupo
        const grupoExcluido = await tx.grupo.delete({
          where: { id: groupId }
        });

        console.log(`[Repository] Grupo ${groupId} excluído com sucesso`);
        return grupoExcluido;
      });

    } catch (error) {
      console.error('[Repository] Erro ao excluir grupo:', error);
      throw error;
    }
  }

  async getUserWithAccounts(userId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true, // Certifique-se de usar o nome correto da relação
      },
    });
  }

  async create(
    data: Prisma.UserPerfilUncheckedCreateInput
  ): Promise<UserPerfil> {
    return prisma.userPerfil.create({
      data: {
        ...data,
        genero: data.genero || "não especificado", // Define um valor padrão
        dataNascimento:
          data.dataNascimento instanceof Date
            ? data.dataNascimento.toISOString()
            : data.dataNascimento,
      },
    });
  }

  async findSessionByToken(sessionToken: string): Promise<Session | null> {
    return prisma.session.findUnique({
      where: { sessionToken },
      include: {
        user: true, // Inclui os dados do usuário associado à sessão, se necessário
      },
    });
  }

  async createProfile(
    userId: string,
    data: Partial<UserPerfil>
  ): Promise<UserPerfil> {
    try {
      console.log("Persistindo dados no banco:", data);

      const newProfile = await prisma.userPerfil.create({
        data: {
          userId,
          telefone: data.telefone,
          dataNascimento: data.dataNascimento,
          genero: data.genero,
          role: data.role,
        },
      });

      console.log("Dados persistidos no banco:", newProfile);

      return newProfile;
    } catch (error) {
      console.error("Erro no repositório:", error);
      throw new Error("Erro ao persistir os dados no banco.");
    }
  }

  async hasValidAvaliacao(userPerfilId: string): Promise<boolean> {
    const hoje = new Date();
    const avaliacao = await prisma.avaliacao.findFirst({
      where: {
        userPerfilId,
        status: { in: ["valida", "pendente"] }, // Agora aceita avaliações "valida" OU "pendente"
        OR: [{ validadeAte: null }, { validadeAte: { gte: hoje } }],
      },
    });
    return !!avaliacao;
  }

  async listarAvaliacoesAluno(userPerfilId: string) {
    return prisma.avaliacao.findMany({
      where: { userPerfilId },
      orderBy: { createdAt: "desc" },
    });
  }

  async cadastrarAvaliacaoAluno(userPerfilId: string, dados: any) {
    return prisma.avaliacao.create({
      data: {
        userPerfilId,
        tipo: dados.tipo,
        status: dados.status,
        resultado: dados.resultado,
        validadeAte: dados.validadeAte ? new Date(dados.validadeAte) : null,
        objetivoClassificado: dados.objetivoClassificado ?? null,
      },
    });
  }

  async atualizarAvaliacaoAluno(avaliacaoId: string, dados: any) {
    return prisma.avaliacao.update({
      where: { id: avaliacaoId },
      data: {
        status: dados.status,
        validadeAte: dados.validadeAte ? new Date(dados.validadeAte) : undefined,
        resultado: dados.resultado,
      },
    });
  }

  // Busca professor por ID
  async getProfessorById(id: string) {
    // Busca apenas se for professor
    return prisma.user.findFirst({
      where: {
        id,
        userPerfil: {
          some: { role: "professor" },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
  }

  async buscarUltimasAvaliacoesMedidas(userPerfilId: string) {
    return prisma.avaliacao.findMany({
      where: { userPerfilId },
      orderBy: { data: "desc" },
      take: 2,
      select: {
        id: true,
        data: true,
        tipo: true,
        status: true,
        resultado: true, // Aqui ficam as medidas detalhadas se for JSON
      },
    });
  }

  async buscarAvaliacaoPorId(avaliacaoId: string) {
    return prisma.avaliacao.findUnique({
      where: { id: avaliacaoId },
    });
  }

  async getUserGroupById(perfilId: string, groupId: string) {
    // Receber diretamente o perfilId (UserPerfil.id) para buscar grupos
    console.log('[Repository] getUserGroupById - perfilId:', perfilId, 'groupId:', groupId);
    
    return prisma.grupo.findFirst({
      where: {
        id: groupId,
        criadoPorId: perfilId, // usar o ID do perfil diretamente
      },
      include: {
        membros: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async addStudentToGroup(groupId: string, studentId: string) {
    console.log('[Repository] addStudentToGroup - Iniciando:', { groupId, studentId });
    
    try {
      // Verificar se o grupo existe
      const group = await prisma.grupo.findUnique({
        where: { id: groupId },
        include: { membros: true }
      });
      
      if (!group) {
        throw new Error(`Grupo não encontrado: ${groupId}`);
      }
      
      // Verificar se o aluno existe
      const student = await prisma.userPerfil.findUnique({
        where: { id: studentId },
        include: { user: true }
      });
      
      if (!student) {
        throw new Error(`Aluno não encontrado: ${studentId}`);
      }
      
      console.log('[Repository] addStudentToGroup - Grupo encontrado:', group.nome);
      console.log('[Repository] addStudentToGroup - Aluno encontrado:', student.user.name);
      console.log('[Repository] addStudentToGroup - Membros atuais:', group.membros.length);
      
      // Verificar se já está no grupo
      const jaEstaNoGrupo = group.membros.some(m => m.id === studentId);
      if (jaEstaNoGrupo) {
        console.log('[Repository] addStudentToGroup - Aluno já está no grupo');
        return student;
      }
      
      // Adicionar ao grupo usando o relacionamento many-to-many
      const updatedGroup = await prisma.grupo.update({
        where: { id: groupId },
        data: {
          membros: {
            connect: { id: studentId }
          }
        },
        include: {
          membros: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      });
      
      console.log('[Repository] addStudentToGroup - Sucesso! Novos membros:', updatedGroup.membros.length);
      console.log('[Repository] addStudentToGroup - Membros:', updatedGroup.membros.map(m => m.user.name));
      
      // Retornar o aluno atualizado
      const updatedStudent = await prisma.userPerfil.findUnique({
        where: { id: studentId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          grupos: true
        }
      });
      
      return updatedStudent;
      
    } catch (error) {
      console.error('[Repository] addStudentToGroup - Erro:', error);
      throw error;
    }
  }

  async removeStudentFromGroup(groupId: string, studentId: string) {
    console.log('[Repository] removeStudentFromGroup - Iniciando:', { groupId, studentId });
    
    try {
      // Remover do grupo usando o relacionamento many-to-many
      const updatedGroup = await prisma.grupo.update({
        where: { id: groupId },
        data: {
          membros: {
            disconnect: { id: studentId }
          }
        },
        include: {
          membros: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      });
      
      console.log('[Repository] removeStudentFromGroup - Sucesso! Membros restantes:', updatedGroup.membros.length);
      
      // Retornar o aluno atualizado
      const updatedStudent = await prisma.userPerfil.findUnique({
        where: { id: studentId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          grupos: true
        }
      });
      
      return updatedStudent;
      
    } catch (error) {
      console.error('[Repository] removeStudentFromGroup - Erro:', error);
      throw error;
    }
  }

  async getGroupStudents(groupId: string) {
    console.log('[Repository] getGroupStudents - Buscando membros do grupo:', groupId);
    
    // Buscar o grupo com seus membros usando o relacionamento many-to-many
    const group = await prisma.grupo.findUnique({
      where: { id: groupId },
      include: {
        membros: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      }
    });
    
    if (!group) {
      console.log('[Repository] getGroupStudents - Grupo não encontrado');
      return [];
    }
    
    console.log('[Repository] getGroupStudents - Membros encontrados:', group.membros.length);
    
    return group.membros;
  }
}

// Ensure this file exports findUserByEmail as a named export
export async function findUserByEmail(email: string): Promise<User | null> {
  // Busca o usuário pelo email usando o método findUnique do Prisma
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user || null;
}
export { User };
