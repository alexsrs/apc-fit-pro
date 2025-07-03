import { useEffect, useState, useCallback } from "react";

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
  const fetchAlertas = useCallback(async (signal?: AbortSignal) => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/alertas?userId=${userId}`, { signal });
      const data = await res.json();
      if (Array.isArray(data.alertas)) {
        setAlertas(
          data.alertas.filter((a: { mensagem: unknown; avaliacaoId?: string }) => typeof a.mensagem === "string")
        );
      }
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        setAlertas([]);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    let intervalId: NodeJS.Timeout;

    // Busca inicial
    fetchAlertas(controller.signal);
    // Polling
    intervalId = setInterval(() => fetchAlertas(controller.signal), 5000);

    return () => {
      controller.abort();
      clearInterval(intervalId);
    };
  }, [userId, fetchAlertas]);

  return { alertas, loading, refresh: fetchAlertas };
}
