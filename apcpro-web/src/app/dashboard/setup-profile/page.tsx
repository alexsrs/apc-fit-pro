"use client";

import DashboardLayout from "@/components/dashboard-layout";
import TabsProfile from "@/components/ui/tabs-profile";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SetupProfile() {
  const { profile } = useUserProfile() as { profile: { role?: string } | null };
  const router = useRouter();

  useEffect(() => {
    if (profile && profile.role) {
      // Redireciona para o dashboard correto
      router.replace(
        profile.role === "professor"
          ? "/dashboard/professores"
          : "/dashboard/alunos"
      );
    }
  }, [profile, router]);

  // Evita loading infinito e pisca: só renderiza DashboardLayout se profile existir
  if (profile === null) {
    return (
      <div className="container p-2 flex items-start min-h-screen">
        <div>
          <h1 className="text-2xl font-bold mb-4">Complete seu perfil</h1>
          <h2 className="mb-4 pb-4">
            Isso nos ajuda a personalizar sua experiência na plataforma.
          </h2>
          <TabsProfile />
        </div>
      </div>
    );
  }

  // Só renderiza o layout se profile existir
  return (
    <DashboardLayout>
      <div className="container p-2 flex items-start min-h-screen">
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
