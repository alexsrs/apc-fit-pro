// Testes unitários unificados para Avaliação (controller, service, utils)

import { AvaliacaoService } from '../../src/services/avaliacao-service';
import { calcularMedidasController } from '../../src/controllers/avaliacao-controller';
import { generoToNumber } from '../../src/utils/avaliacaoMedidas';
import { Genero } from '../../src/models/genero-model';
import { Request, Response, NextFunction } from 'express';

// --- Testes do Service ---
describe('AvaliacaoService', () => {
  describe('Instanciação básica', () => {
    it('deve instanciar sem erros', () => {
      expect(() => new AvaliacaoService()).not.toThrow();
    });
    it('deve ter estrutura básica', () => {
      const service = new AvaliacaoService();
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(AvaliacaoService);
    });
  });
  // ...outros testes do service podem ser copiados aqui...
});

// --- Testes do Controller ---
describe('AvaliacaoController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = { body: {} };
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    mockNext = jest.fn();
  });

  describe('calcularMedidasController', () => {
    test('deve retornar erro para dados obrigatórios ausentes', () => {
      mockRequest.body = { peso: 70 };
      calcularMedidasController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        erro: "Dados obrigatórios ausentes",
        message: "peso, altura, idade e genero são obrigatórios"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    // ...outros testes do controller podem ser copiados aqui...
  });
});

// --- Testes de Utils ---
describe('AvaliacaoMedidas Utils', () => {
  describe('generoToNumber', () => {
    it('deve converter Genero.Masculino para 1', () => {
      const resultado = generoToNumber(Genero.Masculino);
      expect(resultado).toBe(1);
    });
    it('deve converter Genero.Feminino para 0', () => {
      const resultado = generoToNumber(Genero.Feminino);
      expect(resultado).toBe(0);
    });
    it('deve retornar 0 para valores inválidos', () => {
      const resultado = generoToNumber(null as any);
      expect(resultado).toBe(0);
    });
  });
  // ...outros testes de utils podem ser copiados aqui...
});

// ...outros blocos de testes podem ser adicionados conforme necessário...
