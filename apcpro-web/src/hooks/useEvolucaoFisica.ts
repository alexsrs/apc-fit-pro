import { useEffect, useState } from "react";
import { buscarEvolucaoFisica } from "@/services/user-service";

type EvolucaoFisica = {
  peso: number;
  massaMagra: number;
  massaMuscular?: number;
  musculoEsqueletico?: number;
};

export function useEvolucaoFisica(userPerfilId: string) {
  const [evolucao, setEvolucao] = useState<EvolucaoFisica | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userPerfilId) {
      setEvolucao(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    buscarEvolucaoFisica(userPerfilId)
      .then(setEvolucao)
      .catch(() => setEvolucao(null))
      .finally(() => setLoading(false));
  }, [userPerfilId]);

  return { evolucao, loading };
}