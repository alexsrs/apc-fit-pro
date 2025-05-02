"use client"; 
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react"; // Importa o SessionProvider


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider> {/* Envolve os filhos com o SessionProvider */}
      </body>
    </html>
  );
}