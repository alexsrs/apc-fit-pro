import { useEffect, useState } from "react";

/**
 * Hook para buscar alertas inteligentes do backend (que consome a fila RabbitMQ).
 * Busca periodicamente via endpoint REST.
 * @param userId ID do professor logado
 * @returns Lista de alertas (strings)
 */

export interface AlertaInteligente {
  mensagem: string;
  avaliacaoId?: string;
}

export function useAlertasInteligentes(userId: string) {
  const [alertas, setAlertas] = useState<AlertaInteligente[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Função para buscar alertas manualmente (pode ser usada para refresh externo)
   */
  const fetchAlertas = async (signal?: AbortSignal) => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/alertas?userId=${userId}`, { signal });
      const data = await res.json();
      if (Array.isArray(data.alertas)) {
        setAlertas(
          data.alertas.filter((a: any) => typeof a.mensagem === "string")
        );
      }
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        setAlertas([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    let interval: NodeJS.Timeout;

    // Busca inicial
    fetchAlertas(controller.signal);
    // Polling
    interval = setInterval(() => fetchAlertas(controller.signal), 5000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [userId]);

  return { alertas, loading, refresh: fetchAlertas };
}
