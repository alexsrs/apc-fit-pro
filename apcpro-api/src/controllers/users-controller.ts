import { Request, Response, NextFunction } from "express";
import { UsersService } from "../services/users-service";
import { ok } from "../utils/http-helper";

const usersService = new UsersService();
// Usuários
export async function getUser(req: Request, res: Response) {
  try {
    const users = await usersService.getAllUsers();
    const response = await ok(users);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários.", error });
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  const userId = req.params.id;
  const user = await usersService.findUserById(userId);
  if (user === null || user === undefined) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.status(200).json(user);
}
// Novo endpoint para buscar perfil do usuário por userId
export const getUserProfileByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId; // Obtém o ID do usuário da rota

    // Lógica para buscar o perfil do usuário
    const userProfile = await usersService.getUserProfile(userId);

    if (!userProfile) {
      res.status(404).json({ message: "Perfil não encontrado" });
      return;
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const postUserProfileByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Lógica para lidar com a requisição
    const userId = req.params.userId;
    const profileData = await usersService.createUserProfile(userId, req.body);
    // Exemplo: salvar no banco de dados usando Prisma
    res.status(201).json(profileData);
  } catch (error) {
    // Passa o erro para o middleware de tratamento de erros
  }
};

// Alunos relacionados
export async function getUserStudents(req: Request, res: Response) {
  const userId = req.params.id;
  const students = await usersService.getUserStudents(userId);
  res.json(students);
}

export async function addStudentToUser(req: Request, res: Response) {
  const userId = req.params.id;
  const student = await usersService.addStudentToUser(userId, req.body);
  res.status(201).json(student);
}

export async function updateUserStudent(req: Request, res: Response) {
  const userId = req.params.id;
  const studentId = req.params.alunoId;
  const student = await usersService.updateUserStudent(
    userId,
    studentId,
    req.body
  );
  res.json(student);
}

export async function removeStudentFromUser(req: Request, res: Response) {
  const userId = req.params.id;
  const studentId = req.params.alunoId;
  await usersService.removeStudentFromUser(userId, studentId);
  res.status(204).send();
}

// Grupos
export async function getUserGroups(req: Request, res: Response) {
  const userId = req.params.id;
  const groups = await usersService.getUserGroups(userId);
  res.json(groups);
}

export async function createUserGroup(req: Request, res: Response) {
  const userId = req.params.id;
  const group = await usersService.createUserGroup(userId, req.body);
  res.status(201).json(group);
}

export async function updateUserGroup(req: Request, res: Response) {
  const userId = req.params.id;
  const groupId = req.params.groupId;
  const group = await usersService.updateUserGroup(userId, groupId, req.body);
  res.json(group);
}

export async function deleteUserGroup(req: Request, res: Response) {
  const userId = req.params.id;
  const groupId = req.params.groupId;
  await usersService.deleteUserGroup(userId, groupId);
  res.status(204).send();
}

export async function getProfessores(req: Request, res: Response) {
  const professores = await usersService.getUsersByRole("professor");
  res.json(professores);
}

export async function getProfessorById(req: Request, res: Response) {
  const { id } = req.params;
  const professor = await usersService.getProfessorById(id);
  res.json(professor);
}

export async function getAlunoAvaliacaoValida(req: Request, res: Response) {
  const userPerfilId = req.params.userPerfilId;
  try {
    const possuiValida = await usersService.alunoPossuiAvaliacaoValida(
      userPerfilId
    );
    res.json({ possuiAvaliacaoValida: possuiValida });
  } catch (error) {
    res.status(500).json({ message: "Erro ao verificar avaliação válida." });
  }
}

export async function listarAvaliacoesAluno(req: Request, res: Response) {
  const userPerfilId = req.params.userPerfilId;
  try {
    const avaliacoes = await usersService.listarAvaliacoesAluno(userPerfilId);
    res.json(avaliacoes);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar avaliações." });
  }
}

export async function cadastrarAvaliacaoAluno(req: Request, res: Response) {
  const userPerfilId = req.params.userPerfilId;
  const dados = req.body;

  try {
    const avaliacao = await usersService.cadastrarAvaliacaoAluno(
      userPerfilId,
      dados
    );
    res.status(201).json(avaliacao);
  } catch (error) {
    res.status(500).json({ message: "Erro ao cadastrar avaliação." });
  }
}

export async function getProximaAvaliacaoAluno(req: Request, res: Response) {
  const userPerfilId = req.params.userPerfilId;
  try {
    const proxima = await usersService.getProximaAvaliacaoAluno(userPerfilId);
    if (!proxima) {
      return res.status(404).json({ message: "Nenhuma avaliação encontrada." });
    }
    res.json(proxima);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar próxima avaliação." });
  }
}
