import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    //log: ["query", "info", "warn", "error"], // Ativa logs para depuração
    log: ["query", "error"], // Ativa logs para depuração
  });