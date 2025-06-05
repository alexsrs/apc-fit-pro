"use client";

import { useEffect, useState } from "react";
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
  Search,
  Users,
  ListTodo,
  CalendarCheck,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/MetricCard";
import { TeamSwitcher } from "@/components/team-switcher";
import { ConviteAlunoModal } from "@/components/ConviteAlunoModal";

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
  const { profile } = useUserProfile();
  const router = useRouter();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loadingAlunos, setLoadingAlunos] = useState(true);
  const [tab, setTab] = useState<string>("ativos");
  const [busca, setBusca] = useState("");
  const [modalConviteOpen, setModalConviteOpen] = useState(false);

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
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${profile.userId}/alunos`
      )
        .then((res) => res.json())
        .then((data) => {
          setAlunos(data);
        })
        .catch(() => setAlunos([]))
        .finally(() => setLoadingAlunos(false));
    }
  }, [profile, router]);

  if (!profile) return <Loading />;

  // Filtros simulados para tabs (ajuste conforme regras reais)
  const alunosAtivos = alunos; // TODO: filtrar por status real
  //const alunosInativos: Aluno[] = [];
  //const alunosPendentes: Aluno[] = [];

  // Busca simples
  const alunosFiltrados = alunosAtivos.filter((a) =>
    a.name.toLowerCase().includes(busca.toLowerCase())
  );

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
        {/* Seção de alertas inteligentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" /> Alertas
              Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>João Silva não registra treinos há 10 dias.</li>
              <li>Maria Souza estagnada há 30 dias - sugerir reavaliação.</li>
              <li>Pedro Rocha com frequência inferior a 1x/semana.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5" /> Reavaliações Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm text-yellow-600">Agir em breve</p>
          </CardContent>
        </Card>
      </div>
      {/* Header com busca e notificações */}
      {/* Filtros e lista de alunos */}
      <div className="flex flex-row items-center gap-3 justify-end mt-8 w-full">
        <div className="max-w-xs w-full">
          <TeamSwitcher teams={[]} />
        </div>
        <Input
          placeholder="Buscar aluno..."
          className="w-64"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          aria-label="Buscar aluno"
        />
        <Button variant="outline" size="icon" aria-label="Buscar">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" aria-label="Notificações">
          <Bell className="h-5 w-5" />
        </Button>
        <Button
          variant="default"
          className="md:w-auto"
          onClick={() => setModalConviteOpen(true)}
          aria-label="Adicionar novo aluno"
        >
          + Novo aluno
        </Button>
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
                        (
                        {(() => {
                          const nascimento = new Date(aluno.dataNascimento!);
                          const hoje = new Date();
                          let idade =
                            hoje.getFullYear() - nascimento.getFullYear();
                          const m = hoje.getMonth() - nascimento.getMonth();
                          if (
                            m < 0 ||
                            (m === 0 && hoje.getDate() < nascimento.getDate())
                          ) {
                            idade--;
                          }
                          return `${idade} anos`;
                        })()}
                        )
                      </p>
                    )}
                    <Button
                      variant="outline"
                      className="mt-2 w-full"
                      onClick={() => alert("Funcionalidade em breve!")}
                    >
                      Ver detalhes
                    </Button>
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
    </div>
  );
}
