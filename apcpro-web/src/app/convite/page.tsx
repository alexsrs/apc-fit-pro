"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import DashboardLayout from "@/components/dashboard-layout";
import { ModalPadrao } from "@/components/ui/ModalPadrao";
import FormularioCadastroAluno from "@/components/FormularioCadastroAluno";
import { SidebarProvider } from "@/components/ui/sidebar";

function ConviteAlunoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const professorId = searchParams?.get("professorId");

  useEffect(() => {
    // Se não houver professorId, redireciona para home
    if (!professorId) {
      router.replace("/");
      return;
    }

    // Se não autenticado, força login e salva URL de retorno
    if (status === "unauthenticated") {
      localStorage.setItem("conviteAtivo", "1");
      localStorage.setItem("conviteRedirectUrl", window.location.pathname + window.location.search);
      signIn(undefined, { callbackUrl: window.location.pathname + window.location.search });
      return;
    }

    // Se autenticado, marca flag de convite normalmente
    if (status === "authenticated") {
      localStorage.setItem("conviteAtivo", "1");
      localStorage.setItem("conviteRedirectUrl", window.location.pathname + window.location.search);
    }

    // Remove flag ao sair da página
    return () => {
      localStorage.removeItem("conviteAtivo");
      // Não remove o conviteRedirectUrl aqui, pois pode ser usado após login
    };
  }, [professorId, router, status]);

  if (!professorId || status === "loading" || status === "unauthenticated") {
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
