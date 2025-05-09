"use client";

import { useSession } from "next-auth/react";
// Extende o tipo Session para incluir a propriedade 'id' no usuári
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DashboardLayout from "../../components/dashboard-layout";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Aguarde até que o status da sessão seja resolvido
  }, [session, status, router]);

  if (status === "loading") {
    return <p>Carregando...</p>; // Exibe um estado de carregamento enquanto a sessão está sendo carregada
  }

  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <div className="aspect-video rounded-xl bg-muted/50 pl-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Bem-vindo ao seu dashboard!</p>

            <div className="text-center">
              {session?.user.image && (
                <Image
                  src={session.user.image}
                  alt={`Foto de ${session.user.name}`}
                  width={96}
                  height={96}
                  className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
                />
              )}
              <p className="text-lg font-semibold">
                {session?.user.name || "Nome não disponível"}
              </p>
              <p className="text-lg font-semibold">
                {session?.user.userId || "Nome não disponível"}
              </p>
              <p className="text-sm text-muted-foreground">
                {session?.user.email || "Email não disponível"}
              </p>
            </div>
          </div>
          <div className="aspect-video rounded-xl bg-muted/50 pl-6"></div>
        </div>
      </div>
    </DashboardLayout>
  );
}
