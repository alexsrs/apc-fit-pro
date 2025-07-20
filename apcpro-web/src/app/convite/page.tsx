"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { ModalPadrao } from "@/components/ui/ModalPadrao";
import FormularioCadastroAluno from "@/components/FormularioCadastroAluno";
import { SidebarProvider } from "@/components/ui/sidebar";

function ConviteAlunoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const professorId = searchParams?.get("professorId");

  useEffect(() => {
    // Se não houver professorId, redireciona para home
    if (!professorId) {
      router.replace("/");
    }
  }, [professorId, router]);

  if (!professorId) {
    return null;
  }

  // Agora a página está envolvida pelo SidebarProvider
  return (
    <SidebarProvider>
      <DashboardLayout>
        <ModalPadrao
          open={true}
          onClose={() => router.push('/')}
          title="Cadastro de Aluno"
          description="Complete o cadastro para se tornar aluno e começar seus treinos personalizados."
          maxWidth="lg"
          showScrollArea={false}
        >
          <FormularioCadastroAluno professorId={professorId} />
        </ModalPadrao>
      </DashboardLayout>
    </SidebarProvider>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando convite...</div>}>
      <ConviteAlunoPage />
    </Suspense>
  );
}
