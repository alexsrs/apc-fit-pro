/**
 * Testes Unitários - Avaliação Controller
 * Testa as validações do controller de avaliações
 */

import { Request, Response, NextFunction } from 'express';
import { calcularMedidasController } from '../../src/controllers/avaliacao-controller';

describe('AvaliacaoController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Reset todos os mocks
    jest.clearAllMocks();
    
    // Mock do request e response
    mockRequest = {
      body: {}
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
  });

  describe('calcularMedidasController', () => {
    test('deve retornar erro para dados obrigatórios ausentes', () => {
      // Arrange - Dados sem campos obrigatórios
      mockRequest.body = {
        peso: 70
        // Faltando altura, idade e genero
      };

      // Act
      calcularMedidasController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert - Deve retornar erro 400 por dados faltantes
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        erro: "Dados obrigatórios ausentes",
        message: "peso, altura, idade e genero são obrigatórios"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('deve retornar erro para valores inválidos (negativos/zero)', () => {
      // Arrange - Dados com valores inválidos
      mockRequest.body = {
        peso: -10,
        altura: 0,
        idade: 25,
        genero: 'masculino'
      };

      // Act
      calcularMedidasController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert - Deve retornar erro 400 por valores inválidos
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        erro: "Dados inválidos",
        message: "peso, altura e idade devem ser maiores que zero"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('deve retornar sucesso para dados válidos', () => {
      // Arrange - Dados válidos
      mockRequest.body = {
        peso: 70,
        altura: 1.75,
        idade: 25,
        genero: 'masculino'
      };

      // Act
      calcularMedidasController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert - Deve retornar status 200 com resultado calculado
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          imc: expect.any(Number),
          classificacaoIMC: expect.any(String)
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('deve validar dados ausentes - altura', () => {
      // Arrange
      mockRequest.body = {
        peso: 70,
        idade: 25,
        genero: 'masculino'
        // altura ausente
      };

      // Act
      calcularMedidasController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        erro: "Dados obrigatórios ausentes",
        message: "peso, altura, idade e genero são obrigatórios"
      });
    });

    test('deve validar gênero ausente', () => {
      // Arrange
      mockRequest.body = {
        peso: 70,
        altura: 1.75,
        idade: 25
        // genero ausente
      };

      // Act
      calcularMedidasController(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        erro: "Dados obrigatórios ausentes",
        message: "peso, altura, idade e genero são obrigatórios"
      });
    });
  });
});
