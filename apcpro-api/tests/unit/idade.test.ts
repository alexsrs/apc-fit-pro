// tests/unit/idade.test.ts
import { calcularIdade } from '../../src/utils/idade';

describe('Utilitários de Idade', () => {
  describe('calcularIdade', () => {
    it('deve calcular idade corretamente para data atual', () => {
      const hoje = new Date();
      const anoNascimento = hoje.getFullYear() - 25;
      const dataNascimento = new Date(anoNascimento, hoje.getMonth(), hoje.getDate());
      
      const idade = calcularIdade(dataNascimento);
      expect(idade).toBe(25);
    });

    it('deve calcular idade para nascimento no ano passado', () => {
      const hoje = new Date();
      const dataNascimento = new Date(hoje.getFullYear() - 1, hoje.getMonth(), hoje.getDate());
      
      const idade = calcularIdade(dataNascimento);
      expect(idade).toBe(1);
    });

    it('deve calcular idade antes do aniversário deste ano', () => {
      const hoje = new Date();
      const dataNascimento = new Date(hoje.getFullYear() - 30, hoje.getMonth() + 1, hoje.getDate());
      
      const idade = calcularIdade(dataNascimento);
      expect(idade).toBe(29); // Ainda não fez aniversário este ano
    });

    it('deve calcular idade após o aniversário deste ano', () => {
      const hoje = new Date();
      const dataNascimento = new Date(hoje.getFullYear() - 30, hoje.getMonth() - 1, hoje.getDate());
      
      const idade = calcularIdade(dataNascimento);
      expect(idade).toBe(30); // Já fez aniversário este ano
    });

    it('deve lidar com pessoa que nasceu hoje', () => {
      const hoje = new Date();
      const idade = calcularIdade(hoje);
      expect(idade).toBe(0);
    });
  });
});