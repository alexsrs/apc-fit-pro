import "dotenv/config";
import { Router } from "express";
import { authenticateToken } from "./middlewares/auth-middleware"; // Ensure this matches the export

import {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getUserStudents,
  addStudentToUser,
  updateUserStudent,
  removeStudentFromUser,
  getUserGroups,
  createUserGroup,
  updateUserGroup,
  deleteUserGroup,
} from "./controllers/users-controller";
import { persistSession } from "./controllers/auth-controller";

const router = Router();

// Rotas protegidas
router.get("/users/:id", getUserById);
router.post("/users/:id/perfis", authenticateToken, createUserProfile);
router.put("/users/:id/perfis/:perfilId", authenticateToken, updateUserProfile);
router.delete(
  "/users/:id/perfis/:perfilId",
  authenticateToken,
  deleteUserProfile
);

// Outras rotas públicas
router.get("/users", getUser);
router.post("/users", createUser);
router.put("/users/:id", authenticateToken, updateUser);
router.delete("/users/:id", authenticateToken, deleteUser);

// Rotas de alunos (relacionamentos)
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

export default router;
