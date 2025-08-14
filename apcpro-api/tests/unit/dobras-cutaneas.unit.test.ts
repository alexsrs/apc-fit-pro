// Testes unitários unificados para Dobras Cutâneas (protocolos, auth)

// Mock global do Prisma para interceptar requireProfessor
const mockPrisma: any = {
  userPerfil: {
    findFirst: jest.fn(),
  },
};
jest.mock('../../src/prisma', () => mockPrisma);

import { calcularFaulkner, type MedidasFaulkner } from '../../src/utils/protocolos-dobras/faulkner';
import {
  calcularGuedesHomem,
  calcularGuedesMulher,
  type MedidasGuedesHomem,
  type MedidasGuedesMulher
} from '../../src/utils/protocolos-dobras/guedes';
import { requireProfessor } from '../../src/middlewares/auth-middleware';
import type { Request, Response, NextFunction } from 'express';

// --- Testes dos Protocolos ---
describe('Dobras Cutâneas - Protocolos', () => {
  describe('Protocolo Faulkner', () => {
    test('deve calcular percentual de gordura para homem', () => {
      const medidas: MedidasFaulkner = { triceps: 12.5, subescapular: 15.2, suprailiaca: 18.1, abdominal: 10.0 };
      const genero = 'M' as const;
      const peso = 75.0;
      const resultado = calcularFaulkner(medidas, genero, peso);
      expect(resultado).toBeDefined();
      expect(resultado.percentualGordura).toBeGreaterThan(0);
    });
    // ...outros testes do protocolo...
  });
  describe('Protocolo Guedes', () => {
    test('deve calcular percentual de gordura para mulher', () => {
      const medidas: MedidasGuedesMulher = { subescapular: 15, suprailiaca: 18, coxa: 20 };
      const idade = 30;
      const peso = 60;
      const resultado = calcularGuedesMulher(medidas, idade, peso);
      expect(resultado).toBeDefined();
      expect(resultado.percentualGordura).toBeGreaterThan(0);
    });
    test('deve calcular percentual de gordura para homem', () => {
      const medidas: MedidasGuedesHomem = { triceps: 12, abdominal: 15, suprailiaca: 18 };
      const idade = 28;
      const peso = 75;
      const resultado = calcularGuedesHomem(medidas, idade, peso);
      expect(resultado).toBeDefined();
      expect(resultado.percentualGordura).toBeGreaterThan(0);
    });
  });
});

// --- Testes de Auth ---
describe('Proteção de Dobras Cutâneas - Autenticação', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = { user: { id: 'test-user-id', role: 'aluno' } as any };
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockNext = jest.fn();
  });

  test('deve negar acesso para aluno tentando fazer dobras cutâneas', async () => {
    mockPrisma.userPerfil.findFirst.mockResolvedValue({ userId: 'test-user-id', role: 'aluno' });
    await requireProfessor(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );
    expect(mockResponse.status).toHaveBeenCalledWith(403);
  });
  // ...outros testes de auth...
});
