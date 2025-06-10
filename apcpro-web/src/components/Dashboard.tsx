// src/components/Dashboard.tsx
"use client";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function Dashboard() {
  const { profile } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (profile && profile.role === "professor") {
      router.replace("/dashboard/professores");
    } else if (profile && profile.role === "aluno") {
      router.replace("/dashboard/alunos");
    }
  }, [profile, router]);

  if (!profile) return <div>Carregando...</div>;

  // Evita renderizar conteúdo se for redirecionar
  if (profile.role === "professor" || profile.role === "aluno") return null;

  return <div>Bem-vindo, {profile.nome || profile.name || "Usuário"}!</div>;
}
