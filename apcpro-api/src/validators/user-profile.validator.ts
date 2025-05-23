import { z } from "zod";
import { Request, Response } from "express";

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
    const userId = req.params.userId;
    const data = req.body;

    const userProfile = await createUserProfile(userId, data);
    res.status(201).json(userProfile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Dados inválidos", details: error.errors });
    }
    console.error("Erro ao criar perfil de usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export function createUserProfile(userId: string, data: any) {
  // Implementation of the function
}