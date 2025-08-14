import prisma from "../prisma";

export const authenticateWithGoogle = async ({ email, name, image }: { email: string; name: string; image?: string }) => {
  // Verifica se o usuário já existe no banco de dados
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Cria um novo usuário se ele não existir
    user = await prisma.user.create({
      data: {
        email,
        name,
        image: image || null,
      },
    });
  }

  return user;
};
