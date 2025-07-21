"use client";

import TabsProfile from "@/components/ui/tabs-profile";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SetupProfile() {
  const { profile } = useUserProfile() as { profile: { role?: string } | null };
  const router = useRouter();

  // Se já tem perfil, redireciona para o dashboard correto
  useEffect(() => {
    if (profile && profile.role) {
      router.replace(
        profile.role === "professor"
          ? "/dashboard/professores"
          : "/dashboard/alunos"
      );
    }
  }, [profile, router]);

  // Sempre renderiza o formulário de perfil se não houver perfil
  // Se for fluxo de convite, nunca renderiza o setup-profile
  if (!profile || !profile.role) {
    if (typeof window !== "undefined" && localStorage.getItem("conviteAtivo") === "1") {
      // Não renderiza nada, deixa o loader/layout redirecionar ou a página de convite assumir
      return null;
    }
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

  // Se chegou aqui, já tem perfil e será redirecionado pelo useEffect
  return null;
}
