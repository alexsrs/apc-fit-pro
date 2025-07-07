"use client";

import { useEffect, useState, useRef } from "react";
// import { ListaAvaliacoes } from "@/components/ListaAvaliacoes";

import {
  AlertasPersistenteProfessor,
  AlertasPersistenteProfessorHandle,
} from "@/app/components/AlertasPersistenteProfessor";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/contexts/UserProfileContext";
import Loading from "@/components/ui/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarSync,
  UserRoundPlus,
  ArrowDown,
  Bell,
  Users,
  CalendarCheck,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/MetricCard";
import { FiltrosAvancados } from "@/components/FiltrosAvancados";
import { TeamSwitcher } from "@/components/team-switcher";
import { ModalGerenciarGrupos } from "@/components/ModalGerenciarGrupos";
import { ConviteAlunoModal } from "@/components/ConviteAlunoModal";
import { ModalAvaliacaoCompleta } from "@/components/ModalAvaliacaoCompleta";
import { ModalDetalhesAluno } from "@/components/ModalDetalhesAluno";
import { AvaliacoesPendentes } from "@/components/AvaliacoesPendentes";
import apiClient from "@/lib/api-client";

type Aluno = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  telefone?: string;
  genero?: string;
  dataNascimento?: string | null;
};

export default function ProfessoresDashboard() {
  // Estado para modal de detalhes do aluno
  const [modalDetalhesOpen, setModalDetalhesOpen] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);
  
  // Estado para modal de nova avaliação
  const [modalNovaAvaliacaoOpen, setModalNovaAvaliacaoOpen] = useState(false);
  const [alunoParaAvaliar, setAlunoParaAvaliar] = useState<Aluno | null>(null);
  
  // Estado para modal de gerenciar grupos
  const [modalGerenciarGruposOpen, setModalGerenciarGruposOpen] = useState(false);
  
  const { profile } = useUserProfile();
  const router = useRouter();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loadingAlunos, setLoadingAlunos] = useState(true);
  const [tab, setTab] = useState<string>("ativos");
  const [busca, setBusca] = useState("");
  const [modalConviteOpen, setModalConviteOpen] = useState(false);
  
  // Estado para filtros avançados
  const [filtros, setFiltros] = useState({
    status: "",
    genero: "",
    idadeMin: "",
    idadeMax: "",
    grupoId: "",
    ultimaAvaliacao: "",
  });
  
  // Estado para grupos (para o filtro)
  const [grupos, setGrupos] = useState<Array<{ id: string; nome: string }>>([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState<string | null>(null);

  // Consome alertas inteligentes do backend (REST, sem polling excessivo)
  const alertasRef = useRef<AlertasPersistenteProfessorHandle>(null);

  useEffect(() => {
    if (
      profile &&
      typeof profile === "object" &&
      profile !== null &&
      "role" in profile &&
      profile.role !== "professor"
    ) {
      router.replace("/dashboard/alunos");
    }
    if (profile && profile.id) {
      setLoadingAlunos(true);
      // Carregar alunos e grupos em paralelo
      Promise.all([
        apiClient.get(`/api/users/${profile.userId}/alunos`),
        apiClient.get(`/api/users/${profile.userId}/grupos`)
      ])
        .then(([alunosRes, gruposRes]) => {
          setAlunos(alunosRes.data || []);
          setGrupos(gruposRes.data || []);
        })
        .catch((error) => {
          console.error("Erro ao carregar dados:", error);
          setAlunos([]);
          setGrupos([]);
        })
        .finally(() => setLoadingAlunos(false));
    }
  }, [profile, router]);

  if (!profile) return <Loading />;

  // Função para calcular idade
  const calcularIdade = (dataNascimento: string): number => {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  // Filtros simulados para tabs (ajuste conforme regras reais)
  let alunosParaFiltrar = alunos;
  
  // Filtrar por grupo selecionado no TeamSwitcher
  if (grupoSelecionado && grupoSelecionado !== "all") {
    // TODO: Implementar filtro por grupo quando tiver a relação aluno-grupo
    // Por enquanto, mostra todos os alunos
    alunosParaFiltrar = alunos;
  }

  // Aplicar filtros avançados
  const alunosFiltrados = alunosParaFiltrar.filter((aluno) => {
    // Filtro de busca por nome/email/telefone
    if (busca) {
      const termoBusca = busca.toLowerCase();
      const nomeMatch = aluno.name.toLowerCase().includes(termoBusca);
      const emailMatch = aluno.email.toLowerCase().includes(termoBusca);
      const telefoneMatch = aluno.telefone?.toLowerCase().includes(termoBusca);
      
      if (!nomeMatch && !emailMatch && !telefoneMatch) {
        return false;
      }
    }

    // Filtro por gênero
    if (filtros.genero && aluno.genero !== filtros.genero) {
      return false;
    }

    // Filtro por idade
    if (aluno.dataNascimento) {
      const idade = calcularIdade(aluno.dataNascimento);
      
      if (filtros.idadeMin && idade < parseInt(filtros.idadeMin)) {
        return false;
      }
      
      if (filtros.idadeMax && idade > parseInt(filtros.idadeMax)) {
        return false;
      }
    }

    // TODO: Implementar outros filtros (status, última avaliação, grupo)

    return true;
  });

  return (
    <div className="p-4 space-y-6">
      {/* Adicione aqui, logo após o carregamento do perfil */}

      {/* Cards de métricas originais */}
      <div className="grid gap-4 md:grid-cols-4 mt-2">
        <MetricCard
          icon={<Users className="w-5 h-5" aria-hidden="true" />}
          title="Total de Alunos"
          value={alunos.length}
          indicator={
            <ArrowDown className="w-5 h-5 rotate-180 text-green-600" />
          }
          indicatorColor="text-green-600"
          indicatorText="+5%"
          subtitle="Crescimento mensal"
          description="Total de alunos cadastrados"
        />
        <MetricCard
          icon={<UserRoundPlus className="w-5 h-5" aria-hidden="true" />}
          title="Novos Alunos"
          value={3}
          indicator={<ArrowDown className="w-5 h-5 text-red-600" />}
          indicatorColor="text-red-600"
          indicatorText="-10%"
          subtitle="Este mês"
          description="Novos cadastros no período"
        />
        <MetricCard
          icon={<CalendarSync className="w-5 h-5" aria-hidden="true" />}
          title="Alunos Ativos"
          value={alunos.length}
          indicator={
            <ArrowDown className="w-5 h-5 rotate-180 text-green-600" />
          }
          indicatorColor="text-green-600"
          indicatorText="+2%"
          subtitle="Retenção alta"
          description="Alunos com avaliações recentes"
        />
        <MetricCard
          icon={<CalendarCheck className="w-5 h-5" aria-hidden="true" />}
          title="Treinos concluídos"
          value={139}
          indicator={
            <ArrowDown className="w-5 h-5 rotate-180 text-green-600" />
          }
          indicatorColor="text-green-600"
          indicatorText="+4.5%"
          subtitle="Desempenho estável"
          description="Meta de crescimento atingida"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
        {/* Seção de alertas inteligentes (mensageria via backend REST/polling) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" /> Alertas
              Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AlertasPersistenteProfessor
              ref={alertasRef}
              userId={profile?.userId ?? ""}
            />
          </CardContent>
        </Card>

        {/* Seção de avaliações pendentes */}
        <AvaliacoesPendentes 
          professorId={profile?.userId ?? ""} 
        />
      </div>
      {/* Header com filtros avançados */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="max-w-xs">
              <TeamSwitcher 
                teams={[]} 
                onTeamChange={(groupId) => setGrupoSelecionado(groupId)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setModalGerenciarGruposOpen(true)}
              aria-label="Gerenciar grupos"
            >
              <Users className="h-4 w-4 mr-2" />
              Gerenciar Grupos
            </Button>
            <Button
              variant="default"
              onClick={() => setModalConviteOpen(true)}
              aria-label="Adicionar novo aluno"
            >
              + Novo aluno
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" aria-label="Notificações">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <FiltrosAvancados
          busca={busca}
          onBuscaChange={setBusca}
          filtros={filtros}
          onFiltrosChange={setFiltros}
          grupos={grupos}
        />
      </div>
      <ConviteAlunoModal
        open={modalConviteOpen}
        onClose={() => setModalConviteOpen(false)}
        professorId={profile?.userId ?? ""}
      />
      <Tabs value={tab} onValueChange={setTab} defaultValue="ativos">
        <TabsList>
          <TabsTrigger value="ativos">Alunos Ativos</TabsTrigger>
          <TabsTrigger value="inativos">Inativos</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
        </TabsList>
        <TabsContent value="ativos">
          {loadingAlunos ? (
            <Loading />
          ) : alunosFiltrados.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <span className="text-lg text-gray-500">
                Nenhum aluno cadastrado.
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {alunosFiltrados.map((aluno) => (
                <Card key={aluno.id}>
                  <CardHeader>
                    <div className="flex flex-col items-center">
                      <Avatar className="w-16 h-16 mb-2">
                        <AvatarImage
                          src={aluno.image || "https://github.com/shadcn.png"}
                          alt={aluno.name}
                        />
                        <AvatarFallback className="text-2xl">
                          {aluno.name?.[0] ?? "A"}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-center w-full text-lg font-semibold">
                        {aluno.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm flex flex-col items-center">
                    <p className="text-center">{aluno.email}</p>
                    {(aluno.telefone || aluno.genero) && (
                      <div className="flex flex-row gap-2 justify-center w-full">
                        {aluno.telefone && (
                          <Badge
                            variant="outline"
                            className="bg-gray-100 text-gray-700"
                          >
                            {aluno.telefone}
                          </Badge>
                        )}
                        {aluno.genero && (
                          <Badge
                            variant="secondary"
                            className="bg-indigo-100 text-indigo-700"
                          >
                            {aluno.genero}
                          </Badge>
                        )}
                      </div>
                    )}
                    {aluno.dataNascimento && (
                      <p className="text-xs text-gray-500 text-center w-full">
                        Data de nascimento:{" "}
                        {new Date(aluno.dataNascimento).toLocaleDateString(
                          "pt-BR",
                          { day: "2-digit", month: "2-digit", year: "numeric" }
                        )}{" "}
                        ({calcularIdade(aluno.dataNascimento)} anos)
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setAlunoSelecionado(aluno);
                          setModalDetalhesOpen(true);
                        }}
                      >
                        Ver detalhes
                      </Button>
                      <Button
                        variant="default"
                        className="flex-1"
                        onClick={() => {
                          setAlunoParaAvaliar(aluno);
                          setModalNovaAvaliacaoOpen(true);
                        }}
                      >
                        Nova Avaliação
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="inativos">
          <p className="mt-4 text-sm text-muted-foreground">
            Nenhum aluno inativo no momento.
          </p>
        </TabsContent>
        <TabsContent value="pendentes">
          <p className="mt-4 text-sm text-muted-foreground">
            3 alunos aguardando avaliação inicial.
          </p>
        </TabsContent>
      </Tabs>

      {/* Modal para exibir detalhes do aluno selecionado */}
      <ModalDetalhesAluno
        open={modalDetalhesOpen}
        onClose={() => {
          setModalDetalhesOpen(false);
          setAlunoSelecionado(null);
        }}
        aluno={alunoSelecionado}
      />

      {/* Modal para nova avaliação do aluno selecionado */}
      {alunoParaAvaliar && (
        <ModalAvaliacaoCompleta
          open={modalNovaAvaliacaoOpen}
          onClose={() => {
            setModalNovaAvaliacaoOpen(false);
            setAlunoParaAvaliar(null);
          }}
          userPerfilId={alunoParaAvaliar.id}
          onSuccess={() => {
            setModalNovaAvaliacaoOpen(false);
            setAlunoParaAvaliar(null);
            // Aqui você pode adicionar lógica para atualizar a lista de avaliações
          }}
          nomeAluno={alunoParaAvaliar.name}
        />
      )}

      {/* Modal para gerenciar grupos */}
      <ModalGerenciarGrupos
        open={modalGerenciarGruposOpen}
        onClose={() => setModalGerenciarGruposOpen(false)}
        professorId={profile?.userId ?? ""}
        onGrupoChange={() => {
          // Força atualização dos grupos no TeamSwitcher
          window.location.reload();
        }}
      />
    </div>
  );
}
