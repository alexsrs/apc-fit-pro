// Testes unitários unificados para UsersService
import { UsersService } from '../../src/services/users-service';

describe('UsersService', () => {
  it('deve instanciar sem erros', () => {
    expect(() => new UsersService()).not.toThrow();
  });
  it('deve ter estrutura básica', () => {
    const service = new UsersService();
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(UsersService);
  });
  // ...outros testes do UsersService podem ser adicionados aqui...
});
