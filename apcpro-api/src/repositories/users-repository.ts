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

  // Buscar alunos relacionados a um usuário (professor)
  async getUserStudents(userId: string) {
    return prisma.userPerfil.findMany({
      where: {
        professorId: userId,
        role: "aluno", // garante que só retorna perfis de alunos
      },
      include: {
        user: true, // inclui dados do usuário vinculado ao perfil
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
    return prisma.grupo.findMany({
      where: { criadoPorId: userId },
      select: {
        id: true,
        nome: true,
        criadoPorId: true,
        criadoEm: true, // Certifique-se de incluir criadoEm
        atualizadoEm: true, // Certifique-se de incluir atualizadoEm
        membros: {
          select: {
            id: true,
            telefone: true,
            professorId: true,
            grupoId: true,
          },
        },
      },
    });
  }

  async createUserGroup(userId: string, groupData: any) {
    return prisma.grupo.create({
      data: {
        ...groupData,
        criadoPorId: userId,
      },
    });
  }

  async updateUserGroup(userId: string, groupId: string, groupData: any) {
    return prisma.grupo.update({
      where: { id: groupId },
      data: {
        ...groupData,
        criadoPorId: userId,
      },
    });
  }

  async deleteUserGroup(userId: string, groupId: string) {
    return prisma.grupo.delete({
      where: { id: groupId },
    });
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
