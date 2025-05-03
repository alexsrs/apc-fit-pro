import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user-model";

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Extrai o token do cabeçalho Authorization

  if (!token) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || ""); // Verifica o token com a chave secreta
    if (typeof decoded === "object" && decoded !== null) {
        req.user = decoded as User; // Adiciona os dados do usuário decodificado à requisição
    } else {
        res.status(403).json({ error: "Token inválido" });
        return;
    }
    next(); // Continua para a próxima função
  } catch (error) {
    res.status(403).json({ error: "Token inválido" });
  }
};