import "dotenv/config";
import { Router, Request, Response, NextFunction } from "express";

import {
  getUser,
  getUserById,
  getUserStudents,
  addStudentToUser,
  updateUserStudent,
  removeStudentFromUser,
  getUserGroups,
  createUserGroup,
  updateUserGroup,
  deleteUserGroup,
  getUserProfileByUserId,
  postUserProfileByUserId,
  getProfessores,
  getAlunoAvaliacaoValida,
  listarAvaliacoesAluno,
  cadastrarAvaliacaoAluno,
  getProfessorById,
  getProximaAvaliacaoAluno,
  getEvolucaoFisica,
} from "./controllers/users-controller";
import { persistSession } from "./controllers/auth-controller";
import { authenticateUser } from "./middlewares/auth-middleware";

import { avaliarCAController } from "./controllers/avaliarCA-controller";

const router = Router();

// Outras rotas públicas
router.get("/users", authenticateUser, getUser);
router.get("/users/:id", authenticateUser, getUserById);
router.post("/:userId/profile", authenticateUser, postUserProfileByUserId);
router.get("/:userId/profile", authenticateUser, getUserProfileByUserId);
router.get("/professores", getProfessores);
router.get("/professor/:id", authenticateUser, getProfessorById);

// Rotas de grupos
router.get("/users/:id/grupos", authenticateUser, getUserGroups);
router.post("/users/:id/grupos", authenticateUser, createUserGroup);
router.put("/users/:id/grupos/:groupId", authenticateUser, updateUserGroup);
router.delete("/users/:id/grupos/:groupId", authenticateUser, deleteUserGroup);

// Rota para obter alunos de um professor (relacionamentos)
router.get("/users/:id/alunos", authenticateUser, getUserStudents);
router.post("/users/:id/alunos", authenticateUser, addStudentToUser);
router.put("/users/:id/alunos/:alunoId", authenticateUser, updateUserStudent);
router.delete(
  "/users/:id/alunos/:alunoId",
  authenticateUser,
  removeStudentFromUser
);

// Rotas de avaliações
router.get(
  "/alunos/:userPerfilId/avaliacao-valida",
  authenticateUser,
  getAlunoAvaliacaoValida
);
router.get(
  "/alunos/:userPerfilId/avaliacoes",
  authenticateUser,
  listarAvaliacoesAluno
);
router.post(
  "/alunos/:userPerfilId/avaliacoes",
  authenticateUser,
  cadastrarAvaliacaoAluno
);
router.get(
  "/alunos/:userPerfilId/proxima-avaliacao",
  authenticateUser,
  getProximaAvaliacaoAluno
);
router.get(
  "/alunos/:userPerfilId/evolucao-fisica",
  authenticateUser,
  getEvolucaoFisica
);

// Rota para autenticação
router.post("/auth/sessions", persistSession as any);
// Certifique-se de importar ou definir o authMiddleware corretamenteAjuste o caminho conforme necessário

// Função utilitária para tratar controllers assíncronos e capturar erros

router.post("/avaliar-ca", authenticateUser, async (req, res, next) => {
  try {
    await avaliarCAController(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
