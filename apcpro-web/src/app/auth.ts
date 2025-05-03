import { Prisma, PrismaClient, Session as PrismaSession } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Database } from "lucide-react";
import { DefaultUser, NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

declare module "next-auth" {
  interface Session {
    user: DefaultUser & { id: string };
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
  callbacks: {
    async session({ session, token }: { session: Session; token: any }) {
      if (token?.sub) {
        session.user = {
          ...session.user,
          id: token.sub,
        };
      } else {
        console.warn("Token ID está indefinido. Verifique o fluxo de autenticação.");
        session.user = {
          ...session.user,
          id: "",
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redireciona para o dashboard após o login
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl + "/dashboard";
    },
  },
  debug: true,
};

