// Testes unitários unificados para funcionalidades de grupos/times
// Cobrem todos os métodos do UserRepositoryClass usando apenas mocks

// Mock global do Prisma (tipado como any para evitar erros de never)
const mockPrisma: any = {
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
  userPerfil: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $transaction: jest.fn(),
};

jest.mock('../../src/prisma', () => mockPrisma);

import { UserRepositoryClass } from '../../src/repositories/users-repository';

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

// ... Testes agrupados por método ...

describe('Grupos - Testes Unitários', () => {
  let usersRepository: UserRepositoryClass;

  beforeEach(() => {
    jest.clearAllMocks();
    usersRepository = new UserRepositoryClass();
  });

  // getUserGroups
  describe('getUserGroups', () => {
    it('deve retornar os grupos de um usuário', async () => {
      const userId = 'user-123';
      const userPerfilMock = { id: 'perfil-123' };
      const gruposMock = [{ id: 'grupo-1', nome: 'Grupo 1', membros: [] }];
      mockPrisma.userPerfil.findUnique.mockResolvedValue(userPerfilMock);
      mockPrisma.grupo.findMany.mockResolvedValue(gruposMock);
      const resultado = await usersRepository.getUserGroups(userId);
      expect(mockPrisma.userPerfil.findUnique).toHaveBeenCalledWith({ where: { userId }, select: { id: true } });
      expect(mockPrisma.grupo.findMany).toHaveBeenCalledWith({ where: { criadoPorId: userPerfilMock.id }, select: expect.any(Object) });
      expect(resultado).toEqual(gruposMock);
    });
    it('deve retornar array vazio se não encontrar perfil', async () => {
      const userId = 'user-inexistente';
      mockPrisma.userPerfil.findUnique.mockResolvedValue(null);
      const resultado = await usersRepository.getUserGroups(userId);
      expect(resultado).toEqual([]);
    });
  });

  // createUserGroup
  describe('createUserGroup', () => {
    it('deve criar um grupo com sucesso', async () => {
      const userId = 'user-123';
      const userPerfilMock = { id: 'perfil-123' };
      const groupData = { nome: 'Grupo Novo', descricao: 'Desc', membros: [] };
      const grupoCriado = { id: 'grupo-novo', ...groupData, criadoPorId: userPerfilMock.id, criadoEm: new Date(), atualizadoEm: new Date() };
      mockPrisma.userPerfil.findUnique.mockResolvedValue(userPerfilMock);
      mockPrisma.grupo.create.mockResolvedValue(grupoCriado);
      const resultado = await usersRepository.createUserGroup(userId, groupData);
      expect(mockPrisma.userPerfil.findUnique).toHaveBeenCalledWith({ where: { userId }, select: { id: true } });
      expect(mockPrisma.grupo.create).toHaveBeenCalledWith({ data: { ...groupData, criadoPorId: userPerfilMock.id }, select: expect.any(Object) });
      expect(resultado).toEqual(grupoCriado);
    });
    it('deve lançar erro se não encontrar perfil', async () => {
      const userId = 'user-inexistente';
      const groupData = { nome: 'Grupo Novo', descricao: 'Desc' };
      mockPrisma.userPerfil.findUnique.mockResolvedValue(null);
      await expect(usersRepository.createUserGroup(userId, groupData)).rejects.toThrow('UserPerfil não encontrado para userId: user-inexistente');
    });
  });

  // addStudentToGroup
  describe('addStudentToGroup', () => {
    it('deve adicionar um aluno ao grupo com sucesso', async () => {
      const groupId = 'grupo-123';
      const studentId = 'aluno-123';
      const grupoMock = { id: groupId, nome: 'Grupo Teste', membros: [], criadoPorId: 'prof-123', criadoEm: new Date(), atualizadoEm: new Date() };
      const alunoMock = { id: studentId, nome: 'Aluno Teste', email: 'aluno@teste.com', user: { id: studentId, name: 'Aluno Teste', email: 'aluno@teste.com' }, grupos: [grupoMock] };
      mockPrisma.grupo.findUnique.mockResolvedValue(grupoMock);
      mockPrisma.userPerfil.findUnique.mockResolvedValueOnce({ ...alunoMock, grupos: [] });
      mockPrisma.grupo.update.mockResolvedValue({ ...grupoMock, membros: [{ ...alunoMock }] });
      mockPrisma.userPerfil.findUnique.mockResolvedValueOnce(alunoMock);
      const resultado = await usersRepository.addStudentToGroup(groupId, studentId);
      expect(mockPrisma.grupo.findUnique).toHaveBeenCalledWith({ where: { id: groupId }, include: { membros: true } });
      expect(mockPrisma.userPerfil.findUnique).toHaveBeenCalledWith({ where: { id: studentId }, include: { user: true } });
      expect(mockPrisma.grupo.update).toHaveBeenCalledWith({
        where: { id: groupId },
        data: { membros: { connect: { id: studentId } } },
        include: { membros: { include: { user: { select: { id: true, name: true, email: true } } } } }
      });
      expect(resultado).toEqual(alunoMock);
    });
    it('deve lançar erro quando grupo não for encontrado', async () => {
      const groupId = 'grupo-inexistente';
      const studentId = 'aluno-123';
      mockPrisma.grupo.findUnique.mockResolvedValue(null);
      await expect(usersRepository.addStudentToGroup(groupId, studentId)).rejects.toThrow('Grupo não encontrado');
    });
    it('deve lançar erro quando aluno não for encontrado', async () => {
      const groupId = 'grupo-123';
      const studentId = 'aluno-inexistente';
      mockPrisma.grupo.findUnique.mockResolvedValue({ id: groupId, membros: [] });
      mockPrisma.userPerfil.findUnique.mockResolvedValue(null);
      await expect(usersRepository.addStudentToGroup(groupId, studentId)).rejects.toThrow('Aluno não encontrado');
    });
  });

  // removeStudentFromGroup
  describe('removeStudentFromGroup', () => {
    it('deve remover um aluno do grupo com sucesso', async () => {
      const groupId = 'grupo-123';
      const studentId = 'aluno-123';
      const alunoMock = { id: studentId, nome: 'Aluno Teste', user: { id: studentId, name: 'Aluno Teste', email: 'aluno@teste.com' }, grupos: [] };
      mockPrisma.grupo.update.mockResolvedValue({ id: groupId, membros: [] });
      mockPrisma.userPerfil.findUnique.mockResolvedValue(alunoMock);
      const resultado = await usersRepository.removeStudentFromGroup(groupId, studentId);
      expect(mockPrisma.grupo.update).toHaveBeenCalledWith({
        where: { id: groupId },
        data: { membros: { disconnect: { id: studentId } } },
        include: { membros: { include: { user: { select: { id: true, name: true, email: true } } } } }
      });
      expect(resultado).toEqual(alunoMock);
    });
    it('deve lançar erro se o update do grupo falhar', async () => {
      const groupId = 'grupo-123';
      const studentId = 'aluno-123';
      mockPrisma.grupo.update.mockRejectedValue(new Error('Erro ao remover aluno'));
      await expect(usersRepository.removeStudentFromGroup(groupId, studentId)).rejects.toThrow('Erro ao remover aluno');
    });
  });

  // getGroupStudents
  describe('getGroupStudents', () => {
    it('deve retornar os membros do grupo', async () => {
      const groupId = 'grupo-123';
      const membrosMock = [{ id: 'aluno-1', user: { id: 'aluno-1', name: 'Aluno 1', email: 'a1@teste.com', image: null } }];
      mockPrisma.grupo.findUnique.mockResolvedValue({ id: groupId, membros: membrosMock });
      const resultado = await usersRepository.getGroupStudents(groupId);
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
      expect(resultado).toEqual(membrosMock);
    });
    it('deve retornar array vazio quando grupo não existir', async () => {
      const groupId = 'grupo-inexistente';
      mockPrisma.grupo.findUnique.mockResolvedValue(null);
      const resultado = await usersRepository.getGroupStudents(groupId);
      expect(resultado).toEqual([]);
    });
  });

  // Fluxo completo
  describe('Integração - Fluxo completo de grupos', () => {
    it('deve executar um fluxo completo: criar grupo, adicionar aluno, listar membros, remover aluno', async () => {
      // 1. Criar grupo
      const userId = 'prof-123';
      const userPerfilMock = { id: 'perfil-123' };
      const novoGrupo = {
        id: 'grupo-novo',
        nome: 'Grupo Integração',
        descricao: 'Teste integração',
        criadoPorId: userPerfilMock.id,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        membros: [],
      };
      mockPrisma.userPerfil.findUnique.mockResolvedValue(userPerfilMock);
      mockPrisma.grupo.create.mockResolvedValue(novoGrupo);
      const grupoCreated = await usersRepository.createUserGroup(userId, { nome: 'Grupo Integração', descricao: 'Teste integração', membros: [] });
      expect(grupoCreated).toEqual(novoGrupo);

      // 2. Adicionar aluno ao grupo
      const groupId = 'grupo-novo';
      const studentId = 'aluno-123';
      const grupoMock = { ...novoGrupo, membros: [] };
      const alunoMock = { id: studentId, nome: 'Aluno Teste', email: 'aluno@teste.com', user: { id: studentId, name: 'Aluno Teste', email: 'aluno@teste.com' }, grupos: [novoGrupo] };
      mockPrisma.grupo.findUnique.mockResolvedValue(grupoMock);
      mockPrisma.userPerfil.findUnique.mockResolvedValueOnce({ ...alunoMock, grupos: [] });
      mockPrisma.grupo.update.mockResolvedValue({ ...grupoMock, membros: [{ ...alunoMock }] });
      mockPrisma.userPerfil.findUnique.mockResolvedValueOnce(alunoMock);
      const alunoAdicionado = await usersRepository.addStudentToGroup(groupId, studentId);
      expect(alunoAdicionado).toEqual(alunoMock);

      // 3. Listar membros do grupo
      const membrosMock = [{ ...alunoMock }];
      mockPrisma.grupo.findUnique.mockResolvedValue({ ...novoGrupo, membros: membrosMock });
      const membrosGrupo = await usersRepository.getGroupStudents(groupId);
      expect(membrosGrupo).toEqual(membrosMock);

      // 4. Remover aluno do grupo
      const alunoSemGrupo = { ...alunoMock, grupos: [] };
      mockPrisma.grupo.update.mockResolvedValue({ ...novoGrupo, membros: [] });
      mockPrisma.userPerfil.findUnique.mockResolvedValue(alunoSemGrupo);
      const alunoRemovido = await usersRepository.removeStudentFromGroup(groupId, studentId);
      expect(alunoRemovido).toEqual(alunoSemGrupo);
    });
  });
});
