"use client";

import * as React from "react";
import {
  SlidersVertical,
  NotebookPen,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Waypoints,
} from "lucide-react";

import { useSession } from "next-auth/react"; // Importa o hook useSession
import { useUserProfile } from "@/contexts/UserProfileContext"; // Importa o hook useUserProfile
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  type Profile = {
    name: string;
    email: string;
    image?: string;
    role: "professor" | "aluno";
  };

  const { profile, error } = useUserProfile() as {
    profile: Profile | null;
    error: string | null;
  };

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
          title: "Entrevista",
          url: "/avaliacao",
        },
        {
          title: "Anamnese inteligente",
          url: "#",
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
          title: "Entrevista",
          url: "/avaliacao",
        },
        {
          title: "Anamnese inteligente",
          url: "#",
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
    teams: [
      {
        name: profile.role === "professor" ? "Professor" : "Aluno",
        logo: GalleryVerticalEnd,
        plan: "Grupo: Academia XYZ",
      },
    ],
    navMain,
    projects: [
      // ...pode customizar projetos também se quiser
    ],
  };

  // Log para depuração
  console.log("[AppSidebar] Dados do usuário para sidebar:", data.user);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
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
