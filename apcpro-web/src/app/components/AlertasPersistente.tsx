import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";

const ALERTA_KEY = "alerta_ativo";
const ALERTA_EXP_KEY = "alerta_expira";

export type Alerta = { texto: string; tipo: string };

export type AlertasPersistenteHandle = {
  atualizar: () => void;
};

export const AlertasPersistente = forwardRef<
  AlertasPersistenteHandle,
  { userId: string }
>(function AlertasPersistente({ userId }, ref) {
  const [alertas, setAlertas] = useState<Alerta[]>([]);

  // Função para buscar alertas do backend
  const fetchAlertas = useCallback(async () => {
    const res = await fetch(`/api/alertas?userId=${userId}`);
    const data = await res.json();
    let novosAlertas: Alerta[] = [];
    if (data.alertas && data.alertas.length > 0) {
      novosAlertas = data.alertas.map((texto: string) => ({
        texto,
        tipo: texto.toLowerCase().includes("erro")
          ? "erro"
          : texto.toLowerCase().includes("parabéns")
          ? "sucesso"
          : "aviso",
      }));
    }
    // Carrega alertas antigos do localStorage
    const alertaSalvo = localStorage.getItem(ALERTA_KEY);
    const expira = localStorage.getItem(ALERTA_EXP_KEY);
    let alertasAntigos: Alerta[] = [];
    if (alertaSalvo && expira && Date.now() < Number(expira)) {
      try {
        alertasAntigos = JSON.parse(alertaSalvo);
      } catch {}
    }
    // Junta antigos + novos, removendo duplicados pelo texto
    const todosAlertas = [...alertasAntigos, ...novosAlertas].filter(
      (a, i, arr) => arr.findIndex((b) => b.texto === a.texto) === i
    );
    setAlertas(todosAlertas);
    // Salva no localStorage com expiração de 24h
    localStorage.setItem(ALERTA_KEY, JSON.stringify(todosAlertas));
    localStorage.setItem(
      ALERTA_EXP_KEY,
      (Date.now() + 24 * 60 * 60 * 1000).toString()
    );
  }, [userId]);

  // Expor método para atualizar manualmente
  useImperativeHandle(ref, () => ({ atualizar: fetchAlertas }), [fetchAlertas]);

  // Carrega alertas do localStorage se ainda não expiraram
  useEffect(() => {
    const alertaSalvo = localStorage.getItem(ALERTA_KEY);
    const expira = localStorage.getItem(ALERTA_EXP_KEY);
    if (alertaSalvo && expira && Date.now() < Number(expira)) {
      try {
        setAlertas(JSON.parse(alertaSalvo));
      } catch {
        setAlertas([]);
      }
    } else {
      localStorage.removeItem(ALERTA_KEY);
      localStorage.removeItem(ALERTA_EXP_KEY);
    }
  }, [userId]);

  // Polling para buscar alertas do backend
  useEffect(() => {
    fetchAlertas();
    let interval: NodeJS.Timeout | number | undefined;
    // Removido o polling automático para buscar alertas periodicamente.
    return () => {
      if (interval) clearInterval(interval as number);
    };
  }, [userId, fetchAlertas]);

  if (!alertas.length) return null;

  return (
    <ul className="list-disc pl-6 space-y-2 text-sm">
      {alertas.map((a, i) => (
        <li
          key={i}
          className={
            a.tipo === "erro"
              ? "text-red-600"
              : a.tipo === "sucesso"
              ? "text-green-600"
              : "text-yellow-600"
          }
        >
          {a.texto}
        </li>
      ))}
    </ul>
  );
});
