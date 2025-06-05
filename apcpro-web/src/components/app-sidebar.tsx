"use client";

import * as React from "react";
import {
  SlidersVertical,
  NotebookPen,
  GalleryVerticalEnd,
  Waypoints,
} from "lucide-react";
import Image from "next/image";

import { useUserProfile } from "@/contexts/UserProfileContext"; // Importa o hook useUserProfile
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  type Profile = {
    name: string;
    email: string;
    image?: string;
    role: "professor" | "aluno";
    userId?: string;
    id?: string;
  };

  const { profile, error } = useUserProfile() as {
    profile: Profile | null;
    error: string | null;
  };

  const [grupos, setGrupos] = useState([
    {
      name: profile?.role === "professor" ? "Professor" : "Aluno",
      logo: GalleryVerticalEnd,
      plan: "Academia XYZ",
    },
  ]);

  useEffect(() => {
    async function fetchGrupos() {
      try {
        const userId = profile?.userId || profile?.id;
        if (!userId) return;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/grupos`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.ok) {
          const gruposApi = await response.json();
          if (Array.isArray(gruposApi) && gruposApi.length > 0) {
            setGrupos(
              gruposApi.map((g: { name?: string }) => ({
                name: g.name || "Grupo sem nome",
                logo: GalleryVerticalEnd,
                plan: "Academia XYZ",
              }))
            );
          }
        }
      } catch {
        // Silencia erro, mantém grupo padrão
      }
    }
    fetchGrupos();
  }, [profile]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Erro ao carregar perfil: {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <span></span>
      </div>
    );
  }

  // Menus para cada role
  const navMainProfessor = [
    {
      title: "Avaliar",
      url: "#",
      icon: NotebookPen,
      isActive: true,
      items: [
        {
          title: "Triagem inteligente",
          url: "/#",
        },
        {
          title: "Anamnese",
          url: "/avaliacao",
        },
        {
          title: "Medidas corporais",
          url: "#",
        },
        {
          title: "Testes físicos",
          url: "#",
        },
      ],
    },
    {
      title: "Planejar",
      url: "#",
      icon: Waypoints,
      items: [
        {
          title: "Biblioteca de exercícios",
          url: "#",
        },
        {
          title: "Periodização",
          url: "#",
        },
        {
          title: "Plano de treino",
          url: "#",
        },
        {
          title: "Chekpoints",
          url: "#",
        },
      ],
    },
    {
      title: "Controlar",
      url: "#",
      icon: SlidersVertical,
      items: [
        {
          title: "Registro de treino",
          url: "#",
        },
        {
          title: "Analise de carga",
          url: "#",
        },
        {
          title: "Evolução",
          url: "#",
        },
        {
          title: "Alertas inteligentes",
          url: "#",
        },
      ],
    },
  ];

  const navMainAluno = [
    {
      title: "Avaliar",
      url: "#",
      icon: NotebookPen,
      isActive: true,
      items: [
        {
          title: "Triagem inteligente",
          url: "/#",
        },
        {
          title: "Anamnese",
          url: "/avaliacao",
        },
        {
          title: "Medidas corporais",
          url: "#",
        },
        {
          title: "Testes físicos",
          url: "#",
        },
      ],
    },
    {
      title: "Planejar",
      url: "#",
      icon: Waypoints,
      items: [
        {
          title: "Biblioteca de exercícios",
          url: "#",
        },
        {
          title: "Periodização",
          url: "#",
        },
        {
          title: "Plano de treino",
          url: "#",
        },
        {
          title: "Chekpoints",
          url: "#",
        },
      ],
    },
    {
      title: "Controlar",
      url: "#",
      icon: SlidersVertical,
      items: [
        {
          title: "Registro de treino",
          url: "#",
        },
        {
          title: "Analise de carga",
          url: "#",
        },
        {
          title: "Evolução",
          url: "#",
        },
        {
          title: "Alertas inteligentes",
          url: "#",
        },
      ],
    },
  ];

  const navMain =
    profile.role === "professor" ? navMainProfessor : navMainAluno;

  const data = {
    user: {
      name:
        profile.name && profile.name.trim() !== "" ? profile.name : "Usuário",
      email: profile.email || "sem-email@exemplo.com",
      avatar:
        profile.image && profile.image.startsWith("http")
          ? profile.image
          : "https://github.com/shadcn.png",
    },
    teams: grupos,
    navMain,
    projects: [
      // ...pode customizar projetos também se quiser
    ],
  };

  // Log para depuração
  console.log("[AppSidebar] Dados do usuário para sidebar:", data.user);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-center py-4">
        {/* Logo completa (visível quando sidebar está aberto) */}
        <div className="transition-all duration-200 ease-linear group-[sidebar-wrapper-data-collapsible=icon]:hidden">
          <Image
            src="/images/logo-apc-fit-pro.png" // Caminho correto na pasta public/
            alt="APC Fit Pro"
            width={120}
            height={120}
            priority
          />
        </div>
        {/* Ícone (visível quando sidebar está minimizado) */}
        <div className="transition-all duration-200 ease-linear hidden group-[sidebar-wrapper-data-collapsible=icon]:block">
          <Image
            src="/images/logo-apc-fit-pro.png" // Mesmo arquivo, tamanho menor
            alt="APC Fit Pro"
            width={60}
            height={60}
            priority
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
