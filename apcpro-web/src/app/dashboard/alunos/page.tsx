"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/contexts/UserProfileContext";
import Loading from "@/components/ui/Loading";
import { useAvaliacaoValida } from "@/hooks/useAvaliacaoValida";
import { ModalTriagem } from "@/components/ModalTriagem";
import { ModalAnamnese } from "@/components/ModalAnamnese";
import { ModalMedidasCorporais } from "@/components/ModalMedidasCorporais";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/MetricCard";
import {
  Avaliacao,
  ListaAvaliacoes,
  ListaAvaliacoesHandle,
} from "@/components/ListaAvaliacoes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProximaAvaliacao } from "@/hooks/useProximaAvaliacao";

// Função utilitária para calcular idade
function calcularIdade(dataNascimento?: string): number | undefined {
  if (!dataNascimento) return undefined;
  const nascimento = new Date(dataNascimento);
  if (isNaN(nascimento.getTime())) return undefined;
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade >= 0 ? idade : undefined;
}

export default function AlunosDashboard() {
  const { profile } = useUserProfile();
  const { proxima, loading } = useProximaAvaliacao(profile?.id ?? ""); // Sempre chamado!

  const router = useRouter();
  const [showAnamnese, setShowAnamnese] = useState(false);
  const [showMedidas, setShowMedidas] = useState(false);
  const [, setLastTriagemObj] = useState<string | null>(null);
  const [showTriagem, setShowTriagem] = useState(false);
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] =
    useState<Avaliacao | null>(null);
  const listaRef = useRef<ListaAvaliacoesHandle>(null);

  const avaliacaoValida = useAvaliacaoValida(profile?.id ?? "");

  useEffect(() => {
    if (profile && profile.role === "professor") {
      router.replace("/dashboard/professores");
    }
  }, [profile, router]);

  useEffect(() => {
    // Abre o modal se não houver avaliação válida (inclui 404, vencida ou inválida)
    if (avaliacaoValida === false) setShowTriagem(true);
  }, [avaliacaoValida]);

  useEffect(() => {
    function handleOpenTriagemModal() {
      setShowAnamnese(false);
      setShowTriagem(true);
    }
    window.addEventListener("open-triagem-modal", handleOpenTriagemModal);
    return () => {
      window.removeEventListener("open-triagem-modal", handleOpenTriagemModal);
    };
  }, []);

  useEffect(() => {
    function handleOpenAnamneseModal() {
      setShowAnamnese(false);
      setTimeout(() => setShowAnamnese(true), 50);
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
      setShowMedidas(false);
      setTimeout(() => setShowMedidas(true), 50);
    }
    window.addEventListener("open-medidas-modal", handleOpenMedidasModal);
    return () => {
      window.removeEventListener("open-medidas-modal", handleOpenMedidasModal);
    };
  }, []);

  // Função para lidar com o sucesso da triagem
  // e decidir se deve abrir a anamnese ou recarregar a página
  function handleTriagemSuccess(objetivo?: string) {
    setShowTriagem(false);
    if (objetivo && objetivo !== "Alto rendimento esportivo") {
      setShowAnamnese(true);
      setLastTriagemObj(objetivo);
    } else {
      window.location.reload();
    }
  }

  const idade =
    profile && profile.dataNascimento
      ? calcularIdade(
          typeof profile.dataNascimento === "string"
            ? profile.dataNascimento
            : profile.dataNascimento.toISOString()
        )
      : undefined;

  function handleMedidasSuccess() {
    listaRef.current?.refetch();
    setShowMedidas(false);
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
      value: "-1,2kg / +0,5kg",
      descricao: "Peso / massa magra desde a última avaliação",
      indicator: <ArrowDown className="w-5 h-5 rotate-180 text-green-600" />,
      indicatorColor: "text-green-600",
      indicatorText: "+8%",
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

  const alertas = [
    { texto: "Você está há 7 dias sem registrar treino.", tipo: "aviso" },
    {
      texto: "Avaliação vencida há 15 dias – agende nova avaliação.",
      tipo: "erro",
    },
    {
      texto: "Parabéns! Você bateu sua meta de frequência semanal.",
      tipo: "sucesso",
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
    { icon: <ClipboardList className="w-6 h-6" />, label: "Minhas Avaliações" },
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
      {/* Cards de métricas */}
      <div className="grid gap-4 md:grid-cols-4">
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
            <ul className="list-disc pl-6 space-y-2 text-sm">
              {alertas.map((a, i) => (
                <li
                  key={i}
                  className={
                    a.tipo === "erro"
                      ? "text-red-600"
                      : a.tipo === "sucesso"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {a.texto}
                </li>
              ))}
            </ul>
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
      <div className="mt-4 flex md:justify-start justify-center">
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 w-full">
                <ClipboardList className="h-5 w-5" /> Minhas Avaliações
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
              if (a.label === "Anamnese") {
                setShowAnamnese(false); // Garante reset
                setTimeout(() => setShowAnamnese(true), 50); // Força abrir
              }
            }}
          >
            {a.icon}
            <span className="text-xs font-medium mt-1">{a.label}</span>
          </Button>
        ))}
      </div>
      {/* Modal de triagem */}
      <ModalTriagem
        open={showTriagem}
        onClose={() => setShowTriagem(false)}
        userPerfilId={profile.id ?? ""}
        onSuccess={(objetivo) => handleTriagemSuccess(objetivo)}
      />
      <ModalAnamnese
        open={showAnamnese}
        onClose={() => setShowAnamnese(false)}
        userPerfilId={profile.id ?? ""}
        onSuccess={() => window.location.reload()}
      />
      <ModalMedidasCorporais
        open={showMedidas}
        onClose={() => setShowMedidas(false)}
        userPerfilId={profile.id ?? ""}
        onSuccess={handleMedidasSuccess}
        dataNascimento={
          profile.dataNascimento ? String(profile.dataNascimento) : ""
        }
        idade={idade ?? 0} // Passe a idade calculada aqui!
      />
      {/* Modal de detalhes */}
      <Dialog
        open={!!avaliacaoSelecionada}
        onOpenChange={() => setAvaliacaoSelecionada(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Avaliação</DialogTitle>
          </DialogHeader>
          {avaliacaoSelecionada && (
            <div>
              <p>
                <b>Tipo:</b> {avaliacaoSelecionada.tipo}
              </p>
              <p>
                <b>Data:</b>{" "}
                {new Date(avaliacaoSelecionada.data).toLocaleDateString(
                  "pt-BR"
                )}
              </p>
              <p>
                <b>Status:</b> {avaliacaoSelecionada.status}
              </p>
              {avaliacaoSelecionada.objetivo && (
                <p>
                  <b>Objetivo:</b> {avaliacaoSelecionada.objetivo}
                </p>
              )}
              {/* Adicione outros campos relevantes */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
