"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/contexts/UserProfileContext";
import Loading from "@/components/ui/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDown } from "lucide-react";

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

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Cards de métricas do dashboard */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Card: Total de Alunos */}
        <div className="rounded-xl shadow-md p-4 flex flex-col items-center bg-white">
          <div className="flex items-center gap-2 w-full justify-between">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Total de Alunos
              <ArrowUpRight className="w-4 h-4 text-green-600" />
            </span>
            <span className="text-2xl font-bold">{alunos.length}</span>
          </div>
          <div className="flex justify-between items-center w-full mt-2">
            <span className="text-green-600 font-medium">+5%</span>
            <span className="text-sm text-muted-foreground">
              Crescimento mensal
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground w-full text-left">
            Total de alunos cadastrados
          </p>
        </div>

        {/* Card: Novos Alunos */}
        <div className="rounded-xl shadow-md p-4 flex flex-col items-center bg-white">
          <div className="flex items-center gap-2 w-full justify-between">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Novos Alunos
              <ArrowDown className="w-4 h-4 text-red-600" />
            </span>
            <span className="text-2xl font-bold">3</span>
          </div>
          <div className="flex justify-between items-center w-full mt-2">
            <span className="text-red-600 font-medium">-10%</span>
            <span className="text-sm text-muted-foreground">Este mês</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground w-full text-left">
            Novos cadastros no período
          </p>
        </div>

        {/* Card: Alunos Ativos */}
        <div className="rounded-xl shadow-md p-4 flex flex-col items-center bg-white">
          <div className="flex items-center gap-2 w-full justify-between">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Alunos Ativos
              <ArrowUpRight className="w-4 h-4 text-green-600" />
            </span>
            <span className="text-2xl font-bold">{alunos.length}</span>
          </div>
          <div className="flex justify-between items-center w-full mt-2">
            <span className="text-green-600 font-medium">+2%</span>
            <span className="text-sm text-muted-foreground">Retenção alta</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground w-full text-left">
            Alunos com avaliações recentes
          </p>
        </div>

        {/* Card: Taxa de Crescimento */}
        <div className="rounded-xl shadow-md p-4 flex flex-col items-center bg-white">
          <div className="flex items-center gap-2 w-full justify-between">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Taxa de Crescimento
              <ArrowUpRight className="w-4 h-4 text-green-600" />
            </span>
            <span className="text-2xl font-bold">4.5%</span>
          </div>
          <div className="flex justify-between items-center w-full mt-2">
            <span className="text-green-600 font-medium">+4.5%</span>
            <span className="text-sm text-muted-foreground">
              Desempenho estável
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground w-full text-left">
            Meta de crescimento atingida
          </p>
        </div>
      </div>

      {/* Título e descrição da lista de alunos */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 mb-2 gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Alunos cadastrados
          </h2>
          <p className="text-sm text-muted-foreground">
            Veja abaixo a lista de alunos vinculados ao seu perfil de professor.
          </p>
        </div>
        <Button
          variant="default"
          className="w-full md:w-auto"
          onClick={() => alert("Funcionalidade de adicionar aluno em breve!")}
        >
          + Novo aluno
        </Button>
      </div>
      {/* Lista de alunos */}
      {loadingAlunos ? (
        <Loading />
      ) : alunos.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <span className="text-lg text-gray-500">
            Nenhum aluno cadastrado.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {alunos.map((aluno) => (
            <div
              key={aluno.id}
              className="rounded-xl shadow-md p-4 flex flex-col items-center bg-white"
            >
              <Avatar className="w-20 h-20 mb-2">
                <AvatarImage
                  src={aluno.image || "https://github.com/shadcn.png"}
                  alt={aluno.name}
                />
                <AvatarFallback className="text-2xl">
                  {aluno.name?.[0] ?? "A"}
                </AvatarFallback>
              </Avatar>
              <span className="text-lg font-semibold text-center text-gray-800 w-full">
                {aluno.name}
              </span>
              <div className="flex flex-col items-center gap-2 text-sm text-gray-600 w-full mt-2">
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
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}{" "}
                    (
                    {(() => {
                      const nascimento = new Date(aluno.dataNascimento);
                      const hoje = new Date();
                      let idade = hoje.getFullYear() - nascimento.getFullYear();
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
                  className="mt-2"
                  onClick={() => alert("Funcionalidade em breve!")}
                >
                  Ver detalhes
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
