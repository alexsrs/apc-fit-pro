"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useRouter, usePathname } from "next/navigation";
import apiClient from "@/lib/api-client";

export function DashboardProfileLoader() {
  const { data: session, status } = useSession();
  const { setProfile, setError } = useUserProfile();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("Session:", session, "Status:", status);
    // Evita ciclo infinito: não executa nada na página de setup do perfil
    if (pathname === "/dashboard/setup-profile") return;

    const fetchUserProfile = async () => {
      try {
        const userId = session?.user?.id;
        if (!userId) return;

        // Usa o apiClient padronizado (axios) que já envia o token JWT
        const { data: userProfile } = await apiClient.get(`${userId}/profile/`);
        localStorage.setItem("userProfileId", userProfile.id);
        setProfile({
          ...userProfile,
          name: userProfile.name || session?.user?.name || "Usuário",
          email:
            userProfile.email ||
            session?.user?.email ||
            "sem-email@exemplo.com",
          image:
            userProfile.image ||
            session?.user?.image ||
            "https://github.com/shadcn.png",
        });
      } catch (err) {
        if (
          err &&
          typeof err === "object" &&
          "response" in err &&
          (err as { response?: { status?: number } }).response?.status === 404
        ) {
          // Nunca redireciona para setup-profile se estiver na rota de convite
          const isConviteComProfessor =
            pathname === "/convite" &&
            typeof window !== "undefined" &&
            new URLSearchParams(window.location.search).has("professorId");

          if (!isConviteComProfessor) {
            router.replace("/dashboard/setup-profile");
          }
          // Se for convite, não faz nada (deixa o formulário de aluno aparecer normalmente)
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido ao buscar perfil");
        }
      }
    };

    if (status === "authenticated" && session?.user?.id) fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router, pathname]);

  return null;
}

// Exemplo de verificação em um layout global
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile } = useUserProfile();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  // Considera convite ativo se flag no localStorage estiver setada
  const isConviteComProfessor =
    (pathname === "/convite" && searchParams?.has("professorId")) ||
    (typeof window !== "undefined" && localStorage.getItem("conviteAtivo") === "1");

  useEffect(() => {
    // Só redireciona se NÃO estiver na rota de convite com professorId
    if (!profile && !isConviteComProfessor) {
      router.replace("/dashboard/setup-profile");
    }
  }, [profile, pathname, router, isConviteComProfessor]);

  return <>{children}</>;
}
