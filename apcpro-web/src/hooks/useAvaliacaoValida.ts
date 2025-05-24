import { useEffect, useState } from "react";

export function useAvaliacaoValida(userPerfilId: string) {
  const [valida, setValida] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchValida() {
      if (!userPerfilId) return;

      // Use a variável de ambiente corretamente
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(
        `${apiUrl}/api/alunos/${userPerfilId}/avaliacao-valida`
      );
      if (res.status === 404) {
        // Não existe avaliação: considere como inválida
        setValida(false);
        return;
      }
      if (!res.ok) {
        setValida(null);
        return;
      }
      const data = await res.json();
      // Se a avaliação está vencida ou inválida, retorna false
      setValida(data.possuiAvaliacaoValida === true);
    }
    fetchValida();
  }, [userPerfilId]);

  return valida;
}
