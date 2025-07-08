/**
 * Testes de Integração - Avaliações com JSON
 * Testa o fluxo completo de avaliações focando na estrutura JSON salva no banco
 */

import request from 'supertest';
import { createTestApp } from '../helpers/test-app';
import { Application } from 'express';

describe('Avaliacoes API - Integração JSON', () => {
  let app: Application;

  beforeAll(async () => {
    app = await createTestApp();
  });

  describe('POST /calcular-medidas', () => {
    test('deve retornar JSON válido para dados básicos', async () => {
      // Arrange
      const dadosBasicos = {
        peso: 70,
        altura: 175,
        genero: 'masculino',
        idade: 25,
        cintura: 85
      };

      // Act
      const response = await request(app)
        .post('/calcular-medidas')
        .send(dadosBasicos)
        .expect(200);

      // Assert
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toBeDefined();
      expect(typeof response.body).toBe('object');
      
      // Verifica campos obrigatórios para salvar no banco
      expect(response.body).toHaveProperty('imc');
      expect(response.body).toHaveProperty('classificacaoIMC');
      expect(typeof response.body.imc).toBe('number');
      expect(typeof response.body.classificacaoIMC).toBe('string');

      // Verifica se o JSON é válido
      const jsonString = JSON.stringify(response.body);
      expect(jsonString).toBeDefined();
      const parsed = JSON.parse(jsonString);
      expect(parsed).toEqual(response.body);
    });

    test('deve retornar JSON válido para dados completos com dobras', async () => {
      // Arrange
      const dadosCompletos = {
        peso: 75,
        altura: 180,
        genero: 'masculino',
        idade: 28,
        cintura: 85,
        quadril: 98,
        pescoco: 38,
        dobras: {
          triceps: 10,
          subescapular: 12,
          suprailiaca: 15,
          abdominal: 18
        }
      };

      // Act
      const response = await request(app)
        .post('/calcular-medidas')
        .send(dadosCompletos)
        .expect(200);

      // Assert
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toBeDefined();
      
      // Verifica campos básicos
      expect(response.body).toHaveProperty('imc');
      expect(response.body).toHaveProperty('classificacaoIMC');
      
      // Verifica campos de dobras cutâneas
      expect(response.body).toHaveProperty('percentualGC_Pollock');
      expect(response.body).toHaveProperty('classificacaoGC_Pollock');
      
      // Verifica RCQ
      expect(response.body).toHaveProperty('rcq');
      expect(response.body).toHaveProperty('classificacaoRCQ');

      // Verifica estrutura JSON
      expect(() => JSON.stringify(response.body)).not.toThrow();
      
      // Simula o que seria salvo no banco
      const avaliacaoParaSalvar = {
        tipo: 'medidas',
        status: 'pendente',
        resultado: response.body,
        validadeAte: null,
        objetivoClassificado: null
      };

      expect(() => JSON.stringify(avaliacaoParaSalvar)).not.toThrow();
    });

    test('deve retornar JSON válido para mulher com dados completos', async () => {
      // Arrange
      const dadosMulher = {
        peso: 60,
        altura: 165,
        genero: 'feminino',
        idade: 30,
        cintura: 68,
        quadril: 95,
        pescoco: 32
      };

      // Act
      const response = await request(app)
        .post('/calcular-medidas')
        .send(dadosMulher)
        .expect(200);

      // Assert
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.body).toBeDefined();
      
      // Verifica campos específicos para mulher
      expect(response.body).toHaveProperty('imc');
      expect(response.body).toHaveProperty('rcq');
      expect(response.body.rcq).toBeCloseTo(0.72, 2);
      
      // Verifica que o JSON mantém a estrutura
      const jsonStructure = JSON.parse(JSON.stringify(response.body));
      expect(jsonStructure.genero).toBe('feminino');
      expect(jsonStructure.peso).toBe(60);
      expect(jsonStructure.altura).toBe(165);
    });

    test('deve lidar com erro e retornar JSON de erro válido', async () => {
      // Arrange - dados inválidos
      const dadosInvalidos = {
        peso: -10,
        altura: 0,
        genero: 'invalido',
        idade: -5,
        cintura: -20
      };

      // Act
      const response = await request(app)
        .post('/calcular-medidas')
        .send(dadosInvalidos);

      // Assert - Deve retornar erro mas ainda em formato JSON
      expect(response.status).toBeGreaterThanOrEqual(400);
      
      // Mesmo em erro, deve ser JSON válido
      if (response.headers['content-type']?.includes('application/json')) {
        expect(() => JSON.parse(JSON.stringify(response.body))).not.toThrow();
      }
    });

    test('deve manter consistência nos tipos de dados no JSON', async () => {
      // Arrange
      const dados = {
        peso: 70,
        altura: 175,
        genero: 'masculino',
        idade: 25,
        cintura: 85,
        quadril: 98
      };

      // Act
      const response = await request(app)
        .post('/calcular-medidas')
        .send(dados)
        .expect(200);

      // Assert - Verifica tipos específicos
      expect(typeof response.body.imc).toBe('number');
      expect(typeof response.body.classificacaoIMC).toBe('string');
      expect(typeof response.body.peso).toBe('number');
      expect(typeof response.body.altura).toBe('number');
      expect(typeof response.body.idade).toBe('number');
      expect(typeof response.body.genero).toBe('string');
      
      if (response.body.rcq !== null) {
        expect(typeof response.body.rcq).toBe('number');
      }
      
      if (response.body.classificacaoRCQ !== null) {
        expect(typeof response.body.classificacaoRCQ).toBe('string');
      }

      // Verifica que não há undefined no JSON final
      const jsonString = JSON.stringify(response.body);
      expect(jsonString).not.toContain('undefined');
    });

    test('deve preservar valores null adequadamente no JSON', async () => {
      // Arrange - dados sem dobras cutâneas
      const dadosSemDobras = {
        peso: 70,
        altura: 175,
        genero: 'masculino',
        idade: 25,
        cintura: 85
      };

      // Act
      const response = await request(app)
        .post('/calcular-medidas')
        .send(dadosSemDobras)
        .expect(200);

      // Assert - Verifica que campos ausentes são null (não undefined)
      expect(response.body.percentualGC_Pollock).toBeNull();
      expect(response.body.classificacaoGC_Pollock).toBeNull();
      expect(response.body.percentualGC_Faulkner).toBeNull();
      expect(response.body.classificacaoGC_Faulkner).toBeNull();
      expect(response.body.percentualGC_Guedes).toBeNull();
      expect(response.body.classificacaoGC_Guedes).toBeNull();

      // Verifica que JSON.stringify preserva null
      const jsonString = JSON.stringify(response.body);
      const parsed = JSON.parse(jsonString);
      expect(parsed.percentualGC_Pollock).toBeNull();
      expect(parsed.classificacaoGC_Pollock).toBeNull();
    });

    test('deve ser compatível com estrutura do Prisma para campo Json', async () => {
      // Arrange
      const dados = {
        peso: 75,
        altura: 180,
        genero: 'masculino',
        idade: 28,
        cintura: 85,
        quadril: 98
      };

      // Act
      const response = await request(app)
        .post('/calcular-medidas')
        .send(dados)
        .expect(200);

      // Assert - Simula o que seria salvo via Prisma
      const avaliacaoData = {
        userPerfilId: 'test-user-id',
        tipo: 'medidas',
        status: 'pendente',
        resultado: response.body, // Este deve ser compatível com Prisma Json
        validadeAte: null,
        objetivoClassificado: null
      };

      // Verifica que o objeto é serializable
      expect(() => JSON.stringify(avaliacaoData)).not.toThrow();
      
      // Verifica que não há funções ou objetos complexos
      const verificarTiposPrimitivos = (obj: any): boolean => {
        for (const [key, value] of Object.entries(obj)) {
          if (value !== null && value !== undefined) {
            const tipo = typeof value;
            if (tipo === 'function' || tipo === 'symbol' || tipo === 'bigint') {
              return false;
            }
            if (tipo === 'object' && !Array.isArray(value)) {
              if (!verificarTiposPrimitivos(value)) {
                return false;
              }
            }
          }
        }
        return true;
      };

      expect(verificarTiposPrimitivos(avaliacaoData.resultado)).toBe(true);
    });
  });
});
