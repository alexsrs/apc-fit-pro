import { z } from "zod";

export const membroSchema = z.object({
  id: z.string(),
  role: z.enum(['admin', 'aluno', 'professor']),
  telefone: z.string().nullable().optional(),
  dataNascimento: z.date(),
  genero: z.enum(['masculino', 'feminino', 'outro']),
  professorId: z.string().nullable().optional(),
  grupoId: z.string().nullable().optional(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const grupoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  criadoPorId: z.string(),
  criadoEm: z.date().default(() => new Date()),
  atualizadoEm: z.date().default(() => new Date()),
  membros: z.array(membroSchema).optional().default([]),
});