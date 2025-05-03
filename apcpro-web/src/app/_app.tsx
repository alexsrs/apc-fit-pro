import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider
      session={session}
      basePath="http://localhost:3333/api/auth" // URL do backend com NextAuth
    >
      <Component {...pageProps} />
    </SessionProvider>
  );
}