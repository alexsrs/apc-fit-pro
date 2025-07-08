// tests/unit/avaliacaoMedidas.test.ts
import { generoToNumber } from '../../src/utils/avaliacaoMedidas';
import { Genero } from '../../src/models/genero-model';

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

  describe('Validações básicas', () => {
    it('deve validar entrada de dados básicos', () => {
      // Teste simples para verificar se as constantes estão corretas
      const masculino = generoToNumber(Genero.Masculino);
      const feminino = generoToNumber(Genero.Feminino);
      
      expect(masculino).not.toEqual(feminino);
      expect(masculino).toBeGreaterThan(feminino);
    });

    it('deve manter consistência de conversões', () => {
      // Teste de consistência
      const resultado1 = generoToNumber(Genero.Masculino);
      const resultado2 = generoToNumber(Genero.Masculino);
      
      expect(resultado1).toBe(resultado2);
    });
  });

  describe('Tipos e interfaces', () => {
    it('deve aceitar tipos válidos do enum Genero', () => {
      expect(() => generoToNumber(Genero.Masculino)).not.toThrow();
      expect(() => generoToNumber(Genero.Feminino)).not.toThrow();
    });

    it('deve lidar com entrada undefined', () => {
      const resultado = generoToNumber(undefined as any);
      expect(resultado).toBe(0); // Valor padrão de segurança
    });
  });
});