"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/contexts/UserProfileContext";

export default function ProfessoresDashboard() {
  const { profile } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (
      profile &&
      typeof profile === "object" &&
      profile !== null &&
      "role" in profile &&
      profile.role !== "professor"
    ) {
      router.replace("/dashboard/alunos");
    }
  }, [profile, router]);

  if (!profile) {
    return <span>Carregando...</span>;
  }

  return <h1>Bem-vindo ao Dashboard de Professores</h1>;
}
