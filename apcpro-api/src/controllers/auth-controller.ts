import { Request, Response, NextFunction } from "express";
import { authenticateWithGoogle } from "../services/auth-service";
import jwt from "jsonwebtoken";
import { User } from "../models/user-model";
import prisma from "../prisma";

declare global {
  namespace Express {
    interface Request {
      user?: User; // Adicione o tipo correto aqui
    }
  }
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extrai os dados do corpo da requisição
    const { email, name, image } = req.body;

    // Valida os dados recebidos
    if (!email || !name) {
      return res.status(400).json({ message: "Dados insuficientes para autenticação." });
    }

    // Chama o serviço para autenticar com o Google
    const user = await authenticateWithGoogle({ email, name, image });

    // Retorna o usuário autenticado
    return res.status(200).json({ message: "Usuário autenticado com sucesso!", user });
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error);
    next(error); // Passa o erro para o middleware de tratamento de erros
  }
};

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extrai o token do cabeçalho Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token não fornecido ou inválido." });
    }

    const token = authHeader.split(" ")[1];

    // Verifica o token usando a chave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    // Adiciona os dados do token decodificado ao objeto de requisição
    req.user = decoded as User;

    next(); // Continua para o próximo middleware ou rota
  } catch (error) {
    console.error("Erro ao validar token:", error);
    res.status(401).json({ error: "Token inválido ou expirado." });
  }
};

export const getUserProfile = (req: Request, res: Response) => {
  if (!req.user) { // Check if the user property exists
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }

  res.json({ user: req.user });
};

export const persistSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // lógica para persistir sessão
    res.status(200).send({ message: "Sessão persistida com sucesso" });
  } catch (error) {
    next(error);
  }
};