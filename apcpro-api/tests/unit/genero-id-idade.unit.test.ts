// Testes unitários unificados para utils de gênero e idade

import { converterSexoParaGenero, generoParaString, generoParaNumero, generoParaLetra, isSexoValido } from '../../src/utils/genero-converter';
import { Genero } from '../../src/models/genero-model';
import { calcularIdade } from '../../src/utils/idade';

describe('Genero Converter Utils', () => {
  // ...testes de conversão de gênero...
  test('deve converter masculino corretamente', () => {
    expect(converterSexoParaGenero('masculino')).toBe(Genero.Masculino);
  });
  // ...outros testes...
});

describe('Utilitários de Idade', () => {
  test('deve calcular idade corretamente para data atual', () => {
    const hoje = new Date();
    const anoNascimento = hoje.getFullYear() - 25;
    const dataNascimento = new Date(anoNascimento, hoje.getMonth(), hoje.getDate());
    const idade = calcularIdade(dataNascimento);
    expect(idade).toBe(25);
  });
  // ...outros testes...
});
