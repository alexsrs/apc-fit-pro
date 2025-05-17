import {
  UserRepositoryClass as ExternalUserRepositoryClass,
  UserRepositoryClass,
} from "../repositories/users-repository";
import { UserProfileRepository } from "../repositories/user-profile-repository";
import { Grupo, User, UserPerfil } from "../models/user-model";
import { userProfileSchema } from "../validators/user-profile.validator";
import { grupoSchema } from "../validators/group.validator";

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
