"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/contexts/UserProfileContext";
import Loading from "@/components/ui/Loading";

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

  if (!profile) return <Loading />; // Carregando o perfil do usuário

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-fit md:min-h-[90vh]">
      <div className="flex-1 rounded-xl bg-muted/50">
        <h1 className="p-4 text-2xl font-semibold">
          Bem-vindo ao Dashboard de Professores
        </h1>
      </div>
    </div>
  );
}
