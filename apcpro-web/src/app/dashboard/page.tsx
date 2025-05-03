"use client";

import { useSession } from "next-auth/react";
// Extende o tipo Session para incluir a propriedade 'id' no usuári
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../components/dashboard-layout";
import { fetchUserData } from "../../lib/fetchUserData"; // Atualizado

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Aguarde até que o status da sessão seja resolvido


  }, [session, status, router]);

  if (status === "loading") {
    return <p>Carregando...</p>; // Exibe um estado de carregamento enquanto a sessão está sendo carregada
  }

  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <div className="aspect-video rounded-xl bg-muted/50 pl-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Bem-vindo ao seu dashboard!</p>
            {session?.user?.id ? (
                  <UserProfile userId={session.user.id} />
                ) : (
                  <div className="text-center">
                    {session?.user.image && (
                      <img
                        src={session.user.image}
                        alt={`Foto de ${session.user.name}`}
                        className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
                      />
                    )}
                    <p className="text-lg font-semibold">{session?.user.name || "Nome não disponível"}</p>
                    <p className="text-sm text-muted-foreground">{session?.user.email || "Email não disponível"}</p>
                  </div>
                )}
          </div>
          <div className="aspect-video rounded-xl bg-muted/50 pl-6">
              
                
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
}

function UserProfile({ userId }: { userId: string }) {
  interface UserData {
    name: string;
    email: string;
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        const data = await fetchUserData(userId);
        setUserData(data);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        setError("Não foi possível carregar os dados do usuário.");
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [userId]);

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro ao carregar os dados do usuário.</p>;
  }

  if (!userData) {
    return <p aria-live="polite">Carregando informações do usuário...</p>; // Pode ser substituído por um spinner
  }

  return (
    <section>
      <h2 className="text-xl font-bold">Informações do Usuário</h2>
      {userData ? (
        <>
          <p>
            <strong>Nome:</strong> {userData.name || "Nome não disponível"}
          </p>
          <p>
            <strong>Email:</strong> {userData.email || "Email não disponível"}
          </p>
        </>
      ) : (
        <p>Dados do usuário não encontrados.</p>
      )}
      <p>
        <strong>ID:</strong> {userId || "ID não disponível"}
      </p>
    </section>
  );
}
