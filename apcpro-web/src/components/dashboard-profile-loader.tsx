"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useRouter, usePathname } from "next/navigation";

export function DashboardProfileLoader() {
  const { data: session, status } = useSession();
  const { setProfile, setError } = useUserProfile();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Evita ciclo infinito na página de setup do perfil
    if (pathname === "/dashboard/setup-profile") return;

    const fetchUserProfile = async () => {
      try {
        const userId = session?.user?.id;
        if (!userId) return;

        console.log("[Loader] Buscando perfil para userId:", userId);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/${userId}/profile/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("[Loader] Status da resposta:", response.status);

        if (response.ok) {
          const userProfile = await response.json();
          console.log("[Loader] Perfil encontrado:", userProfile);
          // Preenche campos obrigatórios do perfil com fallback da sessão
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
        } else if (response.status === 404) {
          console.log("[Loader] Perfil não encontrado, redirecionando...");
          setProfile(null);
          router.replace("/dashboard/setup-profile");
        } else {
          setError("Erro ao buscar perfil do usuário");
        }
      } catch (err: any) {
        setError(err.message || "Erro desconhecido ao buscar perfil");
      }
    };

    if (status === "authenticated" && session?.user?.id) fetchUserProfile();
  }, [session, status, router, pathname]);

  return null;
}
