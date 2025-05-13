import prisma from "../prisma"; // Certifique-se de que o Prisma está configurado corretamente
import { UserPerfil } from "../models/user-model";

export class UserProfileRepository {
  async createProfile(userId: string, data: Partial<UserPerfil>): Promise<UserPerfil> {
    return await prisma.userPerfil.create({
      data: {
        userId,
        telefone: data.telefone,
        dataNascimento: data.dataNascimento,
        genero: data.genero,
        role: data.role,
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
}