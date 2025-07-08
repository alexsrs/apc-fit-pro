/**
 * Testes unitários para funcionalidades de grupos/times
 * Validam o relacionamento many-to-many entre alunos e grupos
 */

import { UserRepositoryClass } from '../../src/repositories/users-repository';

// Mock do Prisma
const mockPrisma = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  grupo: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findFirst: jest.fn(),
  },
  $transaction: jest.fn(),
};

// Mock global do prisma
jest.mock('../../src/prisma', () => mockPrisma);

// Dados de teste
const mockProfessor = {
  id: 'prof-123',
  nome: 'Professor Teste',
  email: 'professor@teste.com',
  accountType: 'professor',
};

const mockGrupo = {
  id: 'grupo-123',
  nome: 'Grupo Teste',
  descricao: 'Grupo para testes',
  professorId: 'prof-123',
  criadoEm: new Date(),
  atualizadoEm: new Date(),
  membros: [],
};

const mockAluno = {
  id: 'aluno-123',
  nome: 'Aluno Teste',
  email: 'aluno@teste.com',
  accountType: 'aluno',
  grupos: [],
};

describe('Grupos - Testes Unitários', () => {
  let usersRepository: UserRepositoryClass;

  beforeEach(() => {
    jest.clearAllMocks();
    usersRepository = new UserRepositoryClass();
  });

  describe('addStudentToGroup', () => {
    it('deve adicionar um aluno ao grupo com sucesso', async () => {
      // Arrange
      const alunoId = 'aluno-123';
      const grupoId = 'grupo-123';
      const resultadoEsperado = {
        ...mockAluno,
        grupos: [mockGrupo],
      };

      mockPrisma.user.update.mockResolvedValue(resultadoEsperado);

      // Act
      const resultado = await usersRepository.addStudentToGroup(alunoId, grupoId);

      // Assert
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: alunoId },
        data: {
          grupos: {
            connect: { id: grupoId }
          }
        },
        include: {
          grupos: {
            include: {
              membros: {
                select: {
                  id: true,
                  nome: true,
                  email: true
                }
              }
            }
          }
        }
      });

      expect(resultado).toEqual(resultadoEsperado);
    });

    it('deve lançar erro quando aluno não for encontrado', async () => {
      // Arrange
      const alunoId = 'aluno-inexistente';
      const grupoId = 'grupo-123';

      mockPrisma.user.update.mockRejectedValue(new Error('Aluno não encontrado'));

      // Act & Assert
      await expect(
        usersRepository.addStudentToGroup(alunoId, grupoId)
      ).rejects.toThrow('Aluno não encontrado');
    });
  });

  describe('removeStudentFromGroup', () => {
    it('deve remover um aluno do grupo com sucesso', async () => {
      // Arrange
      const alunoId = 'aluno-123';
      const grupoId = 'grupo-123';
      const resultadoEsperado = {
        ...mockAluno,
        grupos: [],
      };

      mockPrisma.user.update.mockResolvedValue(resultadoEsperado);

      // Act
      const resultado = await usersRepository.removeStudentFromGroup(alunoId, grupoId);

      // Assert
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: alunoId },
        data: {
          grupos: {
            disconnect: { id: grupoId }
          }
        },
        include: {
          grupos: {
            include: {
              membros: {
                select: {
                  id: true,
                  nome: true,
                  email: true
                }
              }
            }
          }
        }
      });

      expect(resultado).toEqual(resultadoEsperado);
    });

    it('deve lançar erro quando grupo não for encontrado', async () => {
      // Arrange
      const alunoId = 'aluno-123';
      const grupoId = 'grupo-inexistente';

      mockPrisma.user.update.mockRejectedValue(new Error('Grupo não encontrado'));

      // Act & Assert
      await expect(
        usersRepository.removeStudentFromGroup(alunoId, grupoId)
      ).rejects.toThrow('Grupo não encontrado');
    });
  });

  describe('getGroupStudents', () => {
    it('deve retornar os alunos de um grupo', async () => {
      // Arrange
      const grupoId = 'grupo-123';
      const grupoComMembros = {
        ...mockGrupo,
        membros: [mockAluno],
      };

      mockPrisma.grupo.findUnique.mockResolvedValue(grupoComMembros);

      // Act
      const resultado = await usersRepository.getGroupStudents(grupoId);

      // Assert
      expect(mockPrisma.grupo.findUnique).toHaveBeenCalledWith({
        where: { id: grupoId },
        include: {
          membros: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        }
      });

      expect(resultado).toEqual(grupoComMembros);
    });

    it('deve retornar null quando grupo não existir', async () => {
      // Arrange
      const grupoId = 'grupo-inexistente';

      mockPrisma.grupo.findUnique.mockResolvedValue(null);

      // Act
      const resultado = await usersRepository.getGroupStudents(grupoId);

      // Assert
      expect(resultado).toBeNull();
    });
  });

  describe('getUserGroups', () => {
    it('deve retornar os grupos de um usuário', async () => {
      // Arrange
      const userId = 'aluno-123';
      const usuarioComGrupos = {
        ...mockAluno,
        grupos: [mockGrupo],
      };

      mockPrisma.user.findUnique.mockResolvedValue(usuarioComGrupos);

      // Act
      const resultado = await usersRepository.getUserGroups(userId);

      // Assert
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: {
          grupos: {
            include: {
              membros: {
                select: {
                  id: true,
                  nome: true,
                  email: true
                }
              }
            }
          }
        }
      });

      expect(resultado).toEqual(usuarioComGrupos);
    });

    it('deve retornar null quando usuário não existir', async () => {
      // Arrange
      const userId = 'usuario-inexistente';

      mockPrisma.user.findUnique.mockResolvedValue(null);

      // Act
      const resultado = await usersRepository.getUserGroups(userId);

      // Assert
      expect(resultado).toBeNull();
    });
  });

  describe('createGroup', () => {
    it('deve criar um grupo com sucesso', async () => {
      // Arrange
      const dadosGrupo = {
        nome: 'Novo Grupo',
        descricao: 'Descrição do grupo',
        professorId: 'prof-123',
      };

      const novoGrupo = {
        id: 'grupo-novo',
        ...dadosGrupo,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        membros: [],
      };

      mockPrisma.grupo.create.mockResolvedValue(novoGrupo);

      // Act
      const resultado = await usersRepository.createGroup(
        dadosGrupo.nome,
        dadosGrupo.descricao,
        dadosGrupo.professorId
      );

      // Assert
      expect(mockPrisma.grupo.create).toHaveBeenCalledWith({
        data: {
          nome: dadosGrupo.nome,
          descricao: dadosGrupo.descricao,
          professorId: dadosGrupo.professorId,
        },
        include: {
          membros: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        }
      });

      expect(resultado).toEqual(novoGrupo);
    });

    it('deve lançar erro quando dados inválidos forem fornecidos', async () => {
      // Arrange
      const dadosInvalidos = {
        nome: '',
        descricao: 'Descrição',
        professorId: 'prof-123',
      };

      mockPrisma.grupo.create.mockRejectedValue(new Error('Nome é obrigatório'));

      // Act & Assert
      await expect(
        usersRepository.createGroup(
          dadosInvalidos.nome,
          dadosInvalidos.descricao,
          dadosInvalidos.professorId
        )
      ).rejects.toThrow('Nome é obrigatório');
    });
  });

  describe('Integração - Fluxo completo de grupos', () => {
    it('deve executar um fluxo completo: criar grupo, adicionar aluno, listar membros, remover aluno', async () => {
      // 1. Criar grupo
      const novoGrupo = {
        id: 'grupo-novo',
        nome: 'Grupo Integração',
        descricao: 'Teste integração',
        professorId: 'prof-123',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        membros: [],
      };

      mockPrisma.grupo.create.mockResolvedValue(novoGrupo);

      const grupoCreated = await usersRepository.createGroup(
        'Grupo Integração',
        'Teste integração',
        'prof-123'
      );

      expect(grupoCreated).toEqual(novoGrupo);

      // 2. Adicionar aluno ao grupo
      const alunoComGrupo = {
        ...mockAluno,
        grupos: [novoGrupo],
      };

      mockPrisma.user.update.mockResolvedValue(alunoComGrupo);

      const alunoAdicionado = await usersRepository.addStudentToGroup(
        'aluno-123',
        'grupo-novo'
      );

      expect(alunoAdicionado).toEqual(alunoComGrupo);

      // 3. Listar membros do grupo
      const grupoComMembros = {
        ...novoGrupo,
        membros: [mockAluno],
      };

      mockPrisma.grupo.findUnique.mockResolvedValue(grupoComMembros);

      const membrosGrupo = await usersRepository.getGroupStudents('grupo-novo');

      expect(membrosGrupo).toEqual(grupoComMembros);

      // 4. Remover aluno do grupo
      const alunoSemGrupo = {
        ...mockAluno,
        grupos: [],
      };

      mockPrisma.user.update.mockResolvedValue(alunoSemGrupo);

      const alunoRemovido = await usersRepository.removeStudentFromGroup(
        'aluno-123',
        'grupo-novo'
      );

      expect(alunoRemovido).toEqual(alunoSemGrupo);
    });
  });
});
