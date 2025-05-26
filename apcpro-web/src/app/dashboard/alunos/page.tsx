"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/contexts/UserProfileContext";
import Loading from "@/components/ui/Loading";
import { useAvaliacaoValida } from "@/hooks/useAvaliacaoValida";
import { ModalAnamnese } from "@/components/ModalAnamnese";
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
import { useAnamneseModal } from "@/contexts/AnamneseModalContext";

export default function AlunosDashboard() {
  const { profile } = useUserProfile();
  const router = useRouter();
  const { open, openModal, closeModal } = useAnamneseModal();

  const avaliacaoValida = useAvaliacaoValida(profile?.id ?? "");

  useEffect(() => {
    if (profile && profile.role === "professor") {
      router.replace("/dashboard/professores");
    }
  }, [profile, router]);

  useEffect(() => {
    // Abre o modal se não houver avaliação válida (inclui 404, vencida ou inválida)
    if (avaliacaoValida === false) openModal();
  }, [avaliacaoValida, openModal]);

  function handleSuccess() {
    window.location.reload();
  }

  if (!profile) return <Loading />;

  // Dados simulados para exibição (substitua por dados reais depois)
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
      value: "12/06/2025",
      descricao: "Data prevista para reavaliação",
      indicator: <ArrowDown className="w-5 h-5 rotate-180 text-green-600" />,
      indicatorColor: "text-green-600",
      indicatorText: "+8%",
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
      acao: <Button size="sm">Iniciar treino</Button>,
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

      {/* Acesso rápido */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
        {acoesRapidas.map((a, i) => (
          <Button
            key={i}
            variant="outline"
            className="flex flex-col items-center gap-1 py-6"
            aria-label={a.label}
            onClick={() => {
              if (a.label === "Anamnese") openModal();
            }}
          >
            {a.icon}
            <span className="text-xs font-medium mt-1">{a.label}</span>
          </Button>
        ))}
      </div>
      {/* Modal de anamnese */}
      <ModalAnamnese
        open={open}
        onClose={closeModal}
        userPerfilId={profile.id ?? ""}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
