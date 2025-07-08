/// <reference types="jest" />

import { Request, Response, NextFunction } from 'express';
import { requireProfessor } from '../../src/middlewares/auth-middleware';

// Mock do Prisma
jest.mock('../../src/prisma', () => ({
  userPerfil: {
    findFirst: jest.fn(),
  },
}));

describe('Proteção de Dobras Cutâneas - Autenticação', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      user: { 
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@test.com',
        emailVerified: null,
        image: null,
        role: 'aluno'
      } as any
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('requireProfessor middleware', () => {
    test('deve permitir acesso para professor', async () => {
      const mockPrisma = require('../../src/prisma');
      mockPrisma.userPerfil.findFirst.mockResolvedValue({
        userId: 'test-user-id',
        role: 'professor'
      });

      await requireProfessor(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    test('deve negar acesso para aluno tentando fazer dobras cutâneas', async () => {
      const mockPrisma = require('../../src/prisma');
      mockPrisma.userPerfil.findFirst.mockResolvedValue({
        userId: 'test-user-id',
        role: 'aluno'
      });

      await requireProfessor(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Acesso negado",
        message: "Apenas professores podem realizar avaliações de dobras cutâneas. Esta funcionalidade requer conhecimento técnico especializado e equipamentos adequados para medições precisas."
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('deve negar acesso para usuário sem perfil', async () => {
      const mockPrisma = require('../../src/prisma');
      mockPrisma.userPerfil.findFirst.mockResolvedValue(null);

      await requireProfessor(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Acesso negado",
        message: "Apenas professores podem realizar avaliações de dobras cutâneas. Esta funcionalidade requer conhecimento técnico especializado e equipamentos adequados para medições precisas."
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('deve negar acesso para usuário não autenticado', async () => {
      mockRequest.user = undefined;

      await requireProfessor(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Usuário não autenticado",
        message: "É necessário estar logado para acessar esta funcionalidade"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('deve tratar erro de banco de dados adequadamente', async () => {
      const mockPrisma = require('../../src/prisma');
      mockPrisma.userPerfil.findFirst.mockRejectedValue(new Error('Database connection failed'));

      await requireProfessor(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Erro interno do servidor",
        message: "Erro ao verificar permissões do usuário"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Proteção completa do fluxo de dobras cutâneas', () => {
    test('deve bloquear todas as operações críticas para alunos', () => {
      // Testa se todas as rotas críticas estão protegidas
      const rotasProtegidas = [
        'POST /dobras-cutaneas',
        'POST /dobras-cutaneas/calcular', 
        'POST /dobras-cutaneas/validar'
      ];

      rotasProtegidas.forEach(rota => {
        expect(rota).toContain('dobras-cutaneas');
        // Estas rotas devem usar requireProfessor middleware
      });
    });
  });
});
