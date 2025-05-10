"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout"; // Certifique-se de que o caminho está correto
import TabsProfile from "@/components/ui/tabs-profile"; // Atualize o caminho para o componente TabsProfile
import Loading from "@/components/ui/Loading";

export default function AvaliacaoPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    redirect("/"); // Redireciona para a página inicial se não houver sessão
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-2 flex items-start min-h-screen">
        <div>
          <h1 className="text-2xl font-bold mb-4">Complete seu perfil</h1>
          <h2 className="mb-4 pb-4">
            Isso nos ajuda a personalizar sua experiência na plataforma.
          </h2>
          <TabsProfile />
        </div>
      </div>
    </DashboardLayout>
  );
}
