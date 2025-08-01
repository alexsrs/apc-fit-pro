import express from "express";
import cors from "cors";
import router from "./routes";
import { setupSwagger } from "./swagger";

function createApp() {
  const app = express();

  // Detecta ambiente para configuração de CORS
  const isProduction = process.env.NODE_ENV === "production";
  const isDevelopment = process.env.NODE_ENV === "development";

  console.log(`🌐 Configurando CORS - NODE_ENV: ${process.env.NODE_ENV}`);

  const allowedOrigins = [
    "https://apc-fit-pro.vercel.app", // produção
    "http://localhost:3333", // API local para Swagger
  ];

  // Em desenvolvimento, adiciona localhost
  if (isDevelopment) {
    allowedOrigins.push("http://localhost:3000"); // Frontend dev
    allowedOrigins.push("http://localhost:3333"); // API local para Swagger
  }

  app.use(
    cors({
      origin: function (origin, callback) {
        // Permite requisições sem origin (Postman, curl, Swagger UI, etc.)
        if (!origin) {
          console.log(
            `🌐 CORS: Permitindo requisição sem origin (Postman/curl/Swagger)`
          );
          return callback(null, true);
        }

        // Em desenvolvimento, permite qualquer localhost
        if (isDevelopment && origin.includes("localhost")) {
          console.log(
            `✅ CORS: Permitindo localhost em desenvolvimento: ${origin}`
          );
          return callback(null, true);
        }

        // Em produção, permite apenas origens específicas (mas não localhost externo)
        if (
          isProduction &&
          origin.includes("localhost") &&
          !allowedOrigins.includes(origin)
        ) {
          console.log(`🚫 CORS: Bloqueando localhost em produção: ${origin}`);
          return callback(
            new Error("Localhost não permitido em produção"),
            false
          );
        }

        if (allowedOrigins.includes(origin)) {
          console.log(`✅ CORS: Permitindo origem permitida: ${origin}`);
          callback(null, true);
        } else {
          console.log(`❌ CORS: Negando origem: ${origin}`);
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true, // Para cookies/autenticação
    })
  );

  app.use(express.json());

  // 🩺 Health check na raiz para compatibilidade com Azure/monitoramento
  // Deploy: 28/06/2025 16:19 - Endpoint /health deve estar acessível
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "apcpro-api",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      endpoint: "root-health-check",
    });
  });

  // 📚 Configurar Swagger (documentação da API)
  setupSwagger(app);
  // 🛣️ Configurar rotas da API
  app.use("/api", router);

  return app;
}

export default createApp;
