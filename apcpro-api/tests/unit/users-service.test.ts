// tests/unit/users-service.test.ts
import { UsersService } from '../../src/services/users-service';

describe('UsersService', () => {
  describe('Instanciação básica', () => {
    it('deve instanciar sem erros', () => {
      expect(() => new UsersService()).not.toThrow();
    });

    it('deve ter estrutura básica', () => {
      const service = new UsersService();
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(UsersService);
    });
  });
});