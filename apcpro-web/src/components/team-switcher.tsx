"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Users, LucideProps } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingInline } from "@/components/ui/Loading";

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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserProfile } from "@/contexts/UserProfileContext";
import apiClient from "@/lib/api-client";

type Team = {
  id?: string;
  name: string;
  logo: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  plan: string;
};

type Grupo = {
  id: string;
  nome: string;
  descricao?: string;
  criadoEm: string;
};

interface TeamSwitcherProps {
  teams?: Team[];
  onTeamChange?: (groupId: string | null) => void;
  onGerenciarGruposClick?: () => void;
}

export function TeamSwitcher({ teams = [], onTeamChange, onGerenciarGruposClick }: TeamSwitcherProps) {
  const { isMobile } = useSidebar();
  const { profile } = useUserProfile();
  
  const defaultTeam: Team = {
    id: "all",
    name: "Todos os alunos",
    logo: Users,
    plan: "Todos",
  };
  
  const [activeTeam, setActiveTeam] = React.useState<Team>(defaultTeam);
  const [showModal, setShowModal] = React.useState(false);
  const [newTeamName, setNewTeamName] = React.useState("");
  const [newTeamDescription, setNewTeamDescription] = React.useState("");
  const [grupos, setGrupos] = React.useState<Grupo[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Carregar grupos do backend
  const carregarGrupos = React.useCallback(async () => {
    if (!profile?.userId) return;
    
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/users/${profile.userId}/grupos`);
      setGrupos(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar grupos:", error);
      setGrupos([]);
    } finally {
      setLoading(false);
    }
  }, [profile?.userId]);

  React.useEffect(() => {
    carregarGrupos();
  }, [carregarGrupos]);

  const handleTeamChange = (team: Team) => {
    setActiveTeam(team);
    // Notifica o componente pai sobre a mudança
    if (onTeamChange) {
      onTeamChange(team.id === "all" ? null : team.id || null);
    }
  };

  const criarGrupo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTeamName.trim()) {
      alert("Digite um nome para o grupo");
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post(
        `/api/users/${profile?.userId}/grupos`,
        { 
          nome: newTeamName.trim(),
          descricao: newTeamDescription.trim() || undefined
        }
      );
      
      if (response.status === 200 || response.status === 201) {
        await carregarGrupos(); // Recarrega a lista de grupos
        setShowModal(false);
        setNewTeamName("");
        setNewTeamDescription("");
      } else {
        const error = response.data || {};
        alert(error.message || "Erro ao criar grupo");
      }
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
      alert("Erro de conexão com a API");
    } finally {
      setLoading(false);
    }
  };

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
              <div className="grid flex-1 text-left text-sm leading-tight group-[sidebar-wrapper-data-collapsible=icon]:sr-only">
                <span className="truncate font-medium">
                  {activeTeam.name}
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
            
            {/* Opção "Todos os alunos" */}
            <DropdownMenuItem
              onClick={() => handleTeamChange(defaultTeam)}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-md border">
                <Users className="size-3.5 shrink-0" />
              </div>
              Todos os alunos
              <DropdownMenuShortcut>⌘1</DropdownMenuShortcut>
            </DropdownMenuItem>
            
            {/* Grupos carregados do backend */}
            {grupos.map((grupo, index) => (
              <DropdownMenuItem
                key={grupo.id}
                onClick={() => handleTeamChange({
                  id: grupo.id,
                  name: grupo.nome,
                  logo: Users,
                  plan: grupo.descricao || "Grupo personalizado"
                })}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Users className="size-3.5 shrink-0" />
                </div>
                {grupo.nome}
                <DropdownMenuShortcut>⌘{index + 2}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            
            {/* Teams legados (se houver) */}
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={`legacy-${index}`}
                onClick={() => handleTeamChange(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <team.logo className="size-3.5 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{grupos.length + index + 2}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2 cursor-pointer"
              onClick={() => setShowModal(true)}
              disabled={loading}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium flex items-center gap-2">
                {loading ? (
                  <>
                    <LoadingInline size="sm" />
                    <span>Carregando...</span>
                  </>
                ) : (
                  "Criar grupo"
                )}
              </div>
            </DropdownMenuItem>
            {/* Item Gerenciar Grupos como menu item, dispara callback */}
            {onGerenciarGruposClick && (
              <DropdownMenuItem
                className="gap-2 p-2 cursor-pointer"
                onClick={onGerenciarGruposClick}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Users className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium flex items-center gap-2">
                  Gerenciar Grupos
                </div>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Modal para criar novo grupo */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Grupo</DialogTitle>
            </DialogHeader>
            <form onSubmit={criarGrupo} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do grupo *</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Equipe de Vôlei"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição (opcional)</Label>
                <Input
                  id="descricao"
                  placeholder="Descrição do grupo..."
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading || !newTeamName.trim()}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <LoadingInline size="sm" />
                      <span>Criando...</span>
                    </div>
                  ) : (
                    "Criar"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
