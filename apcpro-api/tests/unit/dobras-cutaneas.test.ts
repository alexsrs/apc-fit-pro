/**
 * Testes Unitários - Dobras Cutâneas
 * Testa os cálculos dos protocolos de dobras cutâneas
 */

import { calcularFaulkner, type MedidasFaulkner } from '../../src/utils/protocolos-dobras/faulkner';
import { calcularPollock7, type MedidasPollock7 } from '../../src/utils/protocolos-dobras/pollock';
import { calcularGuedes, type MedidasGuedes } from '../../src/utils/protocolos-dobras/guedes';

describe('Dobras Cutâneas - Protocolos', () => {
  
  describe('Protocolo Faulkner', () => {
    test('deve calcular percentual de gordura para homem', () => {
      // Arrange
      const medidas: MedidasFaulkner = {
        triceps: 12.5,
        subescapular: 15.2,
        suprailiaca: 18.1,
        bicipital: 10.0
      };
      const genero = 'M' as const;
      const peso = 75.0;

      // Act
      const resultado = calcularFaulkner(medidas, genero, peso);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado.percentualGordura).toBeGreaterThan(0);
      expect(resultado.percentualGordura).toBeLessThan(50);
      expect(resultado.somaTotal).toBeGreaterThan(0);
      expect(resultado.massaGorda).toBeGreaterThan(0);
      expect(resultado.massaMagra).toBeGreaterThan(0);
    });

    test('deve calcular percentual de gordura para mulher', () => {
      // Arrange
      const medidas: MedidasFaulkner = {
        triceps: 18.5,
        subescapular: 20.2,
        suprailiaca: 25.1,
        bicipital: 15.0
      };
      const genero = 'F' as const;
      const peso = 65.0;

      // Act
      const resultado = calcularFaulkner(medidas, genero, peso);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado.percentualGordura).toBeGreaterThan(0);
      expect(resultado.percentualGordura).toBeLessThan(50);
      expect(resultado.somaTotal).toBeGreaterThan(0);
      expect(resultado.massaGorda).toBeGreaterThan(0);
      expect(resultado.massaMagra).toBeGreaterThan(0);
    });

    test('deve retornar valores diferentes para homens e mulheres com mesmas medidas', () => {
      // Arrange
      const medidas: MedidasFaulkner = {
        triceps: 15.0,
        subescapular: 18.0,
        suprailiaca: 20.0,
        bicipital: 12.0
      };
      const peso = 70.0;

      // Act
      const resultadoHomem = calcularFaulkner(medidas, 'M', peso);
      const resultadoMulher = calcularFaulkner(medidas, 'F', peso);

      // Assert
      expect(resultadoHomem.percentualGordura).not.toEqual(resultadoMulher.percentualGordura);
      // Deve haver diferença significativa
      expect(Math.abs(resultadoHomem.percentualGordura - resultadoMulher.percentualGordura)).toBeGreaterThan(0.1);
    });

    test('deve lançar erro com medidas inválidas', () => {
      // Arrange
      const medidasInvalidas: MedidasFaulkner = {
        triceps: 2.0, // Muito baixo
        subescapular: 15.0,
        suprailiaca: 20.0,
        bicipital: 10.0
      };
      const genero = 'M' as const;
      const peso = 70.0;

      // Act & Assert
      expect(() => calcularFaulkner(medidasInvalidas, genero, peso)).toThrow();
    });
  });

  describe('Protocolo Pollock (7 dobras)', () => {
    test('deve calcular percentual de gordura para homem jovem', () => {
      // Arrange
      const medidas: MedidasPollock7 = {
        triceps: 12.5,
        subescapular: 15.2,
        suprailiaca: 18.1,
        abdominal: 20.0,
        peitoral: 8.0,
        axilarMedia: 10.0,
        coxa: 22.0
      };
      const genero = 'M' as const;
      const idade = 25;
      const peso = 75.0;

      // Act
      const resultado = calcularPollock7(medidas, genero, idade, peso);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado.percentualGordura).toBeGreaterThan(0);
      expect(resultado.percentualGordura).toBeLessThan(50);
      expect(resultado.somaTotal).toBeGreaterThan(0);
      expect(resultado.densidadeCorporal).toBeGreaterThan(0.9);
      expect(resultado.densidadeCorporal).toBeLessThan(1.2);
    });

    test('deve considerar efeito da idade no cálculo', () => {
      // Arrange - Mesmas medidas, idades diferentes
      const medidas: MedidasPollock7 = {
        triceps: 15.0,
        subescapular: 18.0,
        suprailiaca: 20.0,
        abdominal: 22.0,
        peitoral: 10.0,
        axilarMedia: 12.0,
        coxa: 25.0
      };
      const genero = 'M' as const;
      const peso = 75.0;

      // Act
      const resultadoJovem = calcularPollock7(medidas, genero, 25, peso);
      const resultadoIdoso = calcularPollock7(medidas, genero, 55, peso);

      // Assert
      expect(resultadoJovem.percentualGordura).not.toEqual(resultadoIdoso.percentualGordura);
      // Com a idade, normalmente o % de gordura aparenta ser ligeiramente maior
      expect(Math.abs(resultadoJovem.percentualGordura - resultadoIdoso.percentualGordura)).toBeGreaterThan(0.5);
    });
  });

  describe('Protocolo Guedes', () => {
    test('deve calcular com 7 pontos para homem', () => {
      // Arrange
      const medidas: MedidasGuedes = {
        triceps: 12.5,
        subescapular: 15.2,
        suprailiaca: 18.1,
        abdominal: 20.0,
        coxa: 22.0,
        peito: 8.0,
        axilarMedia: 10.0
      };
      const genero = 'M' as const;
      const idade = 25;
      const peso = 75.0;

      // Act
      const resultado = calcularGuedes(medidas, genero, idade, peso);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado.percentualGordura).toBeGreaterThan(0);
      expect(resultado.percentualGordura).toBeLessThan(50);
      expect(resultado.somaTotal).toBeGreaterThan(0);
      expect(resultado.massaGorda).toBeGreaterThan(0);
      expect(resultado.massaMagra).toBeGreaterThan(0);
    });

    test('deve lançar erro com idade inválida', () => {
      // Arrange
      const medidas: MedidasGuedes = {
        triceps: 15.0,
        subescapular: 18.0,
        suprailiaca: 20.0,
        abdominal: 22.0,
        coxa: 25.0,
        peito: 10.0,
        axilarMedia: 12.0
      };
      const genero = 'M' as const;
      const idadeInvalida = 10; // Muito jovem
      const peso = 75.0;

      // Act & Assert
      expect(() => calcularGuedes(medidas, genero, idadeInvalida, peso)).toThrow();
    });
  });

  describe('Comparação entre Protocolos', () => {
    test('protocolos devem dar resultados diferentes para mesmas medidas básicas', () => {
      // Arrange
      const medidasBase = {
        triceps: 15.0,
        subescapular: 18.0,
        suprailiaca: 20.0,
        abdominal: 22.0,
        bicipital: 12.0
      };
      const genero = 'M' as const;
      const idade = 25;
      const peso = 75.0;

      // Act
      const faulkner = calcularFaulkner({
        triceps: medidasBase.triceps,
        subescapular: medidasBase.subescapular,
        suprailiaca: medidasBase.suprailiaca,
        bicipital: medidasBase.bicipital
      }, genero, peso);

      const pollock = calcularPollock7({
        triceps: medidasBase.triceps,
        subescapular: medidasBase.subescapular,
        suprailiaca: medidasBase.suprailiaca,
        abdominal: medidasBase.abdominal,
        peitoral: 10.0,
        axilarMedia: 12.0,
        coxa: 25.0
      }, genero, idade, peso);
      
      const guedes = calcularGuedes({
        triceps: medidasBase.triceps,
        subescapular: medidasBase.subescapular,
        suprailiaca: medidasBase.suprailiaca,
        abdominal: medidasBase.abdominal,
        coxa: 25.0,
        peito: 10.0,
        axilarMedia: 12.0
      }, genero, idade, peso);

      // Assert
      expect(faulkner.percentualGordura).not.toEqual(pollock.percentualGordura);
      expect(faulkner.percentualGordura).not.toEqual(guedes.percentualGordura);
      expect(pollock.percentualGordura).not.toEqual(guedes.percentualGordura);
      
      // Todos devem estar em range razoável
      [faulkner.percentualGordura, pollock.percentualGordura, guedes.percentualGordura].forEach(resultado => {
        expect(resultado).toBeGreaterThan(5);
        expect(resultado).toBeLessThan(35);
      });
    });
  });
});
