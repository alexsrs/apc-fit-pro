import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";

export function useAvaliacaoValida(userPerfilId: string) {
  const [valida, setValida] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchValida() {
      if (!userPerfilId) return;
      try {
        const res = await apiClient.get(
          `alunos/${userPerfilId}/avaliacao-valida`
        );
        setValida(res.data.possuiAvaliacaoValida === true);
      } catch (err: unknown) {
        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          (err as { response?: unknown }).response &&
          typeof (err as { response?: unknown }).response === "object" &&
          "status" in (err as { response: { status?: number } }).response!
        ) {
          if (
            (err as { response: { status: number } }).response.status === 404
          ) {
            setValida(false);
            return;
          }
        }
        setValida(null);
      }
    }
    fetchValida();
  }, [userPerfilId]);

  return valida;
}
