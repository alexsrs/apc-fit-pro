import express from "express";
import cors from "cors";
import router from "./routes";
import { setupSwagger } from "./swagger";

function createApp() {
  const app = express();

  const allowedOrigins = [
    "https://apc-fit-pro.vercel.app", // produção
    "http://localhost:3000", // dev local
    "http://localhost:3333", // API local para Swagger
  ];

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true, // se usar cookies/autenticação
    })
  );

  app.use(express.json());

  // Configurar Swagger
  setupSwagger(app);

  app.use("/api", router);
  return app;
}

export default createApp;
