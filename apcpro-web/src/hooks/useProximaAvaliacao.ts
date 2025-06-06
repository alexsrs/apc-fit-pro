// hooks/useProximaAvaliacao.ts
import { useEffect, useState } from "react";
import { buscarProximaAvaliacao } from "@/services/user-service";

export function useProximaAvaliacao(userPerfilId: string) {
  const [proxima, setProxima] = useState<{ data: string; tipo: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userPerfilId) return;
    setLoading(true);
    buscarProximaAvaliacao(userPerfilId)
      .then(setProxima)
      .catch(() => setProxima(null))
      .finally(() => setLoading(false));
  }, [userPerfilId]);

  return { proxima, loading };
}
