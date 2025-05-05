import { UserRepositoryClass as ExternalUserRepositoryClass, UserRepositoryClass } from '../repositories/users-repository';
import { UserProfileRepository } from '../repositories/user-profile-repository';
import { Grupo, User, UserPerfil } from '../models/user-model';
import { normalizeUserPerfil } from '../utils/normalize';
import { sanitizeUserPerfil } from '../utils/sanitize';
import { userProfileSchema } from '../validators/user-profile.validator';
import { grupoSchema } from "../validators/group.validator";

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
        email: user.email,
        image: user.image ?? null, // Substitui undefined por null
        emailVerified: user.emailVerified ?? null, // Substitui undefined por null
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

  async getUser(): Promise<{ id: string; name: string | null; email: string } | null> {
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

  async createUserProfile(userId: string, data: Partial<UserPerfil>): Promise<UserPerfil> {
    try {
      const validatedData = userProfileSchema.parse(data);
      return await this.userRepository.createUserProfile(userId, {
        ...validatedData,
        telefone: validatedData.telefone ?? undefined,
        dataNascimento: validatedData.dataNascimento ? new Date(validatedData.dataNascimento) : undefined,
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

  async getUserProfile(userId: string): Promise<UserPerfil | null> {
    try {
      const userProfile = await this.userProfileRepository.findProfileByUserId(userId);
      return userProfile ?? null; // Retorna null se o perfil não for encontrado
    } catch (error) {
      handleServiceError(error, "Não foi possível buscar o perfil do usuário.");
    }
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

async function findUserInDatabase(this: any, id: string): Promise<User | null> {
  return await this.userRepository.findById(id); // Certifique-se de que o método `findById` existe no repositório
}

class LocalUserRepositoryClass {
  async getAll(): Promise<User[]> {
    // Implementation here
    return [] as User[]; // Replace with actual database fetching logic
  }

  async getCurrentUser(): Promise<{ id: string; name: string | null; email: string } | null> {
    // Implementation here
    return { id: 'default-id', name: 'Default User', email: 'default@example.com' }; // Replace with actual logic
  }
}

export { UserRepositoryClass };

