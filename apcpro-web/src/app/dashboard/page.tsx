"use client";

import Loading from "@/components/ui/Loading";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/contexts/UserProfileContext";

export default function DashboardPage() {
  const { profile } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (profile && profile.role) {
      if (profile.role === "professor") {
        router.replace("/dashboard/professores");
      } else if (profile.role === "aluno") {
        router.replace("/dashboard/alunos");
      }
    }
  }, [profile, router]);

  // Apenas um loading ou mensagem, pois o redirecionamento será feito nas rotas filhas
  return <Loading />;
}
