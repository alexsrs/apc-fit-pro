"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/contexts/UserProfileContext";

export default function AlunosDashboard() {
  const { profile } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    // Só redireciona se o perfil existir e for professor
    if (profile && profile.role === "professor") {
      router.replace("/dashboard/professores");
    }
  }, [profile, router]);

  if (!profile) return <span>Carregando...</span>;

  // Conteúdo para alunos
  return <h1>Bem-vindo ao Dashboard de Alunos</h1>;
}
