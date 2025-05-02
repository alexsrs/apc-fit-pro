import 'dotenv/config'
import { Router } from "express";
import { 
  getUser, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  getUserProfiles,
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
  deleteUserGroup
} from "./controllers/users-controller";

const router = Router();

// Rotas básicas de usuários
router.get("/users", getUser);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Rotas de perfis de usuário
router.get("/users/:id/perfis", getUserProfiles);
router.post("/users/:id/perfis", createUserProfile);
router.put("/users/:id/perfis/:perfilId", updateUserProfile);
router.delete("/users/:id/perfis/:perfilId", deleteUserProfile);

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

export default router;