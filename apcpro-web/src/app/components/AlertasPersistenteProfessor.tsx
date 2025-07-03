import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import type { AlertaInteligente } from "../../hooks/useAlertasInteligentes";
import Modal from "@/components/ui/modal";
import { ResultadoAvaliacao } from "@/components/ResultadoAvaliacao";
import apiClient from "@/lib/api-client";

const ALERTA_KEY = "alerta_professor_ativo";
const ALERTA_EXP_KEY = "alerta_professor_expira";

export type Alerta = {
  mensagem: string | object;
  texto: string;
  tipo: string;
  avaliacaoId?: string;
};

// Função utilitária para formatar a mensagem do alerta
function formatarMensagem(texto: string | object | undefined | null): React.ReactNode {
  if (!texto) return "";
  
  // Se for um objeto, tenta extrair mensagem
  if (typeof texto === "object" && texto !== null) {
    const obj = texto as Record<string, unknown>;
    if (obj.mensagem && typeof obj.mensagem === "string") return obj.mensagem;
    if (obj.texto && typeof obj.texto === "string") return obj.texto;
    return JSON.stringify(texto);
  }
  
  if (typeof texto !== "string") return "";
  
  // Se vier JSON como string, tenta parsear e exibir de forma amigável
  try {
    const obj = JSON.parse(texto);
    if (typeof obj === "object" && obj !== null) {
      if (obj.mensagem) return obj.mensagem;
      if (obj.texto) return obj.texto;
      return JSON.stringify(obj);
    }
  } catch {}
  // Remove prefixo [user:xxx] se existir
  return texto.replace(/^\[user:[^\]]+\]\s*/, "");
}

type AvaliacaoResultado = {
  peso?: number;
  altura?: number;
  imc?: number;
  gorduraCorporal?: number;
  massaMuscular?: number;
  observacoes?: string;
  [key: string]: unknown;
} | null; // Tipagem mais específica para resultado da API

export type AlertasPersistenteProfessorHandle = {
  atualizar: () => void;
};

export const AlertasPersistenteProfessor = forwardRef<
  AlertasPersistenteProfessorHandle,
  { userId: string }
>(function AlertasPersistenteProfessor({ userId }, ref) {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingAvaliacao, setLoadingAvaliacao] = useState(false);
  const [avaliacaoResultado, setAvaliacaoResultado] =
    useState<AvaliacaoResultado | null>(null);
  const [avaliacaoTipo, setAvaliacaoTipo] = useState<string | undefined>(
    undefined
  );
  const [avaliacaoObjetivo, setAvaliacaoObjetivo] = useState<
    string | undefined
  >(undefined);

  // Função para buscar alertas do backend
  const fetchAlertas = useCallback(async () => {
    const res = await fetch(`/api/alertas?userId=${userId}`);
    const data = await res.json();
    let novosAlertas: Alerta[] = [];
    if (data.alertas && data.alertas.length > 0) {
      novosAlertas = data.alertas.map((alerta: AlertaInteligente) => {
        let mensagem = alerta.mensagem;
        let avaliacaoId = alerta.avaliacaoId;
        // Se mensagem for um JSON stringificado, parseia
        if (typeof mensagem === "string") {
          try {
            const obj = JSON.parse(mensagem);
            if (typeof obj === "object" && obj !== null) {
              mensagem = obj.mensagem || mensagem;
              avaliacaoId = obj.avaliacaoId || avaliacaoId;
            }
          } catch {}
        }
        // Remove prefixo [user:xxx] se existir, mesmo se já veio "limpo"
        let mensagemFormatada = mensagem;
        if (typeof mensagemFormatada === "string") {
          mensagemFormatada = mensagemFormatada.replace(
            /^\[user:[^\]]+\]\s*/,
            ""
          );
        }
        // Garante que não há prefixo também no texto (caso backend envie em outro campo)
        let textoFormatado = mensagemFormatada;
        if (typeof textoFormatado === "string") {
          textoFormatado = textoFormatado.replace(/^\[user:[^\]]+\]\s*/, "");
        }
        return {
          mensagem: mensagemFormatada,
          texto: textoFormatado,
          tipo:
            typeof textoFormatado === "string" &&
            textoFormatado.toLowerCase().includes("erro")
              ? "erro"
              : typeof textoFormatado === "string" &&
                textoFormatado.toLowerCase().includes("parabéns")
              ? "sucesso"
              : "aviso",
          avaliacaoId,
        };
      });
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
      (a, i, arr) =>
        arr.findIndex(
          (b) => b.mensagem === a.mensagem && b.avaliacaoId === a.avaliacaoId
        ) === i
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

  // Busca inicial (sem polling automático)
  useEffect(() => {
    fetchAlertas();
  }, [userId, fetchAlertas]);

  if (!alertas.length) return null;

  // Função para buscar avaliação e abrir modal
  const handleAbrirAvaliacao = async (avaliacaoId?: string) => {
    if (!avaliacaoId) return;
    setLoadingAvaliacao(true);
    setModalOpen(true);
    try {
      // Busca avaliação pelo ID (ajuste a rota conforme backend)
      const res = await apiClient.get(`/avaliacoes/${avaliacaoId}`);
      setAvaliacaoResultado(res.data?.resultado || res.data);
      setAvaliacaoTipo(res.data?.tipo);
      setAvaliacaoObjetivo(res.data?.objetivoClassificado);
    } catch {
      setAvaliacaoResultado(null);
    } finally {
      setLoadingAvaliacao(false);
    }
  };

  return (
    <>
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
            {a.avaliacaoId ? (
              <button
                type="button"
                className="underline text-blue-600 hover:text-blue-800 cursor-pointer bg-transparent border-0 p-0"
                onClick={() => handleAbrirAvaliacao(a.avaliacaoId)}
                aria-label="Ver resultado da avaliação"
              >
                {formatarMensagem(a.mensagem)}
              </button>
            ) : (
              formatarMensagem(a.mensagem)
            )}
          </li>
        ))}
      </ul>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {loadingAvaliacao ? (
          <div className="p-8 text-center">Carregando avaliação...</div>
        ) : avaliacaoResultado ? (
          <ResultadoAvaliacao
            resultado={avaliacaoResultado}
            inModal
            tipo={avaliacaoTipo}
            objetivoClassificado={avaliacaoObjetivo}
          />
        ) : (
          <div className="p-8 text-center text-red-600">
            Não foi possível carregar o resultado da avaliação.
          </div>
        )}
      </Modal>
    </>
  );
});
