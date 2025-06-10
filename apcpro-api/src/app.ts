import express from "express";
import cors from "cors";
import router from "./routes";

function createApp() {
  const app = express();

  const allowedOrigins = [
    "https://apc-fit-pro.vercel.app", // produção
    "http://localhost:3000", // dev local
  ];

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true, // se usar cookies/autenticação
    })
  );

  app.use(express.json());
  app.use("/api", router);
  return app;
}

export default createApp;
