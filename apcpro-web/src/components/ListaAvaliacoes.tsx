import { ModalPadrao } from "@/components/ui/ModalPadrao";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { ResultadoAvaliacao } from "./ResultadoAvaliacao";
import { 
  Calendar, 
  Target, 
  FileText, 
  Activity,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import apiClient from "@/lib/api-client";
import { isAvaliacaoVencida, formatarDataValidade } from "@/utils/idade";

// Tipagem alinhada com o componente ResultadoAvaliacao
export type IndicesAvaliacao = Record<string, number | string | undefined>;

export type ResultadoAvaliacao = {
  indices?: IndicesAvaliacao;
  genero?: string;
  riscoCA?: string;
  referenciaCA?: string;
  referenciaRCQ?: string;
  referenciaGC_Marinha?: string; // Referência US Navy
};

// Tipagem básica para avaliação
export type Avaliacao = {
  id: string;
  tipo: string;
  status: string;
  data: string;
  validadeAte?: string;
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
          // Determinar status real (incluindo vencida)
          let statusReal = a.status;
          if (a.status === 'aprovada' && a.validadeAte && isAvaliacaoVencida(a.validadeAte)) {
            statusReal = 'vencida';
          }
          
          let badgeClass = "";
          let badgeText = "";
          let badgeIcon = null;
          
          if (statusReal === "pendente") {
            badgeClass = "bg-yellow-100 text-yellow-700 border border-yellow-200";
            badgeText = "Pendente";
            badgeIcon = <Clock className="h-3 w-3" />;
          } else if (statusReal === "aprovada") {
            badgeClass = "bg-green-100 text-green-700 border border-green-200";
            badgeText = "Aprovada";
            badgeIcon = <CheckCircle className="h-3 w-3" />;
          } else if (statusReal === "reprovada") {
            badgeClass = "bg-red-100 text-red-700 border border-red-200";
            badgeText = "Reprovada";
            badgeIcon = <AlertCircle className="h-3 w-3" />;
          } else if (statusReal === "vencida") {
            badgeClass = "bg-gray-100 text-gray-700 border border-gray-200";
            badgeText = "Vencida";
            badgeIcon = <AlertCircle className="h-3 w-3" />;
          } else {
            badgeClass = "bg-gray-100 text-gray-700 border border-gray-200";
            badgeText = statusReal || "Indefinido";
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
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-500">
                    {new Date(a.data).toLocaleDateString()}
                  </span>
                  {a.validadeAte && a.status !== 'pendente' && (
                    <span className="text-xs text-gray-400">
                      Validade: {formatarDataValidade(a.validadeAte)}
                    </span>
                  )}
                </div>
                <Badge className={`${badgeClass} flex items-center gap-1`}>
                  {badgeIcon}
                  {badgeText}
                </Badge>
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
      <ModalPadrao
        open={!!avaliacaoSelecionada}
        onClose={() => setAvaliacaoSelecionada(null)}
        title="Detalhes da Avaliação"
        description={avaliacaoSelecionada ? `Avaliação de ${avaliacaoSelecionada.tipo} realizada em ${new Date(avaliacaoSelecionada.data).toLocaleDateString('pt-BR')}` : ""}
        maxWidth="xl"
      >
        {avaliacaoSelecionada && (
          <>
            {/* Card com informações gerais */}
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Informações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Activity className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Tipo</p>
                      <p className="text-sm text-gray-600 capitalize">{avaliacaoSelecionada.tipo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Data</p>
                      <p className="text-sm text-gray-600">
                        {new Date(avaliacaoSelecionada.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {avaliacaoSelecionada.status === 'aprovada' || avaliacaoSelecionada.status === 'valida' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : avaliacaoSelecionada.status === 'pendente' ? (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    ) : avaliacaoSelecionada.status === 'reprovada' || avaliacaoSelecionada.status === 'vencida' ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-gray-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">Status</p>
                      <p className="text-sm text-gray-600 capitalize">{avaliacaoSelecionada.status}</p>
                    </div>
                  </div>
                  
                  {avaliacaoSelecionada.objetivo && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Target className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Objetivo</p>
                        <p className="text-sm text-gray-600">{avaliacaoSelecionada.objetivo}</p>
                      </div>
                    </div>
                  )}
                  
                  {avaliacaoSelecionada.validadeAte && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Validade</p>
                        <p className="text-sm text-gray-600">
                          {formatarDataValidade(avaliacaoSelecionada.validadeAte)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Card com resultados */}
            {avaliacaoSelecionada.resultado && (
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Resultados da Avaliação
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {typeof avaliacaoSelecionada.resultado === "object" &&
                  avaliacaoSelecionada.resultado !== null ? (
                    <>
                      <ResultadoAvaliacao
                        resultado={
                          avaliacaoSelecionada.resultado as ResultadoAvaliacao
                        }
                        tipo={avaliacaoSelecionada.tipo}
                        objetivoClassificado={
                          avaliacaoSelecionada.objetivoClassificado
                        }
                        inModal={true}
                      />
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-500">
                        Sem resultado detalhado disponível para esta avaliação.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </ModalPadrao>
    </>
  );
});
