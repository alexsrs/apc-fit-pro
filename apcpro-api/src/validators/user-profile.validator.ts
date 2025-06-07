import { z } from "zod";
import { Request, Response } from "express";
import prisma from "../prisma";

export const userProfileSchema = z.object({
  id: z.string().optional(),
  professorId: z.string().optional(),
  grupoId: z.string().optional(),
  telefone: z.string().optional(),
  dataNascimento: z.string().optional(), // Certifique-se de que o formato da data está correto
  genero: z.enum(["masculino", "feminino", "outro"]).optional(),
  role: z.enum(["aluno", "professor", "admin"]).optional(),
});

export async function handleCreateUserProfile(req: Request, res: Response) {
  try {
    const userIdOrInvite = req.params.userId;
    const data = req.body;

    // Tenta buscar o usuário pelo ID informado
    let user = await prisma.user.findUnique({ where: { id: userIdOrInvite } });

    // Se não encontrar, tente buscar por convite (exemplo: email no body)
    if (!user && data.email) {
      user = await prisma.user.findUnique({ where: { email: data.email } });
    }

    // Se ainda não encontrou, retorna erro claro
    if (!user) {
      return res
        .status(404)
        .json({
          error: "Usuário não encontrado para o ID ou convite informado.",
        });
    }

    // Cria o perfil usando o user.id real
    const userProfile = await createUserProfile(user.id, data);
    res.status(201).json(userProfile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Dados inválidos", details: error.errors });
    }
    console.error("Erro ao criar perfil de usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function createUserProfile(userId: string, data: any) {
  // Aqui pode manter a lógica já existente de validação e criação
  // Exemplo:
  // const validatedData = userProfileSchema.parse(data);
  // return await prisma.userPerfil.create({ data: { ...validatedData, userId } });
  // ...
}
