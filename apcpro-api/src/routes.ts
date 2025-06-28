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

// 🩺 Health Check endpoint - deve estar sempre disponível
router.get("/health", (req: Request, res: Response) => {
  const healthCheck = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: "apcpro-api",
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    database: "connected", // TODO: implementar check real do banco
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + " MB",
    },
  };

  res.status(200).json(healthCheck);
});

// 📊 Endpoint de métricas básicas (protegido)
router.get("/metrics", authenticateUser, (req: Request, res: Response) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    platform: process.platform,
    nodeVersion: process.version,
    pid: process.pid,
  };

  res.status(200).json(metrics);
});

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
