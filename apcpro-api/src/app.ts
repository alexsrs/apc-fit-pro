import express from "express";
import cors from "cors";
import router from "./routes";

function createApp() {
  const app = express();

  const allowedOrigins = [
    "http://localhost:3000",
    "https://apc-fit-pro.vercel.app",
  ];

  // Configuração do CORS
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Não permitido pelo CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
      credentials: true, // Permitir envio de cookies
    })
  );

  app.use(express.json());
  app.use("/api", router);
  return app;
}

export default createApp;
