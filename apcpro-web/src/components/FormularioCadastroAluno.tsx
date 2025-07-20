import React, { useState } from "react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";

type FormularioCadastroAlunoProps = {
  professorId: string;
  conviteUrl?: string;
};

export default function FormularioCadastroAluno({
  professorId,
  conviteUrl,
}: FormularioCadastroAlunoProps) {
  const { setProfile } = useUserProfile();
  const { data: session } = useSession();
  const router = useRouter();
  const [telefone, setTelefone] = useState("");
  const [genero, setGenero] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);

    // Dados vindos da sessão
    const nome = session?.user?.name ?? "";
    const email = session?.user?.email ?? "";
    const userId = session?.user?.id;

    if (!userId) {
      setErro("Usuário não autenticado.");
      setEnviando(false);
      return;
    }

    const payload = {
      nome,
      email,
      telefone: telefone.replace(/\D/g, ""),
      genero,
      dataNascimento: dataNascimento || null,
      role: "aluno",
      professorId,
    };

    try {
      const resposta = await apiClient.post(`${userId}/profile`, payload);

      if (resposta.status < 200 || resposta.status >= 300) {
        throw new Error("Erro ao cadastrar aluno. Tente novamente.");
      }

      setSucesso(true);

      // Atualiza o contexto de perfil imediatamente após cadastro
      setProfile({
        nome,
        name: nome,
        id: userId,
        userId,
        role: "aluno",
        genero: genero as "masculino" | "feminino" | null,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
        professorId,
        email,
      });

      // Aguarda um pequeno tempo para mostrar a mensagem de sucesso, depois redireciona para o convite (mantendo contexto)
      setTimeout(() => {
        if (conviteUrl) {
          router.replace(conviteUrl);
        } else {
          router.push("/dashboard");
        }
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErro(err.message);
      } else {
        setErro("Erro inesperado.");
      }
    } finally {
      setEnviando(false);
    }
  };

  if (sucesso) {
    return (
      <div className="text-green-600 text-center py-4" role="status">
        Cadastro realizado com sucesso.
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit}
      aria-label="Formulário de cadastro de aluno"
    >
      <label className="block">
        <span className="text-sm font-medium">Telefone celular</span>
        <Input
          required
          type="tel"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          placeholder="(99) 99999-9999"
          aria-label="Telefone"
          disabled={enviando}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Gênero</span>
        <select
          required
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          className="w-full border rounded px-2 py-2"
          aria-label="Gênero"
          disabled={enviando}
        >
          <option value="">Selecione</option>
          <option value="masculino">Masculino</option>
          <option value="feminino">Feminino</option>
          <option value="outro">Outro</option>
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-medium">Data de Nascimento</span>
        <Input
          required
          type="date"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
          aria-label="Data de Nascimento"
          disabled={enviando}
        />
      </label>
      {erro && (
        <div className="text-red-600 text-center py-4" role="alert">
          {erro}
        </div>
      )}
      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={enviando}
          className="w-full max-w-xs"
          aria-label="Cadastrar aluno"
        >
          {enviando ? "Enviando..." : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
}
