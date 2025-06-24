import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { ResultadoAvaliacao } from "./ResultadoAvaliacao";
import { PercentualGorduraInfo } from "./PercentualGorduraInfo";
import apiClient from "@/lib/api-client";

// Atualizar a tipagem para incluir as propriedades esperadas
export type ResultadoAvaliacao = {
  percentualGC_Marinha?: number;
  classificacaoGC_Marinha?: string;
  [key: string]: unknown; // Permite outras propriedades dinâmicas
};

// Tipagem básica para avaliação
export type Avaliacao = {
  id: string;
  tipo: string;
  status: string;
  data: string;
  objetivo?: string;
  objetivoClassificado?: string;
  resultado?: ResultadoAvaliacao | string | number | null;
};

interface ListaAvaliacoesProps {
  userPerfilId: string;
}

export interface ListaAvaliacoesHandle {
  refetch: () => void;
}

export const ListaAvaliacoes = forwardRef<
  ListaAvaliacoesHandle,
  ListaAvaliacoesProps
>(function ListaAvaliacoes({ userPerfilId }, ref) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandir, setExpandir] = useState(false);
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] =
    useState<Avaliacao | null>(null);

  const fetchAvaliacoes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`alunos/${userPerfilId}/avaliacoes`);
      setAvaliacoes(res.data);
    } catch {
      setAvaliacoes([]);
    }
    setLoading(false);
  }, [userPerfilId]);

  useImperativeHandle(ref, () => ({
    refetch: fetchAvaliacoes,
  }));

  useEffect(() => {
    if (userPerfilId) fetchAvaliacoes();
  }, [userPerfilId, fetchAvaliacoes]);

  // Agrupa por tipo e pega a mais recente de cada tipo
  const avaliacoesAgrupadas = useMemo(() => {
    if (expandir) return avaliacoes;
    const map = new Map<string, Avaliacao>();
    avaliacoes
      .slice()
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .forEach((a) => {
        if (!map.has(a.tipo)) {
          map.set(a.tipo, a);
        }
      });
    return Array.from(map.values());
  }, [avaliacoes, expandir]);

  if (loading) return <div>Carregando avaliações...</div>;
  if (!avaliacoes.length) return <div>Nenhuma avaliação encontrada.</div>;

  return (
    <>
      <ul className="divide-y divide-gray-200">
        {avaliacoesAgrupadas.map((a) => {
          let badgeClass = "";
          let badgeText = "";
          if (a.status === "pendente") {
            badgeClass =
              "bg-orange-100 text-orange-700 border border-orange-200";
            badgeText = "Pendente";
          } else if (a.status === "valida") {
            badgeClass = "bg-green-100 text-green-700 border border-green-200";
            badgeText = "Válida";
          } else if (a.status === "vencida") {
            badgeClass = "bg-red-100 text-red-700 border border-red-200";
            badgeText = "Vencida";
          } else {
            badgeClass = "bg-gray-100 text-gray-700 border border-gray-200";
            badgeText = a.status;
          }
          return (
            <li
              key={a.id}
              className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
            >
              <div className="flex flex-1 items-center min-w-0">
                <span className="font-medium truncate max-w-[120px]">
                  {a.tipo}
                </span>
                {a.objetivo && (
                  <span className="ml-2 text-xs text-blue-600 truncate max-w-[120px]">
                    Objetivo: {a.objetivo}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 min-w-fit md:justify-end md:text-right">
                <span className="text-xs text-gray-500">
                  {new Date(a.data).toLocaleDateString()}
                </span>
                <Badge className={badgeClass}>{badgeText}</Badge>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAvaliacaoSelecionada(a)}
              >
                Ver detalhes
              </Button>
            </li>
          );
        })}
      </ul>
      {avaliacoes.length > avaliacoesAgrupadas.length || expandir ? (
        <div className="flex justify-center mt-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setExpandir((v) => !v)}
            aria-label={expandir ? "Ver menos" : "Ver todas"}
          >
            {expandir ? "Ver menos" : "Ver todas"}
          </Button>
        </div>
      ) : null}
      {/* Modal de detalhes da avaliação */}
      <Dialog
        open={!!avaliacaoSelecionada}
        onOpenChange={() => setAvaliacaoSelecionada(null)}
      >
        <DialogContent
          style={{ maxWidth: "1200px", width: "50vw" }}
          className="!max-w-none !w-[50vw] overflow-y-auto max-h-[80vh] p-4"
        >
          <DialogHeader>
            <DialogTitle>Detalhes da Avaliação</DialogTitle>
          </DialogHeader>
          {avaliacaoSelecionada && (
            <div className="space-y-2">
              {/* Conteúdo do modal */}
              {avaliacaoSelecionada.resultado && (
                <>
                  <h4 className="font-semibold mt-4 mb-2 text-sm text-zinc-700">
                    Resultado:
                  </h4>
                  {typeof avaliacaoSelecionada.resultado === "object" &&
                  avaliacaoSelecionada.resultado !== null ? (
                    <ResultadoAvaliacao
                      resultado={avaliacaoSelecionada.resultado as any}
                    />
                  ) : (
                    <span className="text-sm text-gray-500">
                      Sem resultado detalhado.
                    </span>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
});
