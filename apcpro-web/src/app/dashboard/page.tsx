"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";

export default function DashboardPage() {
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

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/${userId}/profile/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.expires}`,
            },
          }
        );

        if (response.status === 404) {
          router.push("/dashboard/setup-profile");
          return;
        }

        if (!response.ok) {
          throw new Error("Erro ao buscar o perfil do usuário");
        }

        const userProfile = await response.json();

        if (userProfile.role === "professor") {
          router.push("/dashboard/professores");
        } else if (userProfile.role === "aluno") {
          router.push("/dashboard/alunos");
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      } finally {
        setVerificandoPerfil(false);
      }
    };

    if (status === "authenticated") {
      fetchUserProfile();
    } else if (status !== "loading") {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading" || verificandoPerfil) {
    return <Loading />;
  }

  return null; // Não renderiza nada enquanto redireciona
}
