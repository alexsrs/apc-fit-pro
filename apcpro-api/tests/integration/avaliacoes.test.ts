/// <reference types="jest" />

import request from 'supertest';
import { Express } from 'express';
import { createTestApp } from '../helpers/test-app';


describe('Avaliações API Integration Tests', () => {
  let app: Express;
  
  beforeAll(async () => {
    app = await createTestApp();
  });

  describe('POST /avaliacoes', () => {
    it('deve criar uma nova avaliação com dados válidos', async () => {
      const dadosAvaliacao = {
        userPerfilId: 'test-user-id',
        tipo: 'triagem',
        resultado: {
          peso: 70,
          altura: 175,
          idade: 25,
          genero: 'masculino',
          objetivo: 'emagrecimento'
        }
      };

      const response = await request(app)
        .post('/avaliacoes')
        .send(dadosAvaliacao)
        .expect('Content-Type', /json/);

      // Esperado: status 201 e retorno com id
      expect([200, 201]).toContain(response.status);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
    });

    it('deve rejeitar avaliação com dados inválidos', async () => {
      const dadosInvalidos = {
        userPerfilId: '', // ID vazio
        tipo: 'tipo-inexistente',
        resultado: {
          peso: -10, // Peso negativo
          altura: 0   // Altura zero
        }
      };

      const response = await request(app)
        .post('/avaliacoes')
        .send(dadosInvalidos);

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.status).toBeLessThan(500);
    });

    it('deve processar avaliação de dobras cutâneas', async () => {
      const dadosDobrasCutaneas = {
        userPerfilId: 'test-user-id',
        tipo: 'dobras-cutaneas',
        resultado: {
          protocolo: 'faulkner',
          medidas: {
            triceps: 12.5,
            subescapular: 15.2,
            suprailiaca: 18.1
          }
        }
      };

      const response = await request(app)
        .post('/avaliacoes')
        .send(dadosDobrasCutaneas)
        .expect('Content-Type', /json/);

      expect([200, 201]).toContain(response.status);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
    });
  });

  describe('GET /avaliacoes/:userPerfilId', () => {
    it('deve retornar avaliações do usuário', async () => {
      const userPerfilId = 'test-user-id';

      const response = await request(app)
        .get(`/avaliacoes/${userPerfilId}`)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body) || response.body.data).toBeTruthy();
    });

    it('deve retornar 404 ou array vazio para usuário inexistente', async () => {
      const userPerfilIdInexistente = 'usuario-inexistente';

      const response = await request(app)
        .get(`/avaliacoes/${userPerfilIdInexistente}`);

      // Pode retornar 404 ou array vazio
      expect(
        response.status === 404 ||
        (response.status === 200 && Array.isArray(response.body) && response.body.length === 0)
      ).toBeTruthy();
    });
  });

  describe('PUT /avaliacoes/:id/status', () => {
    it('deve aprovar uma avaliação', async () => {
      // Primeiro cria uma avaliação para obter o id
      const criacao = await request(app)
        .post('/avaliacoes')
        .send({
          userPerfilId: 'test-user-id',
          tipo: 'triagem',
          resultado: { peso: 70, altura: 175, idade: 25, genero: 'masculino' }
        });
      const avaliacaoId = criacao.body.id || 'test-avaliacao-id';
      const dadosAprovacao = {
        status: 'aprovada',
        validadeDias: 90,
        professorId: 'test-professor-id'
      };

      const response = await request(app)
        .put(`/avaliacoes/${avaliacaoId}/status`)
        .send(dadosAprovacao)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it('deve reprovar uma avaliação com motivo', async () => {
      // Cria avaliação para obter id
      const criacao = await request(app)
        .post('/avaliacoes')
        .send({
          userPerfilId: 'test-user-id',
          tipo: 'triagem',
          resultado: { peso: 70, altura: 175, idade: 25, genero: 'masculino' }
        });
      const avaliacaoId = criacao.body.id || 'test-avaliacao-id';
      const dadosReprovacao = {
        status: 'reprovada',
        motivo: 'Dados inconsistentes',
        professorId: 'test-professor-id'
      };

      const response = await request(app)
        .put(`/avaliacoes/${avaliacaoId}/status`)
        .send(dadosReprovacao)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it('deve rejeitar alteração de status sem autorização', async () => {
      // Cria avaliação para obter id
      const criacao = await request(app)
        .post('/avaliacoes')
        .send({
          userPerfilId: 'test-user-id',
          tipo: 'triagem',
          resultado: { peso: 70, altura: 175, idade: 25, genero: 'masculino' }
        });
      const avaliacaoId = criacao.body.id || 'test-avaliacao-id';
      const dadosSemAutorizacao = {
        status: 'aprovada'
        // professorId ausente
      };

      const response = await request(app)
        .put(`/avaliacoes/${avaliacaoId}/status`)
        .send(dadosSemAutorizacao);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Validações de negócio', () => {
    it('deve validar dados obrigatórios para triagem', async () => {
      const triagemIncompleta = {
        userPerfilId: 'test-user-id',
        tipo: 'triagem',
        resultado: {
          peso: 70
          // altura, idade, genero ausentes
        }
      };

      const response = await request(app)
        .post('/avaliacoes')
        .send(triagemIncompleta);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('deve validar protocolo de dobras cutâneas', async () => {
      const dobrasSemProtocolo = {
        userPerfilId: 'test-user-id',
        tipo: 'dobras-cutaneas',
        resultado: {
          // protocolo ausente
          medidas: {
            triceps: 12.5
          }
        }
      };

      const response = await request(app)
        .post('/avaliacoes')
        .send(dobrasSemProtocolo);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('deve validar valores de dobras cutâneas dentro de range válido', async () => {
      const dobrasInvalidas = {
        userPerfilId: 'test-user-id',
        tipo: 'dobras-cutaneas',
        resultado: {
          protocolo: 'faulkner',
          medidas: {
            triceps: -5, // Valor negativo inválido
            subescapular: 150 // Valor muito alto
          }
        }
      };

      const response = await request(app)
        .post('/avaliacoes')
        .send(dobrasInvalidas);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Fluxo completo de avaliação', () => {
    it('deve processar fluxo completo: criação -> aprovação -> consulta', async () => {
      // 1. Criar avaliação
      const dadosAvaliacao = {
        userPerfilId: 'test-user-complete',
        tipo: 'triagem',
        resultado: {
          peso: 70,
          altura: 175,
          idade: 25,
          genero: 'masculino',
          objetivo: 'ganho-massa'
        }
      };

      const criacaoResponse = await request(app)
        .post('/avaliacoes')
        .send(dadosAvaliacao);

      expect([200, 201]).toContain(criacaoResponse.status);
      expect(criacaoResponse.body).toBeDefined();
      const avaliacaoId = criacaoResponse.body.id || 'test-avaliacao-complete';

      // 2. Aprovar avaliação
      const dadosAprovacao = {
        status: 'aprovada',
        validadeDias: 90,
        professorId: 'test-professor-id'
      };

      const aprovacaoResponse = await request(app)
        .put(`/avaliacoes/${avaliacaoId}/status`)
        .send(dadosAprovacao);

      expect(aprovacaoResponse.status).toBe(200);

      // 3. Consultar avaliações do usuário
      const consultaResponse = await request(app)
        .get(`/avaliacoes/${dadosAvaliacao.userPerfilId}`);

      expect(consultaResponse.status).toBe(200);
      expect(consultaResponse.body).toBeDefined();
      expect(Array.isArray(consultaResponse.body) || consultaResponse.body.data).toBeTruthy();
    });
  });

  describe('Performance e limites', () => {
    it('deve lidar com requisições concorrentes', async () => {
      const promises = Array.from({ length: 10 }, (_, i) => 
        request(app)
          .post('/avaliacoes')
          .send({
            userPerfilId: `test-user-${i}`,
            tipo: 'triagem',
            resultado: {
              peso: 70 + i,
              altura: 175,
              idade: 25,
              genero: 'masculino'
            }
          })
      );

      const responses = await Promise.all(promises);
      responses.forEach(response => {
        expect(response.status).toBeLessThan(500);
      });
    });

    it('deve validar tamanho máximo do payload', async () => {
      const payloadGrande = {
        userPerfilId: 'test-user-id',
        tipo: 'anamnese',
        resultado: {
          historico: 'x'.repeat(10000), // 10KB de texto
          observacoes: 'y'.repeat(10000)
        }
      };

      const response = await request(app)
        .post('/avaliacoes')
        .send(payloadGrande);

      expect([200, 413]).toContain(response.status);
    });
  });
});
