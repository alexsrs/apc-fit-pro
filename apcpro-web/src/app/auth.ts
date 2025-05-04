import { PrismaClient } from "@prisma/client";
import { DefaultUser, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

declare module "next-auth" {
  interface Session {
    user: DefaultUser & { id: string; email: string };
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
      // Adiciona informações do usuário ao token JWT
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Passa os dados do token para a sessão
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
        };
      }
      return session;
    },
  },
  debug: false, // Desative em produção
};

