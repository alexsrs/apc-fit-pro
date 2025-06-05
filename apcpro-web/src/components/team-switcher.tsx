"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Users, LucideProps } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserProfile } from "@/contexts/UserProfileContext";

type Team = {
  name: string;
  logo: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  plan: string;
};

type GrupoApi = {
  nome: string;
  // adicione outros campos se necessário
};

export function TeamSwitcher({ teams }: { teams: Team[] }) {
  const { isMobile } = useSidebar();
  const { profile } = useUserProfile();
  const defaultTeam = {
    name: "Todos os alunos",
    logo: Users,
    plan: "Todos",
  };
  const [activeTeam, setActiveTeam] = React.useState(defaultTeam);
  const [showModal, setShowModal] = React.useState(false);
  const [newTeamName, setNewTeamName] = React.useState("");
  const [userProfileId, setUserProfileId] = React.useState<string | null>(null);
  const [teamsState, setTeamsState] = React.useState<typeof teams>(teams);

  React.useEffect(() => {
    setUserProfileId(localStorage.getItem("userProfileId"));
    const onStorage = () =>
      setUserProfileId(localStorage.getItem("userProfileId"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  React.useEffect(() => {
    if (!userProfileId) return;
    const fetchGroups = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userProfileId}/grupos`
        );
        if (response.ok) {
          const gruposApi = await response.json();
          setTeamsState(
            (gruposApi as GrupoApi[]).map((g) => ({
              name: g.nome,
              logo: Users,
              plan: g.nome,
            }))
          );
        }
      } catch {
        // Silencie erro
      }
    };
    fetchGroups();
  }, [showModal, userProfileId]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeTeam.logo className="size-4" />
              </div>
              {/* AQUI: Adiciona a classe condicional para esconder texto quando recolhido */}
              <div className="grid flex-1 text-left text-sm leading-tight group-[sidebar-wrapper-data-collapsible=icon]:sr-only">
                <span className="truncate font-medium">
                  {profile?.role
                    ? profile.role.charAt(0).toUpperCase() +
                      profile.role.slice(1)
                    : ""}
                </span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Grupos / Equipes
            </DropdownMenuLabel>
            <DropdownMenuItem
              key="all-students"
              onClick={() =>
                setActiveTeam({
                  name: "Todos os alunos",
                  logo: Users,
                  plan: "Todos",
                })
              }
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-3.5 shrink-0" />
              </div>
              Todos os alunos
              <DropdownMenuShortcut>⌘1</DropdownMenuShortcut>
            </DropdownMenuItem>
            {teamsState.map((team, index) => (
              <DropdownMenuItem
                key={team.name + index}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <team.logo className="size-3.5 shrink-0" />
                </div>
                {team.plan}
                <DropdownMenuShortcut>⌘{index + 2}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">Novo Grupo</h2>
              <form
                onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  if (!newTeamName.trim()) {
                    alert("Digite um nome para o grupo");
                    return;
                  }
                  if (!userProfileId) {
                    alert("ID do perfil do usuário não encontrado.");
                    return;
                  }
                  try {
                    const response = await fetch(
                      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userProfileId}/grupos`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ nome: newTeamName }),
                      }
                    );
                    if (response.ok) {
                      setShowModal(false);
                      setNewTeamName("");
                      // Opcional: recarregar a página ou atualizar a lista de grupos
                    } else {
                      const error = await response.json().catch(() => ({}));
                      alert(error.message || "Erro ao criar grupo");
                    }
                  } catch {
                    alert("Erro de conexão com a API");
                  }
                }}
              >
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 mb-4"
                  placeholder="Nome do grupo"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  autoFocus
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-3 py-2 rounded bg-gray-200 text-gray-700"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded bg-primary text-white"
                  >
                    Criar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
