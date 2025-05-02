import { UserRepository } from '../repositories/users-repository';
import { User, UserPerfil } from '../models/user-model';

export class UsersService {
  private userRepository = new UserRepository();

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.getAll();
    return users.map(user => ({
      ...user,
      accounts: user.accounts || [], // Adicione valores reais ou mantenha como array vazio
      sessions: user.sessions || [], // Adicione valores reais ou mantenha como array vazio
    })) as User[];
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.getById(id);
    if (!user) return null;

    return {
      ...user,
      accounts: user.accounts || [], // Adicione valores reais ou mantenha como array vazio
      sessions: user.sessions || [], // Adicione valores reais ou mantenha como array vazio
    } as User;
  }

  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.userRepository.create(data);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }

  async getUserProfiles(userId: string): Promise<UserPerfil[]> {
    return this.userRepository.getUserProfiles(userId);
  }

  async createUserProfile(userId: string, data: Partial<UserPerfil>): Promise<UserPerfil> {
    return this.userRepository.createUserProfile(userId, data);
  }

  async updateUserProfile(userId: string, profileId: string, data: Partial<UserPerfil>): Promise<UserPerfil | null> {
    try {
      const existingProfile = await this.userRepository.getUserProfileById(profileId);
      if (!existingProfile || existingProfile.userId !== userId) {
        return null; // Retorna null se o perfil não existir ou não pertencer ao usuário
      }

      return this.userRepository.updateUserProfile(userId, profileId, data);
    } catch (error) {
      console.error("Erro no serviço ao atualizar perfil:", error);
      throw new Error("Erro ao atualizar perfil.");
    }
  }

  async deleteUserProfile(userId: string, profileId: string): Promise<void> {
    return this.userRepository.deleteUserProfile(userId, profileId);
  }

  // Método para buscar alunos relacionados a um usuário
  async getUserStudents(userId: string): Promise<UserPerfil[]> {
    return this.userRepository.getUserStudents(userId);
  }

  // Método para adicionar um aluno a um usuário
  async addStudentToUser(userId: string, studentData: Partial<UserPerfil>): Promise<UserPerfil> {
    return this.userRepository.addStudentToUser(userId, studentData);
  }

  // Método para atualizar informações de um aluno relacionado
  async updateUserStudent(userId: string, studentId: string, studentData: Partial<UserPerfil>): Promise<UserPerfil> {
    return this.userRepository.updateUserStudent(userId, studentId, studentData);
  }

  // Método para remover um aluno relacionado
  async removeStudentFromUser(userId: string, studentId: string): Promise<void> {
    return this.userRepository.removeStudentFromUser(userId, studentId);
  }

  // Métodos para grupos
  async getUserGroups(userId: string): Promise<any[]> {
    return this.userRepository.getUserGroups(userId);
  }

  async createUserGroup(userId: string, groupData: any): Promise<any> {
    return this.userRepository.createUserGroup(userId, groupData);
  }

  async updateUserGroup(userId: string, groupId: string, groupData: any): Promise<any> {
    return this.userRepository.updateUserGroup(userId, groupId, groupData);
  }

  async deleteUserGroup(userId: string, groupId: string): Promise<void> {
    return this.userRepository.deleteUserGroup(userId, groupId);
  }
}
