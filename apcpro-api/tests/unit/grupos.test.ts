/**
 * Testes unitários para funcionalidades de grupos/times
 * Validam o relacionamento many-to-many entre alunos e grupos
 */

import { jest } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
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
} as any;

// Mock dos dados de teste
const mockProfessor = {
  id: 'prof-123',
  nome: 'Professor Teste',
  email: 'professor@teste.com',
  accountType: 'professor' as const,
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
  accountType: 'aluno' as const,
  grupos: [],
};

const mockAlunoComGrupos = {
  ...mockAluno,
  grupos: [mockGrupo],
};

describe('Grupos - Testes Unitários', () => {
  let usersRepository: UserRepositoryClass;

  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
    
    // Instanciar o repository com o mock do Prisma
    usersRepository = new UserRepositoryClass();
    (usersRepository as any).prisma = mockPrisma;
  });

  describe('addStudentToGroup', () => {
    it('deve adicionar um aluno ao grupo com sucesso', async () => {
      // Arrange
      const alunoId = 'aluno-123';
      const grupoId = 'grupo-123';

      // Mock do update que adiciona o aluno ao grupo
      (mockPrisma.user.update as jest.Mock).mockResolvedValue({
        ...mockAluno,
        grupos: [mockGrupo],
      });

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

      expect(resultado).toEqual({
        ...mockAluno,
        grupos: [mockGrupo],
      });
    });

    it('deve lançar erro se o aluno não for encontrado', async () => {
      // Arrange
      const alunoId = 'aluno-inexistente';
      const grupoId = 'grupo-123';

      (mockPrisma.user.update as jest.Mock).mockRejectedValue(
        new Error('User not found')
      );

      // Act & Assert
      await expect(
        usersRepository.addStudentToGroup(alunoId, grupoId)
      ).rejects.toThrow('User not found');
    });
  });

  describe('removeStudentFromGroup', () => {
    it('deve remover um aluno do grupo com sucesso', async () => {
      // Arrange
      const alunoId = 'aluno-123';
      const grupoId = 'grupo-123';

      (mockPrisma.user.update as jest.Mock).mockResolvedValue({
        ...mockAluno,
        grupos: [], // Aluno removido do grupo
      });

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

      expect(resultado).toBeDefined();
      expect(resultado?.grupos).toHaveLength(0);
    });

    it('deve lançar erro se tentar remover aluno de grupo inexistente', async () => {
      // Arrange
      const alunoId = 'aluno-123';
      const grupoId = 'grupo-inexistente';

      (mockPrisma.user.update as jest.Mock).mockRejectedValue(
        new Error('Group not found')
      );

      // Act & Assert
      await expect(
        usersRepository.removeStudentFromGroup(alunoId, grupoId)
      ).rejects.toThrow('Group not found');
    });
  });

  describe('getGroupStudents', () => {
    it('deve retornar os alunos de um grupo', async () => {
      // Arrange
      const grupoId = 'grupo-123';
      const mockGrupoComMembros = {
        ...mockGrupo,
        membros: [mockAluno],
      };

      (mockPrisma.grupo.findUnique as jest.Mock).mockResolvedValue(mockGrupoComMembros);

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

      expect(resultado).toEqual(mockGrupoComMembros);
    });

    it('deve retornar null se o grupo não existir', async () => {
      // Arrange
      const grupoId = 'grupo-inexistente';

      (mockPrisma.grupo.findUnique as jest.Mock).mockResolvedValue(null);

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

      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockAlunoComGrupos);

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

      expect(resultado).toEqual(mockAlunoComGrupos);
    });

    it('deve retornar null se o usuário não existir', async () => {
      // Arrange
      const userId = 'usuario-inexistente';

      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

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

      (mockPrisma.grupo.create as jest.Mock).mockResolvedValue(novoGrupo);

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

    it('deve lançar erro se dados inválidos forem fornecidos', async () => {
      // Arrange
      const dadosInvalidos = {
        nome: '',
        descricao: 'Descrição',
        professorId: 'prof-123',
      };

      (mockPrisma.grupo.create as jest.Mock).mockRejectedValue(
        new Error('Nome é obrigatório')
      );

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
});
