import NextAuth from "next-auth";
import { authOptions } from "@/utils/auth";

// NextAuth handler para page routes
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
