/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Endpoints de saúde e monitoramento do sistema
 *   - name: Authentication
 *     description: Autenticação e gerenciamento de sessões
 *   - name: Users
 *     description: Gestão de usuários (professores e alunos)
 *   - name: Groups
 *     description: Gestão de grupos de alunos
 *   - name: Avaliações
 *     description: Avaliações físicas e dobras cutâneas
 *   - name: Dobras Cutâneas
 *     description: Sistema especializado de dobras cutâneas
 *   - name: Dashboard
 *     description: Métricas e relatórios para professores
 *   - name: Debug
 *     description: Endpoints de debug (apenas desenvolvimento)
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health Check (Raiz)
 *     description: Verifica se a API está funcionando corretamente - endpoint na raiz para compatibilidade com Azure
 *     tags: [Health]
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
 */

/**
 * @swagger
 * /api/auth/sessions:
 *   post:
 *     summary: Persistir Sessão
 *     description: Endpoint usado pelo NextAuth.js para persistir sessões de usuário
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                 type: string
 *                 description: Token da sessão do NextAuth.js
 *               userId:
 *                 type: string
 *                 description: ID do usuário
 *     responses:
 *       200:
 *         description: Sessão criada/atualizada com sucesso
 *       401:
 *         description: Token inválido
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar Usuários
 *     description: Lista todos os usuários do sistema (apenas para professores)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Token inválido ou ausente
 *       403:
 *         description: Acesso negado (apenas professores)
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obter Usuário por ID
 *     description: Retorna os dados de um usuário específico
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /api/users/{id}/grupos:
 *   get:
 *     summary: Listar Grupos do Professor
 *     description: Lista todos os grupos criados por um professor
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Lista de grupos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Grupo'
 *   post:
 *     summary: Criar Grupo
 *     description: Cria um novo grupo de alunos
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Turma Avançada"
 *               descricao:
 *                 type: string
 *                 example: "Grupo para alunos avançados"
 *             required:
 *               - nome
 *     responses:
 *       201:
 *         description: Grupo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grupo'
 */

/**
 * @swagger
 * /api/users/{id}/alunos:
 *   get:
 *     summary: Listar Alunos do Professor
 *     description: Lista todos os alunos vinculados a um professor
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Lista de alunos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Adicionar Aluno ao Professor
 *     description: Vincula um novo aluno ao professor
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "aluno@email.com"
 *               nome:
 *                 type: string
 *                 example: "João Silva"
 *             required:
 *               - email
 *     responses:
 *       201:
 *         description: Aluno adicionado com sucesso
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /api/users/{id}/grupos/{groupId}:
 *   put:
 *     summary: Atualizar Grupo
 *     description: Atualiza os dados de um grupo específico
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do grupo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Turma Avançada Atualizada"
 *               descricao:
 *                 type: string
 *                 example: "Descrição atualizada do grupo"
 *     responses:
 *       200:
 *         description: Grupo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grupo'
 *   delete:
 *     summary: Excluir Grupo
 *     description: Remove um grupo específico
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do grupo
 *     responses:
 *       200:
 *         description: Grupo removido com sucesso
 *       404:
 *         description: Grupo não encontrado
 */

/**
 * @swagger
 * /api/professores:
 *   get:
 *     summary: Listar Professores
 *     description: Lista todos os professores cadastrados no sistema
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de professores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/dobras-cutaneas/protocolos:
 *   get:
 *     summary: Listar Protocolos Disponíveis
 *     description: Lista todos os protocolos disponíveis para cálculo de dobras cutâneas
 *     tags: [Dobras Cutâneas]
 *     responses:
 *       200:
 *         description: Lista de protocolos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Protocolo'
 */

/**
 * @swagger
 * /api/dobras-cutaneas/calcular:
 *   post:
 *     summary: Calcular Dobras Cutâneas
 *     description: Calcula dobras cutâneas sem salvar no banco (apenas professores)
 *     tags: [Dobras Cutâneas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               protocolo:
 *                 type: string
 *                 enum: [pollock3, pollock7, jackson_pollock_3, jackson_pollock_7]
 *                 example: "pollock7"
 *               dobras:
 *                 type: object
 *                 properties:
 *                   tricipital:
 *                     type: number
 *                     example: 12.5
 *                   subescapular:
 *                     type: number
 *                     example: 15.0
 *                   axilarMedia:
 *                     type: number
 *                     example: 10.5
 *                   suprailiaca:
 *                     type: number
 *                     example: 18.0
 *                   abdominal:
 *                     type: number
 *                     example: 22.0
 *                   coxa:
 *                     type: number
 *                     example: 14.5
 *                 required:
 *                   - tricipital
 *                   - subescapular
 *               dadosPessoais:
 *                 type: object
 *                 properties:
 *                   idade:
 *                     type: integer
 *                     example: 30
 *                   peso:
 *                     type: number
 *                     example: 71.0
 *                   altura:
 *                     type: number
 *                     example: 175
 *                   genero:
 *                     type: string
 *                     enum: [MASCULINO, FEMININO]
 *                     example: "MASCULINO"
 *                 required:
 *                   - idade
 *                   - peso
 *                   - altura
 *                   - genero
 *             required:
 *               - protocolo
 *               - dobras
 *               - dadosPessoais
 *     responses:
 *       200:
 *         description: Cálculo realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 resultados:
 *                   type: object
 *                   properties:
 *                     densidadeCorporal:
 *                       type: number
 *                       example: 1.0456
 *                     percentualGordura:
 *                       type: number
 *                       example: 15.7
 *                     massaGorda:
 *                       type: number
 *                       example: 11.2
 *                     massaMagra:
 *                       type: number
 *                       example: 59.8
 *                     classificacao:
 *                       type: string
 *                       example: "Normal"
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Apenas professores podem acessar
 */

/**
 * @swagger
 * /api/dobras-cutaneas:
 *   post:
 *     summary: Criar Avaliação de Dobras Cutâneas
 *     description: Cria e salva uma nova avaliação de dobras cutâneas (apenas professores)
 *     tags: [Dobras Cutâneas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userPerfilId:
 *                 type: string
 *                 description: ID do perfil do aluno
 *                 example: "clxy123abc456def"
 *               protocolo:
 *                 type: string
 *                 enum: [pollock3, pollock7, jackson_pollock_3, jackson_pollock_7]
 *                 example: "pollock7"
 *               dobras:
 *                 type: object
 *                 description: Medidas das dobras cutâneas
 *               dadosPessoais:
 *                 type: object
 *                 description: Dados pessoais do aluno
 *             required:
 *               - userPerfilId
 *               - protocolo
 *               - dobras
 *               - dadosPessoais
 *     responses:
 *       201:
 *         description: Avaliação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DobrasCutaneas'
 */

/**
 * @swagger
 * /api/dobras-cutaneas/{id}:
 *   get:
 *     summary: Obter Avaliação por ID
 *     description: Retorna uma avaliação específica de dobras cutâneas
 *     tags: [Dobras Cutâneas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da avaliação
 *     responses:
 *       200:
 *         description: Dados da avaliação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DobrasCutaneas'
 *       404:
 *         description: Avaliação não encontrada
 */

/**
 * @swagger
 * /api/dobras-cutaneas/usuario/{userPerfilId}:
 *   get:
 *     summary: Listar Avaliações do Usuário
 *     description: Lista todas as avaliações de dobras cutâneas de um usuário
 *     tags: [Dobras Cutâneas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userPerfilId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do perfil do usuário
 *     responses:
 *       200:
 *         description: Lista de avaliações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DobrasCutaneas'
 */

/**
 * @swagger
 * /api/metrics:
 *   get:
 *     summary: Métricas do Dashboard
 *     description: Retorna métricas consolidadas para o dashboard do professor
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas do dashboard
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardMetrics'
 */

/**
 * @swagger
 * /api/avaliacoes/{userPerfilId}/evolucao-fisica:
 *   get:
 *     summary: Evolução Física do Aluno
 *     description: Retorna dados da evolução física entre avaliações
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userPerfilId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do perfil do aluno
 *     responses:
 *       200:
 *         description: Dados de evolução física
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EvolucaoFisica'
 */

/**
 * @swagger
 * /api/debug/token:
 *   get:
 *     summary: Debug de Token JWT (Desenvolvimento)
 *     description: Endpoint para debug de tokens JWT - apenas em desenvolvimento
 *     tags: [Debug]
 *     responses:
 *       200:
 *         description: Informações do token para debug
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Debug de token disponível apenas em desenvolvimento"
 *                 environment:
 *                   type: string
 *                   example: "development"
 *       404:
 *         description: Endpoint não disponível em produção
 */
