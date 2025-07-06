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
  aprovarAvaliacaoAluno,
  reprovarAvaliacaoAluno,
} from "./controllers/users-controller";
import { persistSession } from "./controllers/auth-controller";
import { authenticateUser } from "./middlewares/auth-middleware";

import { avaliarCAController } from "./controllers/avaliarCA-controller";
import { calcularMedidasController } from "./controllers/avaliacao-controller";
import {
  criarAvaliacaoDobrasCutaneas,
  calcularDobrasCutaneas,
  buscarAvaliacoesPorUsuario,
  buscarAvaliacaoPorId,
  listarProtocolos,
  validarDadosDobrasCutaneas
} from "./controllers/dobras-cutaneas-controller";

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

/**
 * @swagger
 * /api/metrics:
 *   get:
 *     summary: 📊 Métricas do sistema
 *     description: |
 *       Retorna métricas básicas do servidor incluindo uptime, memória e CPU.
 *       Requer autenticação.
 *     tags:
 *       - Sistema
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas do sistema
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Tempo de atividade em segundos
 *                 memory:
 *                   type: object
 *                   description: Uso de memória
 *                 cpu:
 *                   type: object
 *                   description: Uso de CPU
 *                 platform:
 *                   type: string
 *                   example: "win32"
 *                 nodeVersion:
 *                   type: string
 *                   example: "v18.17.0"
 *                 pid:
 *                   type: number
 *                   description: Process ID
 *       401:
 *         description: Não autorizado
 */

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

/**
 * @swagger
 * /api/{userId}/profile:
 *   get:
 *     summary: 👤 Obter perfil do usuário
 *     description: |
 *       Retorna informações do perfil de um usuário específico.
 *       Requer autenticação.
 *     tags:
 *       - Perfil
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *           example: "clxy123abc456def"
 *     responses:
 *       200:
 *         description: Dados do perfil do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "clxy789ghi012jkl"
 *                 userId:
 *                   type: string
 *                   example: "clxy123abc456def"
 *                 telefone:
 *                   type: string
 *                   example: "+55 11 99999-9999"
 *                 dataNascimento:
 *                   type: string
 *                   format: date
 *                   example: "1990-05-15"
 *                 genero:
 *                   type: string
 *                   enum: ["MASCULINO", "FEMININO", "OUTRO"]
 *                   example: "MASCULINO"
 *                 objetivos:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Hipertrofia", "Condicionamento"]
 *                 criadoEm:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Perfil não encontrado
 *   post:
 *     summary: ➕ Criar/Atualizar perfil do usuário
 *     description: |
 *       Cria ou atualiza informações do perfil de um usuário.
 *       Requer autenticação.
 *     tags:
 *       - Perfil
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *           example: "clxy123abc456def"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               telefone:
 *                 type: string
 *                 example: "+55 11 99999-9999"
 *               dataNascimento:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-15"
 *               genero:
 *                 type: string
 *                 enum: ["MASCULINO", "FEMININO", "OUTRO"]
 *                 example: "MASCULINO"
 *               objetivos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Hipertrofia", "Perda de peso"]
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       201:
 *         description: Perfil criado com sucesso
 *       401:
 *         description: Não autorizado
 *       400:
 *         description: Dados inválidos
 *
 * /api/professor/{id}:
 *   get:
 *     summary: 🎓 Buscar professor por ID
 *     description: |
 *       Retorna informações detalhadas de um professor específico.
 *       Requer autenticação.
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do professor
 *         schema:
 *           type: string
 *           example: "clxy123abc456def"
 *     responses:
 *       200:
 *         description: Dados do professor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Professor não encontrado
 *
 * /api/avaliar-ca:
 *   post:
 *     summary: 📏 Avaliação de Circunferências e Adipometria (CA)
 *     description: |
 *       Realiza avaliação de circunferências corporais e adipometria.
 *       Parte do método APC para avaliação física completa.
 *       Requer autenticação.
 *     tags:
 *       - Avaliações Especializadas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alunoId:
 *                 type: string
 *                 description: ID do aluno
 *                 example: "clxy456def789ghi"
 *               circunferencias:
 *                 type: object
 *                 properties:
 *                   braco:
 *                     type: number
 *                     format: float
 *                     example: 35.5
 *                     description: Circunferência do braço em cm
 *                   antebraco:
 *                     type: number
 *                     format: float
 *                     example: 28.0
 *                   tronco:
 *                     type: number
 *                     format: float
 *                     example: 95.0
 *                   cintura:
 *                     type: number
 *                     format: float
 *                     example: 80.0
 *                   quadril:
 *                     type: number
 *                     format: float
 *                     example: 98.0
 *                   coxa:
 *                     type: number
 *                     format: float
 *                     example: 58.0
 *                   panturrilha:
 *                     type: number
 *                     format: float
 *                     example: 38.0
 *               dobras:
 *                 type: object
 *                 properties:
 *                   triceps:
 *                     type: number
 *                     format: float
 *                     example: 12.5
 *                   biceps:
 *                     type: number
 *                     format: float
 *                     example: 8.0
 *                   subescapular:
 *                     type: number
 *                     format: float
 *                     example: 15.0
 *                   suprailiacaAnterior:
 *                     type: number
 *                     format: float
 *                     example: 18.5
 *                   abdominal:
 *                     type: number
 *                     format: float
 *                     example: 20.0
 *                   coxa:
 *                     type: number
 *                     format: float
 *                     example: 16.0
 *                   panturrilhaMedial:
 *                     type: number
 *                     format: float
 *                     example: 10.0
 *               observacoes:
 *                 type: string
 *                 example: "Avaliação realizada em condições ideais"
 *             required:
 *               - alunoId
 *               - circunferencias
 *               - dobras
 *     responses:
 *       200:
 *         description: Avaliação CA realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "clxy789ghi012jkl"
 *                 percentualGordura:
 *                   type: number
 *                   format: float
 *                   example: 15.8
 *                 classificacao:
 *                   type: string
 *                   example: "Excelente"
 *                 relacaoCinturaQuadril:
 *                   type: number
 *                   format: float
 *                   example: 0.82
 *                 imc:
 *                   type: number
 *                   format: float
 *                   example: 23.1
 *                 recomendacoes:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Manter atividade física regular", "Foco em exercícios de força"]
 *                 criadoEm:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Não autorizado
 *       400:
 *         description: Dados inválidos
 */

// Rotas de grupos
router.get("/users/:id/grupos", authenticateUser, getUserGroups);
router.post("/users/:id/grupos", authenticateUser, createUserGroup);
router.put("/users/:id/grupos/:groupId", authenticateUser, updateUserGroup);
router.delete("/users/:id/grupos/:groupId", authenticateUser, deleteUserGroup);

/**
 * @swagger
 * /api/users/{id}/alunos:
 *   get:
 *     summary: 🎓 Listar alunos do professor
 *     description: |
 *       Retorna todos os alunos vinculados a um professor específico.
 *       Requer autenticação.
 *     tags:
 *       - Relacionamentos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do professor
 *         schema:
 *           type: string
 *           example: "clxy123abc456def"
 *     responses:
 *       200:
 *         description: Lista de alunos do professor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Professor não encontrado
 *   post:
 *     summary: ➕ Adicionar aluno ao professor
 *     description: |
 *       Vincula um aluno a um professor específico.
 *       Requer autenticação.
 *     tags:
 *       - Relacionamentos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do professor
 *         schema:
 *           type: string
 *           example: "clxy123abc456def"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alunoId:
 *                 type: string
 *                 description: ID do aluno
 *                 example: "clxy456def789ghi"
 *             required:
 *               - alunoId
 *     responses:
 *       201:
 *         description: Aluno adicionado com sucesso
 *       401:
 *         description: Não autorizado
 *       400:
 *         description: Dados inválidos
 *
 * /api/users/{id}/alunos/{alunoId}:
 *   put:
 *     summary: ✏️ Atualizar relacionamento professor-aluno
 *     description: |
 *       Atualiza informações do relacionamento entre professor e aluno.
 *       Requer autenticação.
 *     tags:
 *       - Relacionamentos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do professor
 *         schema:
 *           type: string
 *           example: "clxy123abc456def"
 *       - name: alunoId
 *         in: path
 *         required: true
 *         description: ID do aluno
 *         schema:
 *           type: string
 *           example: "clxy456def789ghi"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["ATIVO", "INATIVO"]
 *                 example: "ATIVO"
 *               observacoes:
 *                 type: string
 *                 example: "Aluno com boa evolução"
 *     responses:
 *       200:
 *         description: Relacionamento atualizado com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Relacionamento não encontrado
 *   delete:
 *     summary: 🗑️ Remover aluno do professor
 *     description: |
 *       Remove a vinculação entre professor e aluno.
 *       Requer autenticação.
 *     tags:
 *       - Relacionamentos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do professor
 *         schema:
 *           type: string
 *           example: "clxy123abc456def"
 *       - name: alunoId
 *         in: path
 *         required: true
 *         description: ID do aluno
 *         schema:
 *           type: string
 *           example: "clxy456def789ghi"
 *     responses:
 *       200:
 *         description: Aluno removido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Relacionamento não encontrado
 */

// Rota para obter alunos de um professor (relacionamentos)
router.get("/users/:id/alunos", authenticateUser, getUserStudents);
router.post("/users/:id/alunos", authenticateUser, addStudentToUser);
router.put("/users/:id/alunos/:alunoId", authenticateUser, updateUserStudent);
router.delete(
  "/users/:id/alunos/:alunoId",
  authenticateUser,
  removeStudentFromUser
);

/**
 * @swagger
 * /api/alunos/{userPerfilId}/avaliacao-valida:
 *   get:
 *     summary: ✅ Verificar se aluno tem avaliação válida
 *     description: |
 *       Verifica se o aluno possui uma avaliação válida recente.
 *       Requer autenticação.
 *     tags:
 *       - Avaliações
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userPerfilId
 *         in: path
 *         required: true
 *         description: ID do perfil do aluno
 *         schema:
 *           type: string
 *           example: "clxy123abc456def"
 *     responses:
 *       200:
 *         description: Status da avaliação do aluno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 temAvaliacaoValida:
 *                   type: boolean
 *                   example: true
 *                 ultimaAvaliacao:
 *                   $ref: '#/components/schemas/Avaliacao'
 *                 diasDesdeUltimaAvaliacao:
 *                   type: number
 *                   example: 15
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Aluno não encontrado
 *
 * /api/alunos/{userPerfilId}/avaliacoes:
 *   get:
 *     summary: 📊 Listar avaliações do aluno
 *     description: |
 *       Retorna histórico completo de avaliações de um aluno.
 *       Requer autenticação.
 *     tags:
 *       - Avaliações
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userPerfilId
 *         in: path
 *         required: true
 *         description: ID do perfil do aluno
 *         schema:
 *           type: string
 *           example: "clxy123abc456def"
 *     responses:
 *       200:
 *         description: Lista de avaliações do aluno
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Avaliacao'
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Aluno não encontrado
 *   post:
 *     summary: ➕ Cadastrar nova avaliação
 *     description: |
 *       Cria uma nova avaliação física para o aluno.
 *       Requer autenticação.
 *     tags:
 *       - Avaliações
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userPerfilId
 *         in: path
 *         required: true
 *         description: ID do perfil do aluno
 *         schema:
 *           type: string
 *           example: "clxy123abc456def"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               peso:
 *                 type: number
 *                 format: float
 *                 example: 70.5
 *                 description: Peso em kg
 *               altura:
 *                 type: number
 *                 format: float
 *                 example: 1.75
 *                 description: Altura em metros
 *               percentualGordura:
 *                 type: number
 *                 format: float
 *                 example: 15.2
 *               massaMuscular:
 *                 type: number
 *                 format: float
 *                 example: 65.0
 *               observacoes:
 *                 type: string
 *                 example: "Aluno apresentou melhoria significativa"
 *             required:
 *               - peso
 *               - altura
 *     responses:
 *       201:
 *         description: Avaliação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Avaliacao'
 *       401:
 *         description: Não autorizado
 *       400:
 *         description: Dados inválidos
 *
 * /api/alunos/{userPerfilId}/proxima-avaliacao:
 *   get:
 *     summary: 📅 Data da próxima avaliação
 *     description: |
 *       Calcula quando deve ser a próxima avaliação do aluno baseado na última.
 *       Requer autenticação.
 *     tags:
 *       - Avaliações
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userPerfilId
 *         in: path
 *         required: true
 *         description: ID do perfil do aluno
 *         schema:
 *           type: string
 *           example: "clxy123abc456def"
 *     responses:
 *       200:
 *         description: Informações sobre a próxima avaliação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 proximaAvaliacao:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-02-15T10:00:00Z"
 *                 diasRestantes:
 *                   type: number
 *                   example: 30
 *                 status:
 *                   type: string
 *                   enum: ["EM_DIA", "ATRASADA", "PRÓXIMA"]
 *                   example: "EM_DIA"
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Aluno não encontrado
 *
 * /api/alunos/{userPerfilId}/evolucao-fisica:
 *   get:
 *     summary: 📈 Evolução física do aluno
 *     description: |
 *       Analisa a evolução física do aluno comparando avaliações ao longo do tempo.
 *       Requer autenticação.
 *     tags:
 *       - Avaliações
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userPerfilId
 *         in: path
 *         required: true
 *         description: ID do perfil do aluno
 *         schema:
 *           type: string
 *           example: "clxy123abc456def"
 *     responses:
 *       200:
 *         description: Dados de evolução física
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avaliacoes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Avaliacao'
 *                 evolucaoPeso:
 *                   type: object
 *                   properties:
 *                     inicial:
 *                       type: number
 *                       example: 68.0
 *                     atual:
 *                       type: number
 *                       example: 70.5
 *                     variacao:
 *                       type: number
 *                       example: 2.5
 *                 evolucaoIMC:
 *                   type: object
 *                   properties:
 *                     inicial:
 *                       type: number
 *                       example: 22.2
 *                     atual:
 *                       type: number
 *                       example: 23.0
 *                     classificacao:
 *                       type: string
 *                       example: "Normal"
 *                 tendencia:
 *                   type: string
 *                   enum: ["MELHORIA", "ESTÁVEL", "DECLÍNIO"]
 *                   example: "MELHORIA"
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Aluno não encontrado
 */

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

// Rotas para aprovação/reprovação de avaliações
router.patch(
  "/avaliacoes/:avaliacaoId/aprovar",
  authenticateUser,
  aprovarAvaliacaoAluno
);
router.patch(
  "/avaliacoes/:avaliacaoId/reprovar",
  authenticateUser,
  reprovarAvaliacaoAluno
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

// Endpoint para calcular medidas corporais (inclui dobras cutâneas)
router.post("/calcular-medidas", async (req, res, next) => {
  try {
    await calcularMedidasController(req, res, next);
  } catch (error) {
    next(error);
  }
});

// === ROTAS PARA DOBRAS CUTÂNEAS ===

// Listar protocolos disponíveis
router.get("/dobras-cutaneas/protocolos", async (req, res, next) => {
  try {
    await listarProtocolos(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Calcular dobras cutâneas sem salvar
router.post("/dobras-cutaneas/calcular", async (req, res, next) => {
  try {
    await calcularDobrasCutaneas(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Validar dados antes do cálculo
router.post("/dobras-cutaneas/validar", async (req, res, next) => {
  try {
    await validarDadosDobrasCutaneas(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Criar nova avaliação de dobras cutâneas
router.post("/dobras-cutaneas", authenticateUser, async (req, res, next) => {
  try {
    await criarAvaliacaoDobrasCutaneas(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Buscar avaliação específica por ID
router.get("/dobras-cutaneas/:id", authenticateUser, async (req, res, next) => {
  try {
    await buscarAvaliacaoPorId(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Buscar avaliações por usuário
router.get("/dobras-cutaneas/usuario/:userPerfilId", authenticateUser, async (req, res, next) => {
  try {
    await buscarAvaliacoesPorUsuario(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;
