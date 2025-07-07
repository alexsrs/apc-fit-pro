"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/contexts/UserProfileContext";
import Loading from "@/components/ui/Loading";
import { useAvaliacaoValida } from "@/hooks/useAvaliacaoValida";
import { ModalAvaliacaoAluno } from "@/components/ModalAvaliacaoAluno";
import {
  CalendarCheck,
  Dumbbell,
  TrendingUp,
  CalendarDays,
  AlertCircle,
  ClipboardList,
  Brain,
  BarChart2,
  MessageCircle,
  ArrowDown,
  ArrowUpRight,
  UserCheck,
  Play,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/MetricCard";
import {
  Avaliacao,
  ListaAvaliacoes,
  ListaAvaliacoesHandle,
} from "@/components/ListaAvaliacoes";
import { useProximaAvaliacao } from "@/hooks/useProximaAvaliacao";
import { useEvolucaoFisica } from "@/hooks/useEvolucaoFisica";
import {
  AlertasPersistente,
  AlertasPersistenteHandle,
} from "@/app/components/AlertasPersistente";
import { ModalDetalhesAvaliacao } from "@/components/ModalDetalhesAvaliacao";

export default function AlunosDashboard() {
  const { profile } = useUserProfile();
  const { proxima, loading } = useProximaAvaliacao(profile?.id ?? ""); // Sempre chamado!
  const { evolucao, loading: loadingEvolucao } = useEvolucaoFisica(
    profile?.id ?? ""
  );

  const router = useRouter();
  const [showAvaliacaoCompleta, setShowAvaliacaoCompleta] = useState(false);
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] =
    useState<Avaliacao | null>(null);
  const listaRef = useRef<ListaAvaliacoesHandle>(null);
  const alertasRef = useRef<AlertasPersistenteHandle>(null);

  const avaliacaoValida = useAvaliacaoValida(profile?.id ?? "");

  useEffect(() => {
    if (profile && profile.role === "professor") {
      router.replace("/dashboard/professores");
    }
  }, [profile, router]);

  useEffect(() => {
    // Abre o modal se não houver avaliação válida (inclui 404, vencida ou inválida)
    if (avaliacaoValida === false) setShowAvaliacaoCompleta(true);
  }, [avaliacaoValida]);

  useEffect(() => {
    function handleOpenTriagemModal() {
      setShowAvaliacaoCompleta(true);
    }
    window.addEventListener("open-triagem-modal", handleOpenTriagemModal);
    return () => {
      window.removeEventListener("open-triagem-modal", handleOpenTriagemModal);
    };
  }, []);

  useEffect(() => {
    function handleOpenAnamneseModal() {
      setShowAvaliacaoCompleta(true);
    }
    window.addEventListener("open-anamnese-modal", handleOpenAnamneseModal);
    return () => {
      window.removeEventListener(
        "open-anamnese-modal",
        handleOpenAnamneseModal
      );
    };
  }, []);

  useEffect(() => {
    function handleOpenMedidasModal() {
      setShowAvaliacaoCompleta(true);
    }
    window.addEventListener("open-medidas-modal", handleOpenMedidasModal);
    return () => {
      window.removeEventListener("open-medidas-modal", handleOpenMedidasModal);
    };
  }, []);

  // Função para lidar com o sucesso da avaliação completa
  function handleAvaliacaoSuccess() {
    setShowAvaliacaoCompleta(false);
    listaRef.current?.refetch();
    window.location.reload();
  }

  if (!profile) return <Loading />;

  // Dados simulados para exibição (substitua por dados reais depois)
  // Substitua o valor do card "Próxima avaliação" pelo valor real:
  const metricas = [
    {
      icon: <Dumbbell className="w-5 h-5" aria-hidden="true" />,
      title: "Treinos realizados",
      value: 28,
      indicator: <ArrowDown className="w-5 h-5 rotate-180 text-green-600" />,
      indicatorColor: "text-green-600",
      indicatorText: "+8%",
      descricao: "Total de treinos feitos este mês",
    },
    {
      icon: <CalendarDays className="w-5 h-5" aria-hidden="true" />,
      title: "Próxima avaliação",
      value: loading
        ? "Carregando..."
        : proxima
        ? (() => {
            const data = new Date(proxima.data);
            const dia = data.toLocaleDateString("pt-BR", { day: "2-digit" });
            let mes = data.toLocaleDateString("pt-BR", { month: "short" });
            mes = mes.charAt(0).toUpperCase() + mes.slice(1).replace(".", "");
            return `${dia} de ${mes}`;
          })()
        : "Sem previsão",
      descricao: loading ? "" : proxima ? "Data prevista para reavaliação" : "",
      indicator: undefined,
      indicatorColor: undefined,
      indicatorText: loading
        ? ""
        : proxima
        ? proxima.tipo.charAt(0).toUpperCase() + proxima.tipo.slice(1)
        : "",
      acao: (
        <Button
          size="sm"
          className="ml-2"
          onClick={() => alert("Funcionalidade de agendamento em breve!")}
        >
          Agendar
        </Button>
      ),
    },
    {
      icon: <TrendingUp className="w-5 h-5" aria-hidden="true" />,
      title: "Evolução física",
      value: loadingEvolucao ? (
        "Carregando..."
      ) : evolucao ? (
        <div className="flex flex-col items-end gap-1 w-full">
          {/* Peso */}
          <span className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Peso</span>
            <span className="flex items-center font-mono text-2xl font-bold text-zinc-900">
              <span
                className={
                  evolucao.peso > 0
                    ? "text-green-600"
                    : evolucao.peso < 0
                    ? "text-red-600"
                    : ""
                }
              >
                {evolucao.peso > 0 && "+"}
                {evolucao.peso < 0 && "-"}
              </span>
              {Math.abs(evolucao.peso).toFixed(1)}kg
              {evolucao.peso > 0 && (
                <ArrowUpRight
                  className="w-5 h-5 ml-1 text-green-600"
                  aria-label="Aumento de peso"
                />
              )}
              {evolucao.peso < 0 && (
                <ArrowDown
                  className="w-5 h-5 ml-1 text-red-600"
                  aria-label="Redução de peso"
                />
              )}
            </span>
          </span>
          {/* Massa magra */}
          <span className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Massa magra</span>
            <span className="flex items-center font-mono text-2xl font-bold text-zinc-900">
              <span
                className={
                  evolucao.massaMagra > 0
                    ? "text-green-600"
                    : evolucao.massaMagra < 0
                    ? "text-red-600"
                    : ""
                }
              >
                {evolucao.massaMagra > 0 && "+"}
                {evolucao.massaMagra < 0 && "-"}
              </span>
              {Math.abs(evolucao.massaMagra).toFixed(1)}kg
              {evolucao.massaMagra > 0 && (
                <ArrowUpRight
                  className="w-5 h-5 ml-1 text-green-600"
                  aria-label="Aumento de massa magra"
                />
              )}
              {evolucao.massaMagra < 0 && (
                <ArrowDown
                  className="w-5 h-5 ml-1 text-red-600"
                  aria-label="Redução de massa magra"
                />
              )}
            </span>
          </span>
        </div>
      ) : (
        "Sem dados"
      ),
      descricao: loadingEvolucao
        ? ""
        : evolucao
        ? "Peso / massa magra desde a última avaliação"
        : "",
      indicator: undefined,
      indicatorColor: undefined,
      indicatorText: "",
    },
    {
      icon: <CalendarCheck className="w-5 h-5" aria-hidden="true" />,
      title: "Frequência semanal",
      value: "2,8",
      descricao: "Média de treinos das últimas semanas",
      indicator: <ArrowDown className="w-5 h-5 rotate-180 text-green-600" />,
      indicatorColor: "text-green-600",
      indicatorText: "+8%",
    },
  ];

  const proximasAtividades = [
    {
      titulo: "Próximo treino",
      descricao: "Treino A - Força",
      acao: (
        <Button size="sm" onClick={() => alert("Funcionalidade em breve!")}>
          Iniciar treino
        </Button>
      ),
    },
    { titulo: "Reavaliação marcada", descricao: "14/06/2025 às 10h" },
    {
      titulo: "Nova planilha disponível",
      descricao: "Aguardando sua aprovação",
    },
  ];

  const acoesRapidas = [
    { 
      icon: <UserCheck className="w-6 h-6" />, 
      label: "Realizar Avaliação",
      acao: () => setShowAvaliacaoCompleta(true)
    },
    { icon: <Brain className="w-6 h-6" />, label: "Anamnese" },
    { icon: <Dumbbell className="w-6 h-6" />, label: "Meu Treino Atual" },
    { icon: <BarChart2 className="w-6 h-6" />, label: "Minha Evolução" },
    { icon: <CalendarDays className="w-6 h-6" />, label: "Agendar Avaliação" },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      label: "Falar com o professor",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Cards de métricas - grid responsivo sem scroll */}
      <div>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {metricas.map((m, i) => (
            <MetricCard
              key={i}
              icon={m.icon}
              title={m.title}
              value={m.value}
              indicator={m.indicator}
              indicatorColor={m.indicatorColor}
              indicatorText={m.indicatorText}
              descricao={m.descricao}
              acao={m.acao}
            />
          ))}
        </div>
      </div>

      {/* Alertas e próximas atividades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card Alertas Inteligentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" /> Alertas
              Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Alertas persistentes por usuário */}
            <AlertasPersistente ref={alertasRef} userId={profile.id ?? ""} />
            <Button
              className="mt-4"
              variant="outline"
              onClick={async () => {
                await fetch("/api/alerta-amqp", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    mensagem: "Hello World",
                    userId: profile.id, // envia o userId correto
                  }),
                });
                // Atualiza alertas imediatamente após envio
                alertasRef.current?.atualizar();
                alert("Alerta enviado para a fila!");
              }}
            >
              Enviar alerta Hello World
            </Button>
          </CardContent>
        </Card>
        {/* Card Próximas Atividades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" /> Próximas Atividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {proximasAtividades.map((a, i) => (
                <li key={i} className="flex items-center gap-2 justify-between">
                  <span>
                    <span className="font-semibold">{a.titulo}:</span>{" "}
                    {a.descricao}
                  </span>
                  {a.acao}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      {/* Card Minhas Avaliações em destaque abaixo (único) */}
      <div className="mt-4 flex md:justify-start justify-center" data-section="avaliacoes">
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" /> Minhas Avaliações
                </div>
                <Button 
                  onClick={() => setShowAvaliacaoCompleta(true)}
                  size="sm"
                  className="bg-black hover:bg-gray-800 text-white flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Iniciar Avaliação
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ListaAvaliacoes ref={listaRef} userPerfilId={profile.id ?? ""} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Acesso rápido */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
        {acoesRapidas.map((a, i) => (
          <Button
            key={i}
            variant="outline"
            className="flex flex-col items-center gap-1 py-6"
            aria-label={a.label}
            onClick={() => {
              if (a.acao) {
                a.acao();
              } else if (a.label === "Anamnese") {
                setShowAvaliacaoCompleta(true);
              }
            }}
          >
            {a.icon}
            <span className="text-xs font-medium mt-1">{a.label}</span>
          </Button>
        ))}
      </div>
      {/* Modal de avaliação completa para alunos */}
      <ModalAvaliacaoAluno
        open={showAvaliacaoCompleta}
        onClose={() => setShowAvaliacaoCompleta(false)}
        onSuccess={handleAvaliacaoSuccess}
      />
      {/* Modal de detalhes da avaliação */}
      {avaliacaoSelecionada && avaliacaoSelecionada.resultado && (
        <ModalDetalhesAvaliacao
          open={!!avaliacaoSelecionada}
          onClose={() => setAvaliacaoSelecionada(null)}
          avaliacao={{
            ...avaliacaoSelecionada,
            resultado: avaliacaoSelecionada.resultado
          }}
        />
      )}
    </div>
  );
}
