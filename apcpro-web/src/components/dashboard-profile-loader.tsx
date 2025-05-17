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
    // Evita ciclo infinito: não executa nada na página de setup do perfil
    if (pathname === "/dashboard/setup-profile") return;

    const fetchUserProfile = async () => {
      try {
        const userId = session?.user?.id;
        if (!userId) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/${userId}/profile/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const userProfile = await response.json();
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
        } else if (response.status === 404) {
          router.replace("/dashboard/setup-profile");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
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
