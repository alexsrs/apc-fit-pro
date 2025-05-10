import { PrismaClient } from "@prisma/client";
import { DefaultUser, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

declare module "next-auth" {
  interface Session {
    user: DefaultUser & { id: string; email: string; userId: string };
  }
}

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // Usa o Prisma para armazenar sessões no banco de dados
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database", // Sessões armazenadas no banco de dados
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // Certifique-se de definir esta variável no .env
  },

  callbacks: {
    async jwt({ token, user }) {
      // Quando o usuário faz login pela primeira vez, user está presente
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.userId = user.id; // Garante que userId também seja salvo
      }
      return token;
    },

    async session({ session, token, user }) {
      // Sempre que a sessão for criada, pega o id do token ou mantém o do banco
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.userId = token.userId as string; // Garante que userId também seja salvo
      } else {
        session.user.id = user.id;
        session.user.email = user.email;
        session.user.userId = user.id; // Garante que userId também seja salvo
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development", // Desative em produção
};
