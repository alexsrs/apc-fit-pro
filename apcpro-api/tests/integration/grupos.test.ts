/**
 * Testes de integração para funcionalidades de grupos/times
 * Testam o relacionamento many-to-many no banco de dados real (PostgreSQL de teste)
 */

import { PrismaClient } from '@prisma/client';
import { UserRepositoryClass } from '../../src/repositories/users-repository';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

describe('Grupos - Testes de Integração', () => {
  let usersRepository: UserRepositoryClass;
  let professorTestId: string;
  let alunoTestId: string;
  let grupoTestId: string;

  beforeAll(async () => {
    await prisma.$connect();
    usersRepository = new UserRepositoryClass();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Limpar dados de teste antes de cada teste
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['professor.teste@integracao.com', 'aluno.teste@integracao.com']
        }
      }
    });

    await prisma.grupo.deleteMany({
      where: {
        nome: {
          startsWith: 'Grupo Teste Integração'
        }
      }
    });

    // Criar professor de teste
    const professor = await prisma.user.create({
      data: {
        nome: 'Professor Integração',
        email: 'professor.teste@integracao.com',
        accountType: 'professor',
        emailVerified: new Date(),
      }
    });
    professorTestId = professor.id;

    // Criar aluno de teste
    const aluno = await prisma.user.create({
      data: {
        nome: 'Aluno Integração',
        email: 'aluno.teste@integracao.com',
        accountType: 'aluno',
        emailVerified: new Date(),
      }
    });
    alunoTestId = aluno.id;

    // Criar grupo de teste
    const grupo = await prisma.grupo.create({
      data: {
        nome: 'Grupo Teste Integração',
        descricao: 'Grupo para testes de integração',
        professorId: professorTestId,
      }
    });
    grupoTestId = grupo.id;
  });

  afterEach(async () => {
    // Limpar dados após cada teste
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['professor.teste@integracao.com', 'aluno.teste@integracao.com']
        }
      }
    });

    await prisma.grupo.deleteMany({
      where: {
        nome: {
          startsWith: 'Grupo Teste Integração'
        }
      }
    });
  });

  describe('addStudentToGroup', () => {
    it('deve adicionar um aluno ao grupo no banco de dados', async () => {
      // Act
      const resultado = await usersRepository.addStudentToGroup(alunoTestId, grupoTestId);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado?.grupos).toHaveLength(1);
      expect(resultado?.grupos[0].id).toBe(grupoTestId);

      // Verificar no banco se o relacionamento foi criado
      const relacionamento = await prisma.$queryRaw`
        SELECT * FROM "_MembroGrupo" 
        WHERE "A" = ${grupoTestId} AND "B" = ${alunoTestId}
      `;
      expect(relacionamento).toHaveLength(1);
    });

    it('deve permitir adicionar múltiplos alunos ao mesmo grupo', async () => {
      // Arrange - Criar segundo aluno
      const aluno2 = await prisma.user.create({
        data: {
          nome: 'Segundo Aluno',
          email: 'aluno2.teste@integracao.com',
          accountType: 'aluno',
          emailVerified: new Date(),
        }
      });

      // Act
      await usersRepository.addStudentToGroup(alunoTestId, grupoTestId);
      await usersRepository.addStudentToGroup(aluno2.id, grupoTestId);

      // Assert
      const grupoComMembros = await usersRepository.getGroupStudents(grupoTestId);
      expect(grupoComMembros?.membros).toHaveLength(2);

      // Cleanup
      await prisma.user.delete({ where: { id: aluno2.id } });
    });

    it('deve permitir adicionar um aluno a múltiplos grupos', async () => {
      // Arrange - Criar segundo grupo
      const grupo2 = await prisma.grupo.create({
        data: {
          nome: 'Grupo Teste Integração 2',
          descricao: 'Segundo grupo para testes',
          professorId: professorTestId,
        }
      });

      // Act
      await usersRepository.addStudentToGroup(alunoTestId, grupoTestId);
      await usersRepository.addStudentToGroup(alunoTestId, grupo2.id);

      // Assert
      const alunoComGrupos = await usersRepository.getUserGroups(alunoTestId);
      expect(alunoComGrupos?.grupos).toHaveLength(2);

      // Cleanup
      await prisma.grupo.delete({ where: { id: grupo2.id } });
    });
  });

  describe('removeStudentFromGroup', () => {
    beforeEach(async () => {
      // Adicionar aluno ao grupo antes dos testes de remoção
      await usersRepository.addStudentToGroup(alunoTestId, grupoTestId);
    });

    it('deve remover um aluno do grupo no banco de dados', async () => {
      // Act
      const resultado = await usersRepository.removeStudentFromGroup(alunoTestId, grupoTestId);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado?.grupos).toHaveLength(0);

      // Verificar no banco se o relacionamento foi removido
      const relacionamento = await prisma.$queryRaw`
        SELECT * FROM "_MembroGrupo" 
        WHERE "A" = ${grupoTestId} AND "B" = ${alunoTestId}
      `;
      expect(relacionamento).toHaveLength(0);
    });

    it('deve manter outros relacionamentos ao remover um específico', async () => {
      // Arrange - Criar segundo grupo e adicionar aluno a ambos
      const grupo2 = await prisma.grupo.create({
        data: {
          nome: 'Grupo Teste Integração 2',
          descricao: 'Segundo grupo para testes',
          professorId: professorTestId,
        }
      });

      await usersRepository.addStudentToGroup(alunoTestId, grupo2.id);

      // Act - Remover apenas do primeiro grupo
      await usersRepository.removeStudentFromGroup(alunoTestId, grupoTestId);

      // Assert - Deve ainda estar no segundo grupo
      const alunoComGrupos = await usersRepository.getUserGroups(alunoTestId);
      expect(alunoComGrupos?.grupos).toHaveLength(1);
      expect(alunoComGrupos?.grupos[0].id).toBe(grupo2.id);

      // Cleanup
      await prisma.grupo.delete({ where: { id: grupo2.id } });
    });
  });

  describe('getGroupStudents', () => {
    it('deve retornar lista vazia quando grupo não tem membros', async () => {
      // Act
      const resultado = await usersRepository.getGroupStudents(grupoTestId);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado?.membros).toHaveLength(0);
    });

    it('deve retornar os membros do grupo corretamente', async () => {
      // Arrange
      await usersRepository.addStudentToGroup(alunoTestId, grupoTestId);

      // Act
      const resultado = await usersRepository.getGroupStudents(grupoTestId);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado?.membros).toHaveLength(1);
      expect(resultado?.membros[0].id).toBe(alunoTestId);
      expect(resultado?.membros[0].nome).toBe('Aluno Integração');
    });
  });

  describe('getUserGroups', () => {
    it('deve retornar lista vazia quando usuário não está em grupos', async () => {
      // Act
      const resultado = await usersRepository.getUserGroups(alunoTestId);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado?.grupos).toHaveLength(0);
    });

    it('deve retornar os grupos do usuário corretamente', async () => {
      // Arrange
      await usersRepository.addStudentToGroup(alunoTestId, grupoTestId);

      // Act
      const resultado = await usersRepository.getUserGroups(alunoTestId);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado?.grupos).toHaveLength(1);
      expect(resultado?.grupos[0].id).toBe(grupoTestId);
      expect(resultado?.grupos[0].nome).toBe('Grupo Teste Integração');
    });
  });

  describe('createGroup', () => {
    it('deve criar um novo grupo no banco de dados', async () => {
      // Act
      const novoGrupo = await usersRepository.createGroup(
        'Novo Grupo Integração',
        'Descrição do novo grupo',
        professorTestId
      );

      // Assert
      expect(novoGrupo).toBeDefined();
      expect(novoGrupo.nome).toBe('Novo Grupo Integração');
      expect(novoGrupo.professorId).toBe(professorTestId);

      // Verificar se foi criado no banco
      const grupoBanco = await prisma.grupo.findUnique({
        where: { id: novoGrupo.id }
      });
      expect(grupoBanco).toBeDefined();
      expect(grupoBanco?.nome).toBe('Novo Grupo Integração');

      // Cleanup
      await prisma.grupo.delete({ where: { id: novoGrupo.id } });
    });
  });

  describe('Fluxo completo de grupos', () => {
    it('deve executar um fluxo completo de operações com grupos', async () => {
      // 1. Criar um novo grupo
      const novoGrupo = await usersRepository.createGroup(
        'Grupo Fluxo Completo',
        'Teste do fluxo completo',
        professorTestId
      );

      expect(novoGrupo).toBeDefined();

      // 2. Adicionar aluno ao grupo
      const alunoAdicionado = await usersRepository.addStudentToGroup(
        alunoTestId,
        novoGrupo.id
      );

      expect(alunoAdicionado?.grupos).toHaveLength(1);

      // 3. Verificar membros do grupo
      const grupoComMembros = await usersRepository.getGroupStudents(novoGrupo.id);
      expect(grupoComMembros?.membros).toHaveLength(1);
      expect(grupoComMembros?.membros[0].id).toBe(alunoTestId);

      // 4. Verificar grupos do usuário
      const usuarioComGrupos = await usersRepository.getUserGroups(alunoTestId);
      expect(usuarioComGrupos?.grupos).toHaveLength(1);
      expect(usuarioComGrupos?.grupos[0].id).toBe(novoGrupo.id);

      // 5. Remover aluno do grupo
      const alunoRemovido = await usersRepository.removeStudentFromGroup(
        alunoTestId,
        novoGrupo.id
      );

      expect(alunoRemovido?.grupos).toHaveLength(0);

      // 6. Verificar se o grupo ficou vazio
      const grupoVazio = await usersRepository.getGroupStudents(novoGrupo.id);
      expect(grupoVazio?.membros).toHaveLength(0);

      // Cleanup
      await prisma.grupo.delete({ where: { id: novoGrupo.id } });
    });
  });

  describe('Validação da tabela _MembroGrupo', () => {
    it('deve validar o estado da tabela de relacionamento', async () => {
      // Adicionar alguns relacionamentos
      await usersRepository.addStudentToGroup(alunoTestId, grupoTestId);

      // Verificar diretamente na tabela de relacionamento
      const relacionamentos = await prisma.$queryRaw`
        SELECT 
          mg."A" as grupo_id,
          mg."B" as aluno_id,
          g.nome as grupo_nome,
          u.nome as aluno_nome
        FROM "_MembroGrupo" mg
        JOIN "Grupo" g ON g.id = mg."A"
        JOIN "User" u ON u.id = mg."B"
        WHERE mg."A" = ${grupoTestId}
      `;

      expect(relacionamentos).toHaveLength(1);
      expect((relacionamentos as any)[0].grupo_id).toBe(grupoTestId);
      expect((relacionamentos as any)[0].aluno_id).toBe(alunoTestId);
    });
  });
});
