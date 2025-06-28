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
    "https://apc-fit-pro.vercel.app", // Frontend produção
  ];

  // Em desenvolvimento, adiciona localhost
  if (isDevelopment) {
    allowedOrigins.push("http://localhost:3000"); // Frontend dev
    allowedOrigins.push("http://localhost:3333"); // API local para Swagger
  }

  app.use(
    cors({
      origin: function (origin, callback) {
        // Permite requisições sem origin (Postman, curl, etc.)
        if (!origin) {
          console.log(
            `🌐 CORS: Permitindo requisição sem origin (Postman/curl)`
          );
          return callback(null, true);
        }

        // Em produção, bloqueia localhost por segurança
        if (isProduction && origin.includes("localhost")) {
          console.log(`🚫 CORS: Bloqueando localhost em produção: ${origin}`);
          return callback(
            new Error("Localhost não permitido em produção"),
            false
          );
        }

        if (allowedOrigins.includes(origin)) {
          console.log(`✅ CORS: Permitindo origem: ${origin}`);
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

  // 📚 Configurar Swagger (documentação da API)
  setupSwagger(app);

  // 🛣️ Configurar rotas da API
  app.use("/api", router);

  return app;
}

export default createApp;
