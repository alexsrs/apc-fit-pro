import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user-model";
import prisma from "../prisma";

/**
 * Middleware de autenticação JWT para rotas protegidas.
 * Aceita apenas tokens JWT assinados (HS256) emitidos pelo NextAuth.
 */
export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    console.log(
      "[auth-middleware][DEBUG] Middleware executado para:",
      req.method,
      req.originalUrl
    );
    console.log("[auth-middleware][DEBUG] Headers recebidos:", req.headers);
  }
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error(
      "[auth-middleware] Header Authorization ausente ou malformado."
    );
    res.status(401).json({ error: "Token JWT ausente ou malformado." });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (process.env.NODE_ENV !== "production") {
    console.log("[auth-middleware][DEBUG] Token recebido (completo):", token);
  }
  if (!token) {
    console.error("[auth-middleware] Token JWT não encontrado no header.");
    res.status(401).json({ error: "Token JWT não encontrado." });
    return;
  }

  const jwtSecret = process.env.NEXTAUTH_SECRET;
  if (!jwtSecret) {
    console.error(
      "[auth-middleware] NEXTAUTH_SECRET não definido nas variáveis de ambiente."
    );
    res.sendStatus(500);
    return;
  }
  try {
    // Aceita apenas JWT assinado (3 partes)
    if (token.split(".").length !== 3) {
      res.status(401).json({
        error: "Token inválido: apenas JWT assinado (HS256) é aceito.",
      });
      return;
    }
    const payload = jwt.verify(token, jwtSecret, { algorithms: ["HS256"] });
    if (typeof payload === "object" && payload !== null) {
      req.user = payload as User;
      return next();
    } else {
      res.status(403).json({ error: "Payload do JWT inválido." });
      return;
    }
  } catch (err: any) {
    console.error("[auth-middleware] Erro ao verificar JWT:", err);
    res.status(401).json({
      error: "Token JWT inválido ou expirado.",
      details: process.env.NODE_ENV !== "production" ? err.message : undefined,
    });
    return;
  }
}

/**
 * Middleware para verificar se o usuário é professor
 * Deve ser usado após authenticateUser
 */
export async function requireProfessor(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        error: "Usuário não autenticado",
        message: "É necessário estar logado para acessar esta funcionalidade",
      });
      return;
    }

    // Buscar o perfil do usuário para verificar o role
    const userProfile = await prisma.userPerfil.findFirst({
      where: { userId: req.user.id },
    });

    if (!userProfile || userProfile.role !== "professor") {
      res.status(403).json({
        error: "Acesso negado",
        message:
          "Apenas professores podem realizar avaliações de dobras cutâneas. Esta funcionalidade requer conhecimento técnico especializado e equipamentos adequados para medições precisas.",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("[requireProfessor] Erro ao verificar role do usuário:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Erro ao verificar permissões do usuário",
    });
    return;
  }
}
