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
  let professorUserId: string;
  let professorUserPerfilId: string;
  let alunoUserId: string;
  let alunoUserPerfilId: string;
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
    await prisma.userPerfil.deleteMany({
      where: {
        user: {
          email: {
            in: ['professor.teste@integracao.com', 'aluno.teste@integracao.com']
          }
        }
      }
    });

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
        name: 'Professor Integração',
        email: 'professor.teste@integracao.com',
        emailVerified: new Date(),
      }
    });
    professorUserId = professor.id;

    // Criar perfil do professor
    const professorPerfil = await prisma.userPerfil.create({
      data: {
        userId: professorUserId,
        role: 'professor',
      }
    });
    professorUserPerfilId = professorPerfil.id;

    // Criar aluno de teste
    const aluno = await prisma.user.create({
      data: {
        name: 'Aluno Integração',
        email: 'aluno.teste@integracao.com',
        emailVerified: new Date(),
      }
    });
    alunoUserId = aluno.id;

    // Criar perfil do aluno
    const alunoPerfil = await prisma.userPerfil.create({
      data: {
        userId: alunoUserId,
        role: 'aluno',
      }
    });
    alunoUserPerfilId = alunoPerfil.id;

    // Criar grupo de teste
    const grupo = await prisma.grupo.create({
      data: {
        nome: 'Grupo Teste Integração',
        criadoPorId: professorUserPerfilId,
      }
    });
    grupoTestId = grupo.id;
  });

  afterEach(async () => {
    // Limpar dados após cada teste
    await prisma.userPerfil.deleteMany({
      where: {
        user: {
          email: {
            in: ['professor.teste@integracao.com', 'aluno.teste@integracao.com']
          }
        }
      }
    });

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
      const resultado = await usersRepository.addStudentToGroup(grupoTestId, alunoUserPerfilId);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado?.grupos).toHaveLength(1);
      expect(resultado?.grupos[0].id).toBe(grupoTestId);

      // Verificar no banco se o relacionamento foi criado
      const relacionamento = await prisma.$queryRaw`
        SELECT * FROM "_MembroGrupo" 
        WHERE "A" = ${grupoTestId} AND "B" = ${alunoUserPerfilId}
      `;
      expect(relacionamento).toHaveLength(1);
    });

    it('deve permitir adicionar múltiplos alunos ao mesmo grupo', async () => {
      // Arrange - Criar segundo aluno
      const aluno2 = await prisma.user.create({
        data: {
          name: 'Segundo Aluno',
          email: 'aluno2.teste@integracao.com',
          emailVerified: new Date(),
        }
      });

      const aluno2Perfil = await prisma.userPerfil.create({
        data: {
          userId: aluno2.id,
          role: 'aluno',
        }
      });

      // Act
      await usersRepository.addStudentToGroup(grupoTestId, alunoUserPerfilId);
      await usersRepository.addStudentToGroup(grupoTestId, aluno2Perfil.id);

      // Assert
      const grupoComMembros = await usersRepository.getGroupStudents(grupoTestId);
      expect(grupoComMembros).toHaveLength(2);

      // Cleanup
      await prisma.userPerfil.delete({ where: { id: aluno2Perfil.id } });
      await prisma.user.delete({ where: { id: aluno2.id } });
    });

    it('deve permitir adicionar um aluno a múltiplos grupos', async () => {
      // Arrange - Criar segundo grupo
      const grupo2 = await prisma.grupo.create({
        data: {
          nome: 'Grupo Teste Integração 2',
          criadoPorId: professorUserPerfilId,
        }
      });

      // Act
      await usersRepository.addStudentToGroup(grupoTestId, alunoUserPerfilId);
      await usersRepository.addStudentToGroup(grupo2.id, alunoUserPerfilId);

      // Assert
      const alunoAtualizado = await prisma.userPerfil.findUnique({
        where: { id: alunoUserPerfilId },
        include: { grupos: true }
      });
      
      expect(alunoAtualizado?.grupos).toHaveLength(2);

      // Cleanup
      await prisma.grupo.delete({ where: { id: grupo2.id } });
    });
  });

  describe('removeStudentFromGroup', () => {
    beforeEach(async () => {
      // Adicionar aluno ao grupo antes dos testes de remoção
      await usersRepository.addStudentToGroup(grupoTestId, alunoUserPerfilId);
    });

    it('deve remover um aluno do grupo no banco de dados', async () => {
      // Act
      const resultado = await usersRepository.removeStudentFromGroup(grupoTestId, alunoUserPerfilId);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado?.grupos).toHaveLength(0);

      // Verificar no banco se o relacionamento foi removido
      const relacionamento = await prisma.$queryRaw`
        SELECT * FROM "_MembroGrupo" 
        WHERE "A" = ${grupoTestId} AND "B" = ${alunoUserPerfilId}
      `;
      expect(relacionamento).toHaveLength(0);
    });

    it('deve manter outros relacionamentos ao remover um específico', async () => {
      // Arrange - Criar segundo grupo e adicionar aluno a ambos
      const grupo2 = await prisma.grupo.create({
        data: {
          nome: 'Grupo Teste Integração 2',
          criadoPorId: professorUserPerfilId,
        }
      });

      await usersRepository.addStudentToGroup(grupo2.id, alunoUserPerfilId);

      // Act - Remover apenas do primeiro grupo
      await usersRepository.removeStudentFromGroup(grupoTestId, alunoUserPerfilId);

      // Assert - Deve ainda estar no segundo grupo
      const alunoAtualizado = await prisma.userPerfil.findUnique({
        where: { id: alunoUserPerfilId },
        include: { grupos: true }
      });
      
      expect(alunoAtualizado?.grupos).toHaveLength(1);
      expect(alunoAtualizado?.grupos[0].id).toBe(grupo2.id);

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
      expect(resultado).toHaveLength(0);
    });

    it('deve retornar os membros do grupo corretamente', async () => {
      // Arrange
      await usersRepository.addStudentToGroup(grupoTestId, alunoUserPerfilId);

      // Act
      const resultado = await usersRepository.getGroupStudents(grupoTestId);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado).toHaveLength(1);
      expect(resultado[0].id).toBe(alunoUserPerfilId);
      expect(resultado[0].user.name).toBe('Aluno Integração');
    });
  });

  describe('getUserGroups', () => {
    it('deve retornar lista vazia quando usuário não criou grupos', async () => {
      // Act
      const resultado = await usersRepository.getUserGroups(alunoUserId);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado).toHaveLength(0);
    });

    it('deve retornar os grupos criados pelo usuário', async () => {
      // Act
      const resultado = await usersRepository.getUserGroups(professorUserId);

      // Assert
      expect(resultado).toBeDefined();
      expect(resultado).toHaveLength(1);
      expect(resultado[0].id).toBe(grupoTestId);
      expect(resultado[0].nome).toBe('Grupo Teste Integração');
    });
  });

  describe('createUserGroup', () => {
    it('deve criar um novo grupo no banco de dados', async () => {
      // Act
      const novoGrupo = await usersRepository.createUserGroup(professorUserId, {
        nome: 'Novo Grupo Integração',
      });

      // Assert
      expect(novoGrupo).toBeDefined();
      expect(novoGrupo.nome).toBe('Novo Grupo Integração');
      expect(novoGrupo.criadoPorId).toBe(professorUserPerfilId);

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
      const novoGrupo = await usersRepository.createUserGroup(professorUserId, {
        nome: 'Grupo Fluxo Completo',
      });

      expect(novoGrupo).toBeDefined();

      // 2. Adicionar aluno ao grupo
      const alunoAdicionado = await usersRepository.addStudentToGroup(
        novoGrupo.id,
        alunoUserPerfilId
      );

      expect(alunoAdicionado?.grupos).toHaveLength(1);

      // 3. Verificar membros do grupo
      const grupoComMembros = await usersRepository.getGroupStudents(novoGrupo.id);
      expect(grupoComMembros).toHaveLength(1);
      expect(grupoComMembros[0].id).toBe(alunoUserPerfilId);

      // 4. Verificar grupos criados pelo professor
      const gruposCriados = await usersRepository.getUserGroups(professorUserId);
      expect(gruposCriados).toHaveLength(2); // grupo original + novo grupo

      // 5. Remover aluno do grupo
      const alunoRemovido = await usersRepository.removeStudentFromGroup(
        novoGrupo.id,
        alunoUserPerfilId
      );

      expect(alunoRemovido?.grupos).toHaveLength(0);

      // 6. Verificar se o grupo ficou vazio
      const grupoVazio = await usersRepository.getGroupStudents(novoGrupo.id);
      expect(grupoVazio).toHaveLength(0);

      // Cleanup
      await prisma.grupo.delete({ where: { id: novoGrupo.id } });
    });
  });

  describe('Validação da tabela _MembroGrupo', () => {
    it('deve validar o estado da tabela de relacionamento', async () => {
      // Adicionar alguns relacionamentos
      await usersRepository.addStudentToGroup(grupoTestId, alunoUserPerfilId);

      // Verificar diretamente na tabela de relacionamento
      const relacionamentos = await prisma.$queryRaw`
        SELECT 
          mg."A" as grupo_id,
          mg."B" as aluno_id,
          g.nome as grupo_nome,
          u.name as aluno_nome
        FROM "_MembroGrupo" mg
        JOIN "Grupo" g ON g.id = mg."A"
        JOIN "UserPerfil" up ON up.id = mg."B"
        JOIN "User" u ON u.id = up."userId"
        WHERE mg."A" = ${grupoTestId}
      `;

      expect(relacionamentos).toHaveLength(1);
      expect((relacionamentos as any)[0].grupo_id).toBe(grupoTestId);
      expect((relacionamentos as any)[0].aluno_id).toBe(alunoUserPerfilId);
      expect((relacionamentos as any)[0].grupo_nome).toBe('Grupo Teste Integração');
      expect((relacionamentos as any)[0].aluno_nome).toBe('Aluno Integração');
    });

    it('deve verificar integridade referencial da tabela _MembroGrupo', async () => {
      // Adicionar relacionamento
      await usersRepository.addStudentToGroup(grupoTestId, alunoUserPerfilId);

      // Verificar se todos os IDs existem nas tabelas relacionadas
      const verificacaoIntegridade = await prisma.$queryRaw`
        SELECT 
          COUNT(*) as total_relacionamentos,
          COUNT(g.id) as grupos_validos,
          COUNT(up.id) as perfis_validos
        FROM "_MembroGrupo" mg
        LEFT JOIN "Grupo" g ON g.id = mg."A"
        LEFT JOIN "UserPerfil" up ON up.id = mg."B"
        WHERE mg."A" = ${grupoTestId}
      `;

      const resultado = (verificacaoIntegridade as any)[0];
      expect(resultado.total_relacionamentos).toBe(resultado.grupos_validos);
      expect(resultado.total_relacionamentos).toBe(resultado.perfis_validos);
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com tentativa de adicionar aluno que já está no grupo', async () => {
      // Arrange - Adicionar aluno uma vez
      await usersRepository.addStudentToGroup(grupoTestId, alunoUserPerfilId);

      // Act - Tentar adicionar novamente
      const resultado = await usersRepository.addStudentToGroup(grupoTestId, alunoUserPerfilId);

      // Assert - Deve continuar com apenas um relacionamento
      expect(resultado?.grupos).toHaveLength(1);

      const relacionamentos = await prisma.$queryRaw`
        SELECT COUNT(*) as total FROM "_MembroGrupo" 
        WHERE "A" = ${grupoTestId} AND "B" = ${alunoUserPerfilId}
      `;
      expect((relacionamentos as any)[0].total).toBe(1);
    });

    it('deve lançar erro ao tentar adicionar aluno inexistente', async () => {
      // Act & Assert
      await expect(
        usersRepository.addStudentToGroup(grupoTestId, 'perfil-inexistente')
      ).rejects.toThrow();
    });

    it('deve lançar erro ao tentar adicionar a grupo inexistente', async () => {
      // Act & Assert
      await expect(
        usersRepository.addStudentToGroup('grupo-inexistente', alunoUserPerfilId)
      ).rejects.toThrow();
    });
  });
});
