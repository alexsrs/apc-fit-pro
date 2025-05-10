"use client";

import { useSession } from "next-auth/react";
// Extende o tipo Session para incluir a propriedade 'id' no usuári
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DashboardLayout from "../../components/dashboard-layout";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [verificandoPerfil, setVerificandoPerfil] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = session?.user?.id;
        if (!userId) {
          setVerificandoPerfil(false);
          return;
        }
        const apiResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/${userId}/profile/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.expires}`,
            },
          }
        );

        console.log("API Response:", apiResponse);

        if (apiResponse.status === 404) {
          router.push("/setup-profile"); // Redireciona para a página de configuração de perfil
          return;
        }

        const userProfile = await apiResponse.json();
        console.log("Perfil do usuário:", userProfile);
        setVerificandoPerfil(false);
      } catch (error) {
        console.error("Erro ao buscar o perfil do usuário:", error);
        setVerificandoPerfil(false);
      }
    };

    if (status === "authenticated") {
      fetchUserProfile();
    } else if (status !== "loading") {
      setVerificandoPerfil(false);
    }
  }, [session, status, router]);

  useEffect(() => {
    if (status === "loading") return; // Aguarde até que o status da sessão seja resolvido
  }, [status]);

  // Exibe o userId no topo da página para confirmação
  if (
    status === "loading" ||
    verificandoPerfil ||
    (status === "authenticated" && !session?.user?.id)
  ) {
    return <p>Carregando...</p>; // Exibe um estado de carregamento enquanto verifica a sessão
  }

  return (
    <>
      <DashboardLayout>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <div className="aspect-video rounded-xl bg-muted/50 pl-6">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Bem-vindo ao seu dashboard!
              </p>

              <pre>{JSON.stringify(status, null, 2)}</pre>
              <pre>{JSON.stringify(session?.user, null, 2)}</pre>

              <div className="text-center">
                <p className="text-lg font-bold text-blue-700">
                  ID do usuário: {session?.user.id || "Não encontrado"}
                </p>
                {session?.user.image && (
                  <Image
                    src={session.user.image}
                    alt={`Foto de ${session.user.name}`}
                    width={96}
                    height={96}
                    className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
                  />
                )}
                <p className="text-lg font-semibold">
                  {session?.user.name || "Nome não disponível"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {session?.user.email || "Email não disponível"}
                </p>
              </div>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 pl-6"></div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
