"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/contexts/UserProfileContext";
import Loading from "@/components/ui/Loading";

export default function ProfessoresDashboard() {
  const { profile } = useUserProfile();
  const router = useRouter();
  const [alunos, setAlunos] = useState<any[]>([]);
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
    // Buscar alunos do professor logado
    if (profile && profile.id) {
      setLoadingAlunos(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${profile.userId}/alunos`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("Alunos recebidos:", data);
          setAlunos(data);
        })
        .catch(() => setAlunos([]))
        .finally(() => setLoadingAlunos(false));
    }
  }, [profile, router]);

  if (!profile) return <Loading />;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-fit md:min-h-[90vh]">
      <div className="flex-1 rounded-xl bg-muted/50">
        <h1 className="p-4 text-2xl font-semibold">
          Bem-vindo ao Dashboard de Professores
        </h1>
        <h2 className="p-4 text-lg">Seus alunos:</h2>
        {loadingAlunos ? (
          <Loading />
        ) : alunos.length === 0 ? (
          <p className="p-4">Nenhum aluno cadastrado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {alunos.map((aluno) => (
              <div
                key={aluno.id}
                className="rounded-lg border bg-white shadow p-4 flex flex-col items-center"
              >
                <img
                  src={aluno.image || "https://github.com/shadcn.png"}
                  alt={aluno.name}
                  className="w-16 h-16 rounded-full mb-2"
                />
                <span className="font-semibold">{aluno.name}</span>
                <span className="text-sm text-gray-500">{aluno.email}</span>
                <span className="text-sm">{aluno.telefone}</span>
                <span className="text-sm">{aluno.genero}</span>
                {/* Exibe a data de nascimento do aluno, se disponível */}
                {aluno.dataNascimento && (
                  <span className="text-sm text-gray-500">
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
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
