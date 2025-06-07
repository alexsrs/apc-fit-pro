import React, { useEffect, useState } from "react";

type Alerta = string; // ajuste conforme seu tipo real

const ALERTA_KEY = "alerta_ativo";
const ALERTA_EXP_KEY = "alerta_expira";

export function AlertasPersistente() {
  const [alerta, setAlerta] = useState<Alerta | null>(null);

  // Função para buscar alertas
  async function fetchAlertas() {
    const res = await fetch("/api/alertas");
    const data = await res.json();
    if (data.alertas && data.alertas.length > 0) {
      const novoAlerta = data.alertas[0];
      // Salva alerta e timestamp de expiração no localStorage
      localStorage.setItem(ALERTA_KEY, novoAlerta);
      localStorage.setItem(
        ALERTA_EXP_KEY,
        (Date.now() + 24 * 60 * 60 * 1000).toString()
      );
      setAlerta(novoAlerta);
    }
  }

  // Ao montar, carrega alerta do localStorage se ainda não expirou
  useEffect(() => {
    const alertaSalvo = localStorage.getItem(ALERTA_KEY);
    const expira = localStorage.getItem(ALERTA_EXP_KEY);
    if (alertaSalvo && expira && Date.now() < Number(expira)) {
      setAlerta(alertaSalvo);
    } else {
      localStorage.removeItem(ALERTA_KEY);
      localStorage.removeItem(ALERTA_EXP_KEY);
    }
    // Polling a cada 10 minutos (ajuste se quiser)
    const interval = setInterval(fetchAlertas, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {alerta && (
        <div className="bg-yellow-200 text-yellow-900 p-4 rounded shadow">
          {alerta}
        </div>
      )}
    </div>
  );
}
