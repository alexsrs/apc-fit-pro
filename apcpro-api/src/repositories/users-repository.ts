import { PrismaClient, User, UserPerfil } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  
  async getAll(): Promise<User[]> {
    return prisma.user.findMany({
      include: {
        accounts: true,
        sessions: true,
      },
    });
  }

  async getById(id: string): Promise<User | null> {
    if (!id) {
        console.error("O parâmetro 'id' está vazio ou nulo.");
        throw new Error("ID inválido.");
    }

    console.log(`Buscando usuário com ID: ${id}`);
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            accounts: true,
            sessions: true,
        },
    });

    if (!user) {
        console.warn(`Nenhum usuário encontrado com o ID: ${id}`);
    }

    return user;
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async getUserProfiles(userId: string): Promise<UserPerfil[]> {
    const userProfiles = await prisma.userPerfil.findMany({
      where: { userId },
    });
    return userProfiles;
  }

  async createUserProfile(userId: string, data: any): Promise<any> {
    if (data.professorId) {
      const professorExists = await prisma.userPerfil.findUnique({
        where: { id: data.professorId },
      });

      if (!professorExists) {
        throw new Error("O professorId fornecido não é válido.");
      }
    }

    return prisma.userPerfil.create({
      data: {
        userId,
        role: data.role,
        telefone: data.telefone,
        dataNascimento: data.dataNascimento,
        genero: data.genero,
        professorId: data.professorId || null, // Permitir null
        grupoId: data.grupoId || null, // Permitir null
      },
    });
  }

  async updateUserProfile(userId: string, profileId: string, data: Partial<UserPerfil>): Promise<UserPerfil> {
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

  // Buscar alunos relacionados a um usuário
  async getUserStudents(userId: string) {
    return prisma.userPerfil.findMany({
      where: { professorId: userId },
      include: { user: true },
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
  async getUserGroups(userId: string) {
    return prisma.grupo.findMany({
      where: { criadoPorId: userId },
      include: { membros: true },
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
}
