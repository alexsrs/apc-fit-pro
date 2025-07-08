/**
 * Testes unitários para funcionalidades de grupos/times
 * Validam as operações de CRUD e relacionamentos many-to-many
 */

import { UserRepositoryClass } from '../../src/repositories/users-repository';

// Mock manual mais simples
const mockPrisma = {
  grupo: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  userPerfil: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
} as any;

// Mock do módulo prisma
jest.mock('../../src/prisma', () => mockPrisma);

describe('Grupos - Testes Unitários', () => {
  let usersRepository: UserRepositoryClass;

  beforeEach(() => {
    jest.clearAllMocks();
    usersRepository = new UserRepositoryClass();
  });

  describe('getUserGroups', () => {
    it('deve retornar lista de grupos criados pelo usuário', async () => {
      // Arrange
      const userId = 'user-123';
      const userPerfilId = 'perfil-123';
      
      mockPrisma.userPerfil.findUnique.mockResolvedValue({ id: userPerfilId });
      mockPrisma.grupo.findMany.mockResolvedValue([
        {
          id: 'grupo-1',
          nome: 'Grupo Teste',
          criadoPorId: userPerfilId,
          membros: []
        }
      ]);

      // Act
      const resultado = await usersRepository.getUserGroups(userId);

      // Assert
      expect(mockPrisma.userPerfil.findUnique).toHaveBeenCalledWith({
        where: { userId },
        select: { id: true }
      });
      
      expect(mockPrisma.grupo.findMany).toHaveBeenCalledWith({
        where: { criadoPorId: userPerfilId },
        select: {
          id: true,
          nome: true,
          criadoPorId: true,
          criadoEm: true,
          atualizadoEm: true,
          membros: {
            select: {
              id: true,
              telefone: true,
              professorId: true,
              grupoId: true,
            },
          },
        },
      });

      expect(resultado).toHaveLength(1);
      expect(resultado[0].nome).toBe('Grupo Teste');
    });

    it('deve retornar lista vazia quando usuário não tem perfil', async () => {
      // Arrange
      const userId = 'user-inexistente';
      
      mockPrisma.userPerfil.findUnique.mockResolvedValue(null);

      // Act
      const resultado = await usersRepository.getUserGroups(userId);

      // Assert
      expect(resultado).toEqual([]);
    });
  });

  describe('createUserGroup', () => {
    it('deve criar um novo grupo com sucesso', async () => {
      // Arrange
      const userId = 'user-123';
      const userPerfilId = 'perfil-123';
      const groupData = { nome: 'Novo Grupo' };
      
      mockPrisma.userPerfil.findUnique.mockResolvedValue({ id: userPerfilId });
      mockPrisma.grupo.create.mockResolvedValue({
        id: 'grupo-novo',
        nome: 'Novo Grupo',
        criadoPorId: userPerfilId
      });

      // Act
      const resultado = await usersRepository.createUserGroup(userId, groupData);

      // Assert
      expect(mockPrisma.grupo.create).toHaveBeenCalledWith({
        data: {
          ...groupData,
          criadoPorId: userPerfilId,
        },
      });

      expect(resultado.nome).toBe('Novo Grupo');
      expect(resultado.criadoPorId).toBe(userPerfilId);
    });

    it('deve lançar erro quando usuário não tem perfil', async () => {
      // Arrange
      const userId = 'user-inexistente';
      const groupData = { nome: 'Grupo Teste' };
      
      mockPrisma.userPerfil.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        usersRepository.createUserGroup(userId, groupData)
      ).rejects.toThrow('UserPerfil não encontrado para userId: user-inexistente');
    });
  });

  describe('addStudentToGroup', () => {
    it('deve adicionar aluno ao grupo usando relacionamento many-to-many', async () => {
      // Arrange
      const groupId = 'grupo-123';
      const studentId = 'aluno-123';
      
      const mockGroup = {
        id: groupId,
        nome: 'Grupo Teste',
        membros: []
      };
      
      const mockStudent = {
        id: studentId,
        user: { name: 'Aluno Teste' }
      };

      mockPrisma.grupo.findUnique.mockResolvedValue(mockGroup);
      mockPrisma.userPerfil.findUnique.mockResolvedValueOnce(mockStudent);
      mockPrisma.grupo.update.mockResolvedValue({
        ...mockGroup,
        membros: [mockStudent]
      });
      mockPrisma.userPerfil.findUnique.mockResolvedValueOnce({
        ...mockStudent,
        grupos: [mockGroup]
      });

      // Act
      const resultado = await usersRepository.addStudentToGroup(groupId, studentId);

      // Assert
      expect(mockPrisma.grupo.update).toHaveBeenCalledWith({
        where: { id: groupId },
        data: {
          membros: {
            connect: { id: studentId }
          }
        },
        include: {
          membros: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      });

      expect(resultado).toBeDefined();
    });

    it('deve lançar erro quando grupo não existe', async () => {
      // Arrange
      const groupId = 'grupo-inexistente';
      const studentId = 'aluno-123';
      
      mockPrisma.grupo.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        usersRepository.addStudentToGroup(groupId, studentId)
      ).rejects.toThrow('Grupo não encontrado: grupo-inexistente');
    });

    it('deve lançar erro quando aluno não existe', async () => {
      // Arrange
      const groupId = 'grupo-123';
      const studentId = 'aluno-inexistente';
      
      const mockGroup = { id: groupId, nome: 'Grupo Teste', membros: [] };
      
      mockPrisma.grupo.findUnique.mockResolvedValue(mockGroup);
      mockPrisma.userPerfil.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        usersRepository.addStudentToGroup(groupId, studentId)
      ).rejects.toThrow('Aluno não encontrado: aluno-inexistente');
    });
  });

  describe('removeStudentFromGroup', () => {
    it('deve remover aluno do grupo usando relacionamento many-to-many', async () => {
      // Arrange
      const groupId = 'grupo-123';
      const studentId = 'aluno-123';
      
      const mockStudent = {
        id: studentId,
        user: { name: 'Aluno Teste' },
        grupos: []
      };

      mockPrisma.grupo.update.mockResolvedValue({
        id: groupId,
        membros: []
      });
      mockPrisma.userPerfil.findUnique.mockResolvedValue(mockStudent);

      // Act
      const resultado = await usersRepository.removeStudentFromGroup(groupId, studentId);

      // Assert
      expect(mockPrisma.grupo.update).toHaveBeenCalledWith({
        where: { id: groupId },
        data: {
          membros: {
            disconnect: { id: studentId }
          }
        },
        include: {
          membros: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      });

      expect(resultado).toBeDefined();
    });
  });

  describe('getGroupStudents', () => {
    it('deve retornar membros do grupo corretamente', async () => {
      // Arrange
      const groupId = 'grupo-123';
      const mockGroup = {
        id: groupId,
        nome: 'Grupo Teste',
        membros: [
          {
            id: 'aluno-1',
            user: {
              id: 'user-1',
              name: 'Aluno 1',
              email: 'aluno1@teste.com',
              image: null
            }
          }
        ]
      };

      mockPrisma.grupo.findUnique.mockResolvedValue(mockGroup);

      // Act
      const resultado = await usersRepository.getGroupStudents(groupId);

      // Assert
      expect(mockPrisma.grupo.findUnique).toHaveBeenCalledWith({
        where: { id: groupId },
        include: {
          membros: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true
                }
              }
            }
          }
        }
      });

      expect(resultado).toEqual(mockGroup.membros);
    });

    it('deve retornar lista vazia quando grupo não existe', async () => {
      // Arrange
      const groupId = 'grupo-inexistente';
      
      mockPrisma.grupo.findUnique.mockResolvedValue(null);

      // Act
      const resultado = await usersRepository.getGroupStudents(groupId);

      // Assert
      expect(resultado).toEqual([]);
    });
  });

  describe('updateUserGroup', () => {
    it('deve atualizar grupo existente', async () => {
      // Arrange
      const userId = 'user-123';
      const groupId = 'grupo-123';
      const userPerfilId = 'perfil-123';
      const groupData = { nome: 'Grupo Atualizado' };
      
      mockPrisma.userPerfil.findUnique.mockResolvedValue({ id: userPerfilId });
      mockPrisma.grupo.update.mockResolvedValue({
        id: groupId,
        nome: 'Grupo Atualizado',
        criadoPorId: userPerfilId
      });

      // Act
      const resultado = await usersRepository.updateUserGroup(userId, groupId, groupData);

      // Assert
      expect(mockPrisma.grupo.update).toHaveBeenCalledWith({
        where: { id: groupId },
        data: {
          ...groupData,
          criadoPorId: userPerfilId,
        },
      });

      expect(resultado.nome).toBe('Grupo Atualizado');
    });
  });

  describe('deleteUserGroup', () => {
    it('deve deletar grupo existente', async () => {
      // Arrange
      const userId = 'user-123';
      const groupId = 'grupo-123';
      
      const mockDeleted = {
        id: groupId,
        nome: 'Grupo Deletado'
      };

      mockPrisma.grupo.delete.mockResolvedValue(mockDeleted);

      // Act
      const resultado = await usersRepository.deleteUserGroup(userId, groupId);

      // Assert
      expect(mockPrisma.grupo.delete).toHaveBeenCalledWith({
        where: { id: groupId },
      });

      expect(resultado).toEqual(mockDeleted);
    });
  });
});
