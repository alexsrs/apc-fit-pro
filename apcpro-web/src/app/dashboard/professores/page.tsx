"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/contexts/UserProfileContext";
import Loading from "@/components/ui/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-left mb-2 text-gray-800">
          Bem-vindo professor {profile.name}
        </h1>
        <h2 className="text-xl text-left text-gray-600 mb-4">
          Seus alunos: Todos
        </h2>

        {loadingAlunos ? (
          <Loading />
        ) : alunos.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum aluno cadastrado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alunos.map((aluno) => (
              <Card
                key={aluno.id}
                className="p-4 bg-white rounded-xl shadow-md flex flex-col items-center"
              >
                <CardHeader className="flex flex-row items-center gap-4 w-full mb-0 p-0">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={aluno.image || "https://github.com/shadcn.png"}
                      alt={aluno.name}
                    />
                    <AvatarFallback className="text-2xl">
                      {aluno.name?.[0] ?? "A"}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg font-semibold text-gray-800 text-left">
                    {aluno.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col items-start gap-2 text-sm text-gray-600 w-full">
                  <p>{aluno.email}</p>

                  {(aluno.telefone || aluno.genero) && (
                    <div className="flex flex-row gap-2">
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
                    <p className="text-xs text-gray-500">
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
