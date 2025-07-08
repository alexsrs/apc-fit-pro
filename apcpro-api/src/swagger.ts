import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

/**
 * Configuração do Swagger para documentação da API
 * Utiliza swagger-jsdoc para gerar specs a partir de comentários JSDoc
 * e swagger-ui-express para servir a interface web
 */

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "APC FIT PRO API",
      version: "2.0.0",
      description: `
        API para avaliação, prescrição e controle de treinos físicos baseada no método APC.
        
        ## ⚠️ IMPORTANTE - Configuração de Servidores
        
        **Para desenvolvimento local**: Use SEMPRE o servidor "Servidor Local" (localhost:3333)
        
        **Para testar produção**: Use o frontend em https://apc-fit-pro.vercel.app
        
        Os servidores Azure NÃO aceitam requisições de localhost por motivos de segurança (CORS).
                
        ## 🔑 Autenticação
        Todas as rotas protegidas requerem token JWT obtido via NextAuth.js.
        Para obter um token válido, faça login no frontend e copie o header Authorization.
      `,
      contact: {
        name: "Suporte APC FIT PRO",
        email: "alexsrsouza@hotmail.com",
        url: "https://apc-fit-pro.vercel.app/contato",
      },
      license: {
        name: "Proprietário - APC FIT PRO",
        url: "https://apc-fit-pro.vercel.app/termos",
      },
      externalDocs: {
        description: "Documentação adicional no GitHub",
        url: "https://github.com/seu-usuario/apc-fit-pro/blob/main/README.md",
      },
    },
    servers: [
      {
        url: "http://localhost:3333",
        description:
          "🚀 Servidor Local (DESENVOLVIMENTO) - Use este para testes locais",
      },
      {
        url: "https://apcpro-api-gafxbdcud6a7f2gd.centralus-01.azurewebsites.net",
        description: "🌐 Produção (Azure) - Acesse via navegador ou frontend",
      },
      {
        url: "https://apcpro-api-dev.azurewebsites.net",
        description: "🧪 Desenvolvimento (Azure) - Ambiente de testes",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: `
            Autenticação JWT usando NextAuth.js do frontend.
            
            **Como obter o token:**
            1. Faça login no frontend (localhost:3000)
            2. Abra DevTools → Network
            3. Encontre uma requisição para API
            4. Copie o valor do header "Authorization: Bearer TOKEN"
            5. Cole apenas o TOKEN aqui (sem "Bearer ")
            
            **Para debug**: GET /api/debug/token (apenas desenvolvimento)
          `,
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID único do usuário",
              example: "clxy123abc456def",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email do usuário",
              example: "usuario@exemplo.com",
            },
            nome: {
              type: "string",
              description: "Nome completo do usuário",
              example: "João Silva",
            },
            accountType: {
              type: "string",
              enum: ["PROFESSOR", "ALUNO"],
              description: "Tipo de conta do usuário",
              example: "PROFESSOR",
            },
            image: {
              type: "string",
              description: "URL da imagem do perfil",
              example: "https://lh3.googleusercontent.com/...",
            },
            telefone: {
              type: "string",
              description: "Telefone do usuário",
              example: "(11) 99999-9999",
            },
            genero: {
              type: "string",
              enum: ["MASCULINO", "FEMININO"],
              description: "Gênero do usuário",
              example: "MASCULINO",
            },
            dataNascimento: {
              type: "string",
              format: "date",
              description: "Data de nascimento",
              example: "1990-05-15",
            },
            criadoEm: {
              type: "string",
              format: "date-time",
              description: "Data de criação do usuário",
              example: "2024-01-15T10:30:00Z",
            },
          },
          required: ["id", "email", "nome", "accountType"],
        },
        Grupo: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID único do grupo",
              example: "clxy789ghi012jkl",
            },
            nome: {
              type: "string",
              description: "Nome do grupo",
              example: "Turma Iniciantes",
            },
            descricao: {
              type: "string",
              description: "Descrição do grupo",
              example: "Grupo para alunos iniciantes",
            },
            professorId: {
              type: "string",
              description: "ID do professor responsável",
              example: "clxy456def789ghi",
            },
            criadoEm: {
              type: "string",
              format: "date-time",
              description: "Data de criação do grupo",
              example: "2024-01-15T10:30:00Z",
            },
            alunos: {
              type: "array",
              description: "Lista de alunos do grupo",
              items: {
                $ref: "#/components/schemas/User",
              },
            },
          },
          required: ["id", "nome", "professorId"],
        },
        DobrasCutaneas: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID único da avaliação de dobras cutâneas",
              example: "clxy789ghi012jkl",
            },
            userPerfilId: {
              type: "string",
              description: "ID do perfil do usuário avaliado",
              example: "clxy123abc456def",
            },
            professorId: {
              type: "string",
              description: "ID do professor que realizou a avaliação",
              example: "clxy456def789ghi",
            },
            protocolo: {
              type: "string",
              enum: ["pollock3", "pollock7", "jackson_pollock_3", "jackson_pollock_7"],
              description: "Protocolo utilizado para o cálculo",
              example: "pollock7",
            },
            dobras: {
              type: "object",
              description: "Medidas das dobras cutâneas em mm",
              properties: {
                tricipital: { type: "number", example: 12.5 },
                subescapular: { type: "number", example: 15.0 },
                bicipital: { type: "number", example: 8.0 },
                axilarMedia: { type: "number", example: 10.5 },
                suprailiaca: { type: "number", example: 18.0 },
                abdominal: { type: "number", example: 22.0 },
                coxa: { type: "number", example: 14.5 },
              },
            },
            resultados: {
              type: "object",
              description: "Resultados dos cálculos",
              properties: {
                densidadeCorporal: { type: "number", example: 1.0456 },
                percentualGordura: { type: "number", example: 15.7 },
                massaGorda: { type: "number", example: 11.2 },
                massaMagra: { type: "number", example: 59.8 },
                classificacao: { type: "string", example: "Normal" },
              },
            },
            dadosPessoais: {
              type: "object",
              description: "Dados pessoais no momento da avaliação",
              properties: {
                idade: { type: "integer", example: 30 },
                peso: { type: "number", example: 71.0 },
                altura: { type: "number", example: 175 },
                genero: { type: "string", example: "MASCULINO" },
              },
            },
            status: {
              type: "string",
              enum: ["pendente", "aprovada", "reprovada"],
              description: "Status da avaliação",
              example: "aprovada",
            },
            criadoEm: {
              type: "string",
              format: "date-time",
              description: "Data da avaliação",
              example: "2024-01-15T10:30:00Z",
            },
          },
          required: ["id", "userPerfilId", "professorId", "protocolo", "dobras"],
        },
        Protocolo: {
          type: "object",
          description: "Protocolo disponível para cálculo de dobras cutâneas",
          properties: {
            id: {
              type: "string",
              example: "pollock7",
            },
            nome: {
              type: "string",
              example: "Pollock 7 dobras",
            },
            descricao: {
              type: "string",
              example: "Protocolo de Pollock utilizando 7 medidas de dobras cutâneas",
            },
            dobrasNecessarias: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["tricipital", "subescapular", "axilarMedia", "suprailiaca", "abdominal", "coxa"],
            },
            generoAplicavel: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["MASCULINO", "FEMININO"],
            },
          },
          required: ["id", "nome", "dobrasNecessarias"],
        },
        EvolucaoFisica: {
          type: "object",
          description: "Dados da evolução física do aluno",
          properties: {
            userId: {
              type: "string",
              description: "ID do usuário",
              example: "clxy123abc456def",
            },
            avaliacoes: {
              type: "array",
              description: "Lista de avaliações do usuário",
              items: {
                $ref: "#/components/schemas/DobrasCutaneas",
              },
            },
            evolucao: {
              type: "object",
              description: "Dados de evolução entre avaliações",
              properties: {
                peso: {
                  type: "object",
                  properties: {
                    inicial: { type: "number", example: 75.0 },
                    atual: { type: "number", example: 71.0 },
                    diferenca: { type: "number", example: -4.0 },
                    percentual: { type: "number", example: -5.3 },
                  },
                },
                percentualGordura: {
                  type: "object",
                  properties: {
                    inicial: { type: "number", example: 18.5 },
                    atual: { type: "number", example: 15.7 },
                    diferenca: { type: "number", example: -2.8 },
                    percentual: { type: "number", example: -15.1 },
                  },
                },
                massaMagra: {
                  type: "object",
                  properties: {
                    inicial: { type: "number", example: 57.2 },
                    atual: { type: "number", example: 59.8 },
                    diferenca: { type: "number", example: 2.6 },
                    percentual: { type: "number", example: 4.5 },
                  },
                },
              },
            },
            periodoAvaliacao: {
              type: "object",
              properties: {
                dataInicial: {
                  type: "string",
                  format: "date-time",
                  example: "2024-01-15T10:30:00Z",
                },
                dataFinal: {
                  type: "string",
                  format: "date-time",
                  example: "2024-03-15T10:30:00Z",
                },
                dias: { type: "integer", example: 60 },
              },
            },
          },
          required: ["userId", "avaliacoes"],
        },
        DashboardMetrics: {
          type: "object",
          description: "Métricas do dashboard para professores",
          properties: {
            totalAlunos: {
              type: "integer",
              description: "Total de alunos cadastrados",
              example: 45,
            },
            alunosAtivos: {
              type: "integer",
              description: "Alunos com atividade recente",
              example: 38,
            },
            novosAlunos: {
              type: "integer",
              description: "Novos alunos este mês",
              example: 12,
            },
            avaliacoesPendentes: {
              type: "integer",
              description: "Avaliações aguardando aprovação",
              example: 5,
            },
            treinosConcluidos: {
              type: "integer",
              description: "Treinos concluídos no período",
              example: 139,
            },
            gruposAtivos: {
              type: "integer",
              description: "Grupos de alunos ativos",
              example: 8,
            },
            tendencias: {
              type: "object",
              description: "Tendências de crescimento",
              properties: {
                alunos: {
                  type: "object",
                  properties: {
                    percentual: { type: "number", example: 5.0 },
                    periodo: { type: "string", example: "mês passado" },
                  },
                },
                retencao: {
                  type: "object",
                  properties: {
                    percentual: { type: "number", example: 84.0 },
                    status: { type: "string", example: "alta" },
                  },
                },
              },
            },
          },
          required: ["totalAlunos", "alunosAtivos", "avaliacoesPendentes"],
        },
        Avaliacao: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID único da avaliação",
              example: "clxy789ghi012jkl",
            },
            alunoId: {
              type: "string",
              description: "ID do aluno avaliado",
              example: "clxy123abc456def",
            },
            professorId: {
              type: "string",
              description: "ID do professor responsável",
              example: "clxy456def789ghi",
            },
            peso: {
              type: "number",
              format: "float",
              description: "Peso em kg",
              example: 70.5,
            },
            altura: {
              type: "number",
              format: "float",
              description: "Altura em metros",
              example: 1.75,
            },
            criadoEm: {
              type: "string",
              format: "date-time",
              description: "Data da avaliação",
              example: "2024-01-15T10:30:00Z",
            },
          },
          required: ["id", "alunoId", "professorId", "peso", "altura"],
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Mensagem de erro",
              example: "Token inválido ou expirado",
            },
            details: {
              type: "string",
              description: "Detalhes adicionais do erro",
              example: "JWT malformed",
            },
          },
          required: ["error"],
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Indica se a operação foi bem-sucedida",
              example: true,
            },
            data: {
              description: "Dados da resposta",
            },
            message: {
              type: "string",
              description: "Mensagem de sucesso",
              example: "Operação realizada com sucesso",
            },
          },
          required: ["success"],
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/routes.ts",
    "./src/controllers/*.ts",
    "./src/swagger-docs.ts", // Documentação dos endpoints
    "./dist/routes.js", // Adiciona suporte para arquivos compilados
    "./dist/controllers/*.js",
    "./dist/swagger-docs.js", // Documentação compilada
  ], // Caminhos para arquivos com anotações JSDoc
};

const specs = swaggerJsdoc(swaggerOptions);

// Detecta se está rodando no Azure
const isAzure =
  process.env.WEBSITE_SITE_NAME || process.env.APPSETTING_WEBSITE_SITE_NAME;

/**
 * Configurações customizadas do Swagger UI
 */
const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #1976d2; font-size: 2rem; }
    .swagger-ui .info .description { font-size: 1.1rem; line-height: 1.6; }
    .swagger-ui .scheme-container { 
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); 
      padding: 20px; 
      border-radius: 8px; 
      margin: 20px 0; 
      border: 1px solid #e0e6ed;
    }
    .swagger-ui .opblock { border-radius: 8px; margin-bottom: 15px; }
    .swagger-ui .opblock.opblock-get { border-color: #61affe; }
    .swagger-ui .opblock.opblock-post { border-color: #49cc90; }
    .swagger-ui .opblock.opblock-put { border-color: #fca130; }
    .swagger-ui .opblock.opblock-delete { border-color: #f93e3e; }
    .swagger-ui .opblock-tag { font-size: 1.2rem; margin: 20px 0; }
    .swagger-ui .response-col_status { min-width: 100px; }
    .swagger-ui .response-col_description { font-weight: 500; }
  `,
  customSiteTitle: "APC FIT PRO API Documentation v2.0",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    docExpansion: "list",
    defaultModelsExpandDepth: 3,
    defaultModelExpandDepth: 3,
    deepLinking: true,
    displayOperationId: false,
    tryItOutEnabled: true,
    tagsSorter: "alpha",
    operationsSorter: "alpha",
    requestSnippetsEnabled: true,
    requestSnippets: {
      generators: {
        "curl_bash": {
          title: "cURL (bash)",
          syntax: "bash",
        },
        "javascript_fetch": {
          title: "JavaScript (fetch)",
          syntax: "javascript",
        },
      },
      defaultExpanded: false,
      languages: ["curl_bash", "javascript_fetch"],
    },
  },
};

// Adiciona banner contextual baseado no ambiente
if (isAzure) {
  swaggerUiOptions.customCss += `
    .swagger-ui .info:before {
      content: "🌐 PRODUÇÃO AZURE - Esta é a API de produção. Use apenas para testes finais e integração. Para desenvolvimento, use localhost:3333";
      display: block;
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      color: #1976d2;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
      font-weight: 600;
      border-left: 5px solid #1976d2;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `;
} else {
  swaggerUiOptions.customCss += `
    .swagger-ui .info:before {
      content: "🚀 DESENVOLVIMENTO LOCAL - Para obter tokens JWT válidos: 1) Faça login no frontend (localhost:3000), 2) Abra DevTools → Network, 3) Copie o token de qualquer requisição à API, 4) Cole no botão 'Authorize' acima";
      display: block;
      background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
      color: #7b1fa2;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
      font-weight: 600;
      border-left: 5px solid #7b1fa2;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `;
}

/**
 * Configuração do Swagger na aplicação Express
 */
export function setupSwagger(app: Application): void {
  try {
    // Logs para debugging
    console.log(`📚 Configurando Swagger UI v2.0...`);
    console.log(`🌍 Ambiente: ${isAzure ? "Azure" : "Local"}`);
    console.log(`📊 Schemas: User, Grupo, DobrasCutaneas, Protocolo, EvolucaoFisica, DashboardMetrics`);
    console.log(`🔗 Endpoints documentados: ${process.env.NODE_ENV === 'development' ? '40+' : '35+'} endpoints`);

    // Serve a documentação JSON
    app.get("/api/docs.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(specs);
    });

    // Serve a interface do Swagger UI
    app.use(
      "/api/docs",
      swaggerUi.serve,
      swaggerUi.setup(specs, swaggerUiOptions)
    );

    console.log(`✅ Swagger UI v2.0 configurado com sucesso!`);
    console.log(`📖 Documentação disponível em: /api/docs`);
    console.log(`📄 Spec JSON disponível em: /api/docs.json`);
    console.log(`🚀 Funcionalidades documentadas:`);
    console.log(`   • Autenticação JWT via NextAuth.js`);
    console.log(`   • Gestão de usuários e grupos`);
    console.log(`   • Sistema completo de dobras cutâneas`);
    console.log(`   • Métricas de dashboard`);
    console.log(`   • Avaliações físicas e evolução`);
    
    if (!isAzure) {
      console.log(`💡 Para obter token JWT:`);
      console.log(`   1. Acesse localhost:3000 e faça login`);
      console.log(`   2. Abra DevTools → Network`);
      console.log(`   3. Copie o header Authorization de qualquer requisição`);
      console.log(`   4. Use no botão 'Authorize' do Swagger`);
    }
  } catch (error) {
    console.error("❌ Erro ao configurar Swagger:", error);
    console.error("📄 Verifique se todos os arquivos de documentação estão presentes");
  }
}

export { specs };
