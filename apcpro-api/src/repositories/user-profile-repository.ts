import prisma from "../prisma"; // Certifique-se de que o Prisma está configurado corretamente
import { UserPerfil } from "../models/user-model";

export class UserProfileRepository {
  [x: string]: any;
  async createProfile(
    userId: string,
    data: Partial<UserPerfil>
  ): Promise<UserPerfil> {
    return await prisma.userPerfil.create({
      data: {
        userId,
        telefone: data.telefone,
        dataNascimento: data.dataNascimento,
        genero: data.genero,
        role: data.role,
        professorId: data.professorId ?? null, // <-- garantir que professorId é persistido
      },
    });
  }

  async findProfilesByUserId(userId: string): Promise<UserPerfil[]> {
    return await prisma.userPerfil.findMany({
      where: { userId },
    });
  }

  async deleteProfile(userId: string, profileId: string): Promise<void> {
    await prisma.userPerfil.delete({
      where: {
        id: profileId,
      },
    });
  }

  async findProfileById(userPerfilId: string): Promise<UserPerfil | null> {
    return await prisma.userPerfil.findUnique({
      where: { id: userPerfilId },
    });
  }
}
