// src/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Loga queries e erros
});

export default prisma;