import { PrismaClient } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import jwt from "jsonwebtoken";

declare module "next-auth" {
  interface User {
    role?: string; // Adicione a propriedade role aqui
  }

  interface Session {
    user: User & {
      id: string;
      email: string;
      role?: string; // Adicione a propriedade role aqui
    };
    accessToken?: string; // Adiciona accessToken à tipagem da sessão
  }
}

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt", // Troca para JWT para integração frontend-backend
  },
  jwt: {
    async encode({ token, secret }) {
      // Garante que o token existe antes de assinar
      if (!token) {
        throw new Error("Token indefinido ao tentar assinar JWT.");
      }
      // Força JWT assinado (HS256)
      return jwt.sign(token as object, secret, { algorithm: "HS256" });
    },
    async decode({ token, secret }) {
      if (!token) {
        throw new Error("Token indefinido ao tentar decodificar JWT.");
      }
      const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });
      // Garante que o retorno seja do tipo JWT ou null
      if (typeof decoded === "string" || !decoded) {
        return null;
      }
      return decoded as Record<string, unknown>;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.sub = user.id; // Garante compatibilidade JWT padrão
        token.email = user.email;
        token.role = user.role;
      }
      // Não expõe mais o id_token do Google como accessToken!
      return token;
    },
    async session({ session, token }) {
      if (token && token.id) {
        session.user.id = token.id as string;
      } else if (session.user.email) {
        const userFromDb = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (userFromDb) {
          session.user.id = userFromDb.id;
        }
      }
      // Não expõe mais accessToken customizado, use apenas o JWT do NextAuth
      session.accessToken = undefined;
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
