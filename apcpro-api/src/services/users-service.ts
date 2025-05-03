import { UserRepositoryClass } from '../repositories/users-repository';
import { Grupo, User, UserPerfil } from '../models/user-model';
import { normalizeUserPerfil } from '../utils/normalize';
import { sanitizeUserPerfil } from '../utils/sanitize';
import { userProfileSchema } from '../validators/user-profile.validator';
import { grupoSchema } from "../validators/group.validator";
import { v4 as uuidv4 } from 'uuid';

function processUserPerfil(profile: Partial<UserPerfil>): UserPerfil {
  return normalizeUserPerfil(
    sanitizeUserPerfil({
      ...profile,
      id: profile.id ?? '',
      professorId: profile.professorId ?? undefined,
      grupoId: profile.grupoId ?? undefined,
      telefone: profile.telefone ?? undefined,
      dataNascimento: profile.dataNascimento ?? undefined,
      genero: profile.genero ?? undefined,
    })
  );
}

function handleServiceError(error: unknown, message: string): never {
  console.error(message, error);
  throw new Error(message);
}

// Adaptador para o tipo User
function adaptToUser(user: { id: string; name: string | null; email: string }): User {
  return {
    ...user,
    name: user.name ?? 'Default Name', // Garante que 'name' seja uma string
    emailVerified: null, // Valor padrão
    image: null,         // Valor padrão
  };
}

export class UsersService {
  findUserById(userId: string) {
    throw new Error("Method not implemented.");
  }
  deleteUserProfile(userId: string, profileId: string) {
    throw new Error("Method not implemented.");
  }
  getUserStudents(userId: string) {
    throw new Error("Method not implemented.");
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
  createUserGroup(userId: string, body: any) {
    throw new Error("Method not implemented.");
  }
  updateUserGroup(userId: string, groupId: string, body: any) {
    throw new Error("Method not implemented.");
  }
  deleteUserGroup(userId: string, groupId: string) {
    throw new Error("Method not implemented.");
  }
  private userRepository: UserRepositoryClass;

  constructor() {
    this.userRepository = new UserRepositoryClass();
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.getAll();
      return users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: null, // Valor padrão
        image: null,         // Valor padrão
      }));
    } catch (error) {
      handleServiceError(error, "Não foi possível buscar os usuários.");
    }
  }

  async getUserById(id: string): Promise<User> {
    const user = await findUserInDatabase(id);

    if (user === null || user === undefined) {
      throw new Error("Usuário não encontrado.");
    }

    return user;
  }

  async getUser(): Promise<{ id: string; name: string; email: string } | null> {
    const user = await this.userRepository.getCurrentUser(); // Assuming a method to get the current user
    return user !== null && typeof user === 'object' ? adaptToUser({ 
        id: user.id, 
        name: user.name ?? 'Default Name', 
        email: user.email ?? '' 
    }) : null;
  }

  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const sanitizedData = { 
        ...data, 
        id: uuidv4(), 
        name: data.name ?? 'Default Name', 
        email: data.email ?? '', 
        emailVerified: null, 
        image: null 
      };
      return await this.userRepository.create(sanitizedData);
    } catch (error) {
      handleServiceError(error, "Não foi possível criar o usuário.");
    }
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      return await this.userRepository.update(id, data);
    } catch (error) {
      handleServiceError(error, "Não foi possível atualizar o usuário.");
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      handleServiceError(error, "Não foi possível deletar o usuário.");
    }
  }

  async getUserProfiles(userId: string): Promise<UserPerfil[]> {
    try {
      const profiles = await this.userRepository.getUserProfiles(userId);
      return profiles.map(processUserPerfil);
    } catch (error) {
      handleServiceError(error, "Não foi possível buscar os perfis do usuário.");
    }
  }

  async createUserProfile(userId: string, data: Partial<UserPerfil>): Promise<UserPerfil> {
    try {
      const validatedData = userProfileSchema.parse(data);
      return await this.userRepository.createUserProfile(userId, {
        ...validatedData,
        telefone: validatedData.telefone ?? undefined,
      });
    } catch (error) {
      handleServiceError(error, "Dados inválidos para criar o perfil do usuário.");
    }
  }

  async getUserGroups(userId: string): Promise<Grupo[]> {
    try {
      const groups = await this.userRepository.getUserGroups(userId);
      return groups.map((group) => this.processGroup(group));
    } catch (error) {
      handleServiceError(error, "Não foi possível buscar os grupos do usuário.");
    }
  }

  private processGroup(group: Grupo): Grupo {
    return {
      ...grupoSchema.parse({
        ...group,
        criadoEm: group.criadoEm ?? new Date(),
        atualizadoEm: group.atualizadoEm ?? new Date(),
      }),
      membros: group.membros.map((membro) => ({
        ...membro,
        professorId: membro.professorId ?? undefined,
      })),
    };
  }
}
function findUserInDatabase(id: string) {
  throw new Error('Function not implemented.');
}

