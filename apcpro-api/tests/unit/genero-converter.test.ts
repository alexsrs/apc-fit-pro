/// <reference types="jest" />

import { 
  converterSexoParaGenero, 
  generoParaString, 
  generoParaNumero,
  generoParaLetra,
  isSexoValido,
  SexoInput 
} from '../../src/utils/genero-converter';
import { Genero } from '../../src/models/genero-model';

describe('Genero Converter Utils', () => {
  
  describe('converterSexoParaGenero', () => {
    test('deve converter masculino corretamente', () => {
      expect(converterSexoParaGenero('masculino')).toBe(Genero.Masculino);
      expect(converterSexoParaGenero('MASCULINO')).toBe(Genero.Masculino);
      expect(converterSexoParaGenero('Masculino')).toBe(Genero.Masculino);
      expect(converterSexoParaGenero('M')).toBe(Genero.Masculino);
      expect(converterSexoParaGenero('m')).toBe(Genero.Masculino);
      expect(converterSexoParaGenero(1)).toBe(Genero.Masculino);
    });

    test('deve converter feminino corretamente', () => {
      expect(converterSexoParaGenero('feminino')).toBe(Genero.Feminino);
      expect(converterSexoParaGenero('FEMININO')).toBe(Genero.Feminino);
      expect(converterSexoParaGenero('Feminino')).toBe(Genero.Feminino);
      expect(converterSexoParaGenero('F')).toBe(Genero.Feminino);
      expect(converterSexoParaGenero('f')).toBe(Genero.Feminino);
      expect(converterSexoParaGenero(0)).toBe(Genero.Feminino);
    });

    test('deve retornar Feminino para valores inválidos por segurança', () => {
      expect(converterSexoParaGenero('')).toBe(Genero.Feminino);
      expect(converterSexoParaGenero('invalid')).toBe(Genero.Feminino);
      expect(converterSexoParaGenero('outro')).toBe(Genero.Feminino);
      expect(converterSexoParaGenero(99)).toBe(Genero.Feminino);
    });
  });

  describe('generoParaString', () => {
    test('deve converter enum para string', () => {
      expect(generoParaString(Genero.Masculino)).toBe('masculino');
      expect(generoParaString(Genero.Feminino)).toBe('feminino');
    });
  });

  describe('generoParaNumero', () => {
    test('deve converter enum para número', () => {
      expect(generoParaNumero(Genero.Masculino)).toBe(1);
      expect(generoParaNumero(Genero.Feminino)).toBe(0);
    });
  });

  describe('generoParaLetra', () => {
    test('deve converter enum para letra', () => {
      expect(generoParaLetra(Genero.Masculino)).toBe('M');
      expect(generoParaLetra(Genero.Feminino)).toBe('F');
    });
  });

  describe('isSexoValido', () => {
    test('deve validar sexos válidos', () => {
      expect(isSexoValido('masculino')).toBe(true);
      expect(isSexoValido('feminino')).toBe(true);
      expect(isSexoValido('M')).toBe(true);
      expect(isSexoValido('F')).toBe(true);
      expect(isSexoValido('m')).toBe(true);
      expect(isSexoValido('f')).toBe(true);
      expect(isSexoValido(1)).toBe(true);
      expect(isSexoValido(0)).toBe(true);
    });

    test('deve rejeitar sexos inválidos', () => {
      expect(isSexoValido('')).toBe(false);
      expect(isSexoValido('invalid')).toBe(false);
      expect(isSexoValido(null)).toBe(false);
      expect(isSexoValido(undefined)).toBe(false);
      expect(isSexoValido('outro')).toBe(false);
      expect(isSexoValido(2)).toBe(false);
      expect(isSexoValido(-1)).toBe(false);
    });
  });

  describe('Fluxo completo e consistência', () => {
    test('deve manter consistência ao converter ida e volta', () => {
      const testCases: Array<{ input: SexoInput; expectedGenero: Genero }> = [
        { input: 'masculino', expectedGenero: Genero.Masculino },
        { input: 'feminino', expectedGenero: Genero.Feminino },
        { input: 'M', expectedGenero: Genero.Masculino },
        { input: 'F', expectedGenero: Genero.Feminino },
        { input: 'm', expectedGenero: Genero.Masculino },
        { input: 'f', expectedGenero: Genero.Feminino },
        { input: 1, expectedGenero: Genero.Masculino },
        { input: 0, expectedGenero: Genero.Feminino },
      ];
      
      testCases.forEach(({ input, expectedGenero }) => {
        // Entrada -> Genero
        const genero = converterSexoParaGenero(input);
        expect(genero).toBe(expectedGenero);
        
        // Genero -> diferentes formatos
        const string = generoParaString(genero);
        const numero = generoParaNumero(genero);
        const letra = generoParaLetra(genero);
        
        // Verificar que os formatos são válidos
        expect(['masculino', 'feminino']).toContain(string);
        expect([0, 1]).toContain(numero);
        expect(['M', 'F']).toContain(letra);
        
        // Verificar ida e volta
        expect(converterSexoParaGenero(string)).toBe(genero);
        expect(converterSexoParaGenero(numero)).toBe(genero);
        expect(converterSexoParaGenero(letra)).toBe(genero);
      });
    });

    test('deve lidar com strings com espaços', () => {
      expect(converterSexoParaGenero('  masculino  ')).toBe(Genero.Masculino);
      expect(converterSexoParaGenero('  feminino  ')).toBe(Genero.Feminino);
      expect(converterSexoParaGenero('  M  ')).toBe(Genero.Masculino);
      expect(converterSexoParaGenero('  F  ')).toBe(Genero.Feminino);
    });
  });
});
