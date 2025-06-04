import "dotenv/config";
import { Router } from "express";

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
} from "./controllers/users-controller";
import { persistSession } from "./controllers/auth-controller";

const router = Router();

// Outras rotas públicas
router.get("/users", getUser);
router.get("/users/:id", getUserById);
router.post("/:userId/profile", postUserProfileByUserId);
router.get("/:userId/profile", getUserProfileByUserId);
router.get("/professores", getProfessores);
router.get("/professores/:id", getProfessorById); // Certifique-se que getProfessorById é uma função (req, res)

// Rotas de grupos
router.get("/users/:id/grupos", getUserGroups);
router.post("/users/:id/grupos", createUserGroup);

// Rota para obetr alunos de um professor (relacionamentos)
router.get("/users/:id/alunos", getUserStudents);

router.post("/users/:id/alunos", addStudentToUser);
router.put("/users/:id/alunos/:alunoId", updateUserStudent);
router.delete("/users/:id/alunos/:alunoId", removeStudentFromUser);

// Rotas de grupos

router.get("/users/:id/grupos", getUserGroups);
router.post("/users/:id/grupos", createUserGroup);
router.put("/users/:id/grupos/:groupId", updateUserGroup);
router.delete("/users/:id/grupos/:groupId", deleteUserGroup);

// Rota para autenticação
//router.post("/auth/google", authenticateUser);
//router.post("/auth/validate", validateToken);
router.post("/auth/sessions", persistSession as any);
// Certifique-se de importar ou definir o authMiddleware corretamenteAjuste o caminho conforme necessário

// Exemplo de rota
router.get("/alunos/:userPerfilId/avaliacao-valida", getAlunoAvaliacaoValida);
router.get("/alunos/:userPerfilId/avaliacoes", listarAvaliacoesAluno);
router.post("/alunos/:userPerfilId/avaliacoes", cadastrarAvaliacaoAluno);

export default router;
