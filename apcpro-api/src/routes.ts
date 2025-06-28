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

// 🚀 Deploy Test - CI/CD Pipeline Trigger
// Este comentário serve para triggerar o deploy automático

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

/**
 * @swagger
 * /api/debug/token:
 *   get:
 *     summary: 🔍 Debug - Extrair token JWT do header Authorization
 *     description: |
 *       Endpoint para debugging que extrai e retorna o token JWT enviado no header Authorization.
 *       **APENAS PARA DESENVOLVIMENTO** - não disponível em produção.
 *
 *       ### Como usar:
 *       1. Obtenha um token válido do frontend (localhost:3000)
 *       2. Faça uma requisição com o header: `Authorization: Bearer SEU_TOKEN`
 *       3. Este endpoint retornará o token limpo para usar no Swagger
 *     tags:
 *       - Debug
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token extraído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT limpo (sem "Bearer ")
 *                   example: "jwt.header.payload.signature"
 *                 message:
 *                   type: string
 *                   example: "✅ Token encontrado no header Authorization"
 *                 instructions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["1. Copie o token acima", "2. Use no Swagger Authorize"]
 *       404:
 *         description: Endpoint não disponível em produção
 *       401:
 *         description: Token não encontrado
 */
// 🔍 Endpoint de debug para facilitar obtenção de tokens JWT
router.get("/debug/token", (req: Request, res: Response): void => {
  // Apenas disponível em desenvolvimento
  if (process.env.NODE_ENV !== "development") {
    res.status(404).json({ message: "Not found" });
    return;
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "").trim();

  if (!token || !authHeader) {
    res.status(401).json({
      message: "❌ Nenhum token encontrado",
      help: [
        "1. Faça login no frontend (localhost:3000)",
        "2. Copie o header Authorization de qualquer requisição para API",
        "3. Envie novamente com o header correto",
      ],
      headers: req.headers,
    });
    return;
  }

  res.json({
    token: token,
    message: "✅ Token encontrado no header Authorization",
    instructions: [
      "1. Copie o token acima (sem aspas)",
      "2. Vá para http://localhost:3333/api/docs",
      "3. Clique em 'Authorize' 🔒",
      "4. Cole o token no campo 'Bearer'",
      "5. Clique 'Authorize'",
      "6. Teste endpoints protegidos como GET /users",
    ],
  });
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
