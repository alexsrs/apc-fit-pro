import { Request, Response, NextFunction } from "express";
import { UsersService } from "../services/users-service";
import {
  ok,
  created,
  noContent,
  notFound,
  badRequest,
  internalError,
} from "../utils/http-helper";

const usersService = new UsersService();

// Usuários
export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await usersService.getAllUsers();
    const response = ok(users);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.params.id;
    const user = await usersService.findUserById(userId);
    if (user === null || user === undefined) {
      const response = notFound("Usuário não encontrado");
      res.status(response.statusCode).json(response.body);
      return;
    }
    const response = ok(user);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
}
// Novo endpoint para buscar perfil do usuário por userId
export const getUserProfileByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId; // Obtém o ID do usuário da rota

    // Lógica para buscar o perfil do usuário
    const userProfile = await usersService.getUserProfile(userId);

    if (!userProfile) {
      const response = notFound("Perfil não encontrado");
      res.status(response.statusCode).json(response.body);
      return;
    }

    const response = ok(userProfile);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

export const postUserProfileByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const profileData = await usersService.createUserProfile(userId, req.body);
    const response = created(profileData);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

// Alunos relacionados
export async function getUserStudents(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.id;
    const students = await usersService.getUserStudents(userId);
    const response = ok(students);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
}

export async function addStudentToUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.id;
    const student = await usersService.addStudentToUser(userId, req.body);
    const response = created(student);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
}

export async function updateUserStudent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.id;
    const studentId = req.params.alunoId;
    const student = await usersService.updateUserStudent(
      userId,
      studentId,
      req.body
    );
    const response = ok(student);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
}

export async function removeStudentFromUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.id;
    const studentId = req.params.alunoId;
    await usersService.removeStudentFromUser(userId, studentId);
    const response = noContent();
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
}

// Grupos
export async function getUserGroups(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.id;
    const groups = await usersService.getUserGroups(userId);
    const response = ok(groups);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
}

export async function createUserGroup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.id;
    const group = await usersService.createUserGroup(userId, req.body);
    const response = created(group);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
}

export async function updateUserGroup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.id;
    const groupId = req.params.groupId;
    const group = await usersService.updateUserGroup(userId, groupId, req.body);
    const response = ok(group);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
}

export async function deleteUserGroup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.id;
    const groupId = req.params.groupId;
    await usersService.deleteUserGroup(userId, groupId);
    const response = noContent();
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
}

export async function getProfessores(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const professores = await usersService.getUsersByRole("professor");
    const response = ok(professores);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
}

export async function getProfessorById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const professor = await usersService.getProfessorById(id);
    const response = ok(professor);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
}

export async function getAlunoAvaliacaoValida(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userPerfilId = req.params.userPerfilId;
    const possuiValida = await usersService.alunoPossuiAvaliacaoValida(
      userPerfilId
    );
    const response = ok({ possuiAvaliacaoValida: possuiValida });
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
}

export async function listarAvaliacoesAluno(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userPerfilId = req.params.userPerfilId;
    const avaliacoes = await usersService.listarAvaliacoesAluno(userPerfilId);
    const response = ok(avaliacoes);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
}

export async function cadastrarAvaliacaoAluno(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userPerfilId = req.params.userPerfilId;
    const dados = req.body;
    
    // Se for um professor salvando, pode incluir validade
    const avaliacao = await usersService.cadastrarAvaliacaoAluno(
      userPerfilId,
      dados
    );
    const response = created(avaliacao);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
}

export async function aprovarAvaliacaoAluno(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Busca o avaliacaoId tanto em params.avaliacaoId quanto em params.id
    const avaliacaoId = req.params.avaliacaoId || req.params.id;
    const { diasValidade = 90, validadeDias = 90 } = req.body; // aceita ambos os nomes
    
    if (!avaliacaoId) {
      return res.status(400).json({
        erro: "ID da avaliação não fornecido",
        message: "avaliacaoId é obrigatório"
      });
    }
    
    const validadeFinal = diasValidade || validadeDias;
    const avaliacao = await usersService.aprovarAvaliacao(avaliacaoId, validadeFinal);
    const response = ok(avaliacao);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
}

export async function reprovarAvaliacaoAluno(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Busca o avaliacaoId tanto em params.avaliacaoId quanto em params.id
    const avaliacaoId = req.params.avaliacaoId || req.params.id;
    const { motivo } = req.body; // Motivo da reprovação (opcional)
    
    if (!avaliacaoId) {
      return res.status(400).json({
        erro: "ID da avaliação não fornecido", 
        message: "avaliacaoId é obrigatório"
      });
    }
    
    const avaliacao = await usersService.reprovarAvaliacao(avaliacaoId, motivo);
    const response = ok(avaliacao);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
}

export async function getProximaAvaliacaoAluno(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userPerfilId = req.params.userPerfilId;
    const proxima = await usersService.getProximaAvaliacaoAluno(userPerfilId);
    if (!proxima) {
      const response = notFound("Nenhuma avaliação encontrada.");
      res.status(response.statusCode).json(response.body);
      return;
    }
    const response = ok(proxima);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
}

export async function getEvolucaoFisica(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userPerfilId = req.params.userPerfilId;
    const evolucao = await usersService.getEvolucaoFisica(userPerfilId);
    if (!evolucao) {
      const response = notFound(
        "Não há avaliações suficientes para comparação."
      );
      res.status(response.statusCode).json(response.body);
      return;
    }
    const response = ok(evolucao);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
}
