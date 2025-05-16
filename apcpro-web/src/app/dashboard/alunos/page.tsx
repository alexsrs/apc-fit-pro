"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/contexts/UserProfileContext";
import Loading from "@/components/ui/Loading";

export default function AlunosDashboard() {
  const { profile } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    // Só redireciona se o perfil existir e for professor
    if (profile && profile.role === "professor") {
      router.replace("/dashboard/professores");
    }
  }, [profile, router]);

  if (!profile) return <Loading />; // Carregando o perfil do usuário

  // Conteúdo para alunos
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-fit md:min-h-[90vh]">
      <div className="flex-1 rounded-xl bg-muted/50">
        <h1 className="p-4 text-2xl font-semibold">
          Bem-vindo ao Dashboard de Alunos
        </h1>
      </div>
    </div>
  );
}
