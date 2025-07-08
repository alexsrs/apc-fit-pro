/// <reference types="jest" />

import { PrismaClient } from '@prisma/client';

// Mock do Prisma para testes
export const mockPrisma = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  userPerfil: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  avaliacao: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

// Setup global para todos os testes
beforeAll(async () => {
  // Configurações globais de teste
});

afterAll(async () => {
  // Limpeza após todos os testes
});

beforeEach(() => {
  // Reset dos mocks antes de cada teste
  jest.clearAllMocks();
});

afterEach(() => {
  // Limpeza após cada teste
});

// Variáveis globais para testes
global.console = {
  ...console,
  // Suprimir logs durante os testes
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
