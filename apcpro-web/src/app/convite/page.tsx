"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormularioCadastroAluno from "@/components/FormularioCadastroAluno";

function ConviteAlunoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const professorId = searchParams.get("professorId");

  useEffect(() => {
    // Se não houver professorId, redireciona para home
    if (!professorId) {
      router.replace("/");
    }
  }, [professorId, router]);

  if (!professorId) {
    return null;
  }

  // Sempre renderiza o formulário de cadastro de aluno, independente da role
  return (
    <DashboardLayout>
      <Dialog open>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Cadastro de Aluno</DialogTitle>
          </DialogHeader>
          <FormularioCadastroAluno professorId={professorId} />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando convite...</div>}>
      <ConviteAlunoPage />
    </Suspense>
  );
}
