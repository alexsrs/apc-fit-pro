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
 * /api/health:
 *   get:
 *     summary: 🩺 Health Check da API
 *     description: |
 *       Endpoint para verificar se a API está funcionando.
 *       Retorna informações de status, uptime e uso de memória.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API funcionando normalmente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Tempo de atividade em segundos
 *                 service:
 *                   type: string
 *                   example: "apcpro-api"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 environment:
 *                   type: string
 *                   example: "development"
 *                 database:
 *                   type: string
 *                   example: "connected"
 *                 memory:
 *                   type: object
 *                   properties:
 *                     used:
 *                       type: string
 *                       example: "45 MB"
 *                     total:
 *                       type: string
 *                       example: "128 MB"
 *
 * /api/users:
 *   get:
 *     summary: 👥 Listar usuários autenticados
 *     description: |
 *       Retorna informações do usuário autenticado baseado no token JWT.
 *       Requer autenticação via Bearer token.
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/users/{id}:
 *   get:
 *     summary: 👤 Buscar usuário por ID
 *     description: |
 *       Retorna informações de um usuário específico pelo ID.
 *       Requer autenticação.
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *           example: "clxy123abc456def"
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 *
 * /api/professores:
 *   get:
 *     summary: 🎓 Listar professores
 *     description: |
 *       Retorna lista de todos os professores cadastrados.
 *       Endpoint público - não requer autenticação.
 *     tags:
 *       - Usuários
 *     responses:
 *       200:
 *         description: Lista de professores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 * /api/auth/sessions:
 *   post:
 *     summary: 🔐 Autenticar sessão
 *     description: |
 *       Endpoint para validar e persistir sessões de usuário.
 *       Utilizado pelo NextAuth.js do frontend.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token de sessão
 *               user:
 *                 $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Sessão autenticada com sucesso
 *       401:
 *         description: Falha na autenticação
 */

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
