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
      version: "1.0.0",
      description: `
        API para avaliação, prescrição e controle de treinos físicos baseada no método APC.
        
        ## ⚠️ IMPORTANTE - Configuração de Servidores
        
        **Para desenvolvimento local**: Use SEMPRE o servidor "Servidor Local" (localhost:3333)
        
        **Para testar produção**: Use o frontend em https://apc-fit-pro.vercel.app
        
        Os servidores Azure NÃO aceitam requisições de localhost por motivos de segurança (CORS).
        
        ## Funcionalidades
        - 🔐 Autenticação com Google OAuth
        - 👥 Gestão de usuários (professores e alunos)
        - 📊 Avaliações físicas completas
        - 📈 Controle de treinos
        - 🎯 Prescrições personalizadas
        
        ## Método APC
        O sistema utiliza o método APC (Avaliação, Prescrição e Controle) desenvolvido 
        para otimizar resultados em atividade física através de:
        - Avaliação inicial completa
        - Prescrição individualizada
        - Controle contínuo de resultados
      `,
      contact: {
        name: "Suporte APC FIT PRO",
        email: "alexsrsouza@hotmail.com",
      },
      license: {
        name: "Proprietário",
        url: "https://apc-fit-pro.vercel.app/termos",
      },
    },
    servers: [
      {
        url: "http://localhost:3333/api",
        description: "🚀 Servidor Local (DESENVOLVIMENTO) - Use este para testes locais",
      },
      {
        url: "https://apcpro-api-gafxbdcud6a7f2gd.centralus-01.azurewebsites.net/api",
        description: "🌐 Produção (Azure) - Acesse via navegador ou frontend",
      },
      {
        url: "https://apcpro-api-dev.azurewebsites.net/api",
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
            criadoEm: {
              type: "string",
              format: "date-time",
              description: "Data de criação do usuário",
              example: "2024-01-15T10:30:00Z",
            },
          },
          required: ["id", "email", "nome", "accountType"],
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
    "./dist/routes.js", // Adiciona suporte para arquivos compilados
    "./dist/controllers/*.js"
  ], // Caminhos para arquivos com anotações JSDoc
};

const specs = swaggerJsdoc(swaggerOptions);

// Detecta se está rodando no Azure
const isAzure = process.env.WEBSITE_SITE_NAME || process.env.APPSETTING_WEBSITE_SITE_NAME;

/**
 * Configurações customizadas do Swagger UI
 */
const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #1976d2; }
    .swagger-ui .scheme-container { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
  `,
  customSiteTitle: "APC FIT PRO API Documentation",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    docExpansion: "list",
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 2,
    deepLinking: true,
    displayOperationId: false,
    tryItOutEnabled: true,
  },
};

// Adiciona banner contextual baseado no ambiente
if (isAzure) {
  swaggerUiOptions.customCss += `
    .swagger-ui .info:before {
      content: "🌐 PRODUÇÃO AZURE - Use este Swagger para testar APIs de produção";
      display: block;
      background: #e3f2fd;
      color: #1976d2;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
      font-weight: bold;
      border-left: 4px solid #1976d2;
    }
  `;
} else {
  swaggerUiOptions.customCss += `
    .swagger-ui .info:before {
      content: "🚀 DESENVOLVIMENTO LOCAL - Para obter tokens JWT, use o frontend em localhost:3000";
      display: block;
      background: #f3e5f5;
      color: #7b1fa2;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
      font-weight: bold;
      border-left: 4px solid #7b1fa2;
    }
  `;
}

/**
 * Configuração do Swagger na aplicação Express
 */
export function setupSwagger(app: Application): void {
  try {
    // Logs para debugging
    console.log(`📚 Configurando Swagger UI...`);
    console.log(`🌍 Ambiente: ${isAzure ? "Azure" : "Local"}`);
    
    // Serve a documentação JSON
    app.get("/api/docs.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(specs);
    });

    // Serve a interface do Swagger UI
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));

    console.log(`✅ Swagger UI configurado com sucesso!`);
    console.log(`📖 Documentação disponível em: /api/docs`);
    console.log(`📄 Spec JSON disponível em: /api/docs.json`);
  } catch (error) {
    console.error("❌ Erro ao configurar Swagger:", error);
  }
}

export { specs };
