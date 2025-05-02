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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Professor: João",
      logo: GalleryVerticalEnd,
      plan: "Grupo: Academia XYZ",
    },
  ],
  navMain: [
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
  ],

  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
