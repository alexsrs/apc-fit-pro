import { PrismaClient, UserPerfil } from "@prisma/client";
const prisma = new PrismaClient();

export class UserProfileRepository {
  [x: string]: any;
  async findProfileByUserId(userId: string): Promise<UserPerfil | null> {
    return prisma.userPerfil.findUnique({
      where: { userId },
    });
  }

  async deleteProfile(userId: string, profileId: string): Promise<void> {
    await prisma.userPerfil.delete({
      where: { id: profileId },
    });
  }
}