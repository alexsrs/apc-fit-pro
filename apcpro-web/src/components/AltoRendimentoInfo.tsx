import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Target,
  Clock,
  MapPin,
  Users,
  Activity,
  Heart,
  Zap,
  CheckCircle,
  XCircle,
  Award,
} from "lucide-react";

// Tipagem para o resultado de alto rendimento
interface AltoRendimentoResultado {
  bloco4?: {
    objetivo: string;
  };
  atleta?: {
    modalidade: string;
    posicao?: string;
    clube?: string;
    tempoModalidade?: string;
    participaCompeticoes: boolean;
    freqTreinoTecnico?: string;
    freqTreinoFisico?: string;
    lesaoGrave: boolean;
    quaisLesoes?: string;
    cirurgia: boolean;
    quaisCirurgias?: string;
    anoCirurgia?: string;
    acompanhamentoMedico: boolean;
    nomeMedico?: string;
    fisioterapia: boolean;
    metas3meses?: string;
    avaliacoesRecentes?: string;
    localTreino: boolean;
    materialDisponivel?: string;
    tipoTreino?: string;
  };
}

interface AltoRendimentoInfoProps {
  resultado: AltoRendimentoResultado;
}

/**
 * Retorna a cor do badge baseada no valor booleano
 */
function getBadgeColorBoolean(
  value: boolean,
  isPositive: boolean = true
): string {
  if (isPositive) {
    return value
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-gray-100 text-gray-700 border-gray-200";
  } else {
    return value
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-green-100 text-green-700 border-green-200";
  }
}

/**
 * Formata a frequência de treino
 */
function formatarFrequencia(freq: string): string {
  if (!freq) return "Não informado";
  const num = parseInt(freq);
  if (isNaN(num)) return freq;
  return `${num}x por semana`;
}

/**
 * Exibe o resultado da avaliação de alto rendimento esportivo.
 * Este componente utiliza Accordion para exibir informações detalhadas sobre
 * o perfil esportivo, histórico, lesões e metas do atleta.
 */
export function AltoRendimentoInfo({ resultado }: AltoRendimentoInfoProps) {
  const { atleta } = resultado;

  if (!atleta) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-gray-500 text-center">
            Dados do atleta não disponíveis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-800">
            Perfil de Alto Rendimento
          </h3>
          <Trophy className="w-5 h-5 text-yellow-600" />
        </div>

        {/* Informações principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span className="font-semibold text-yellow-800">Modalidade:</span>
            </div>
            <span className="text-sm text-yellow-700">{atleta.modalidade}</span>
            {atleta.posicao && (
              <span className="text-xs text-yellow-600 block">
                Posição: {atleta.posicao}
              </span>
            )}
          </div>

          {atleta.clube && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-800">Clube:</span>
              </div>
              <span className="text-sm text-blue-700">{atleta.clube}</span>
            </div>
          )}
        </div>

        {/* Accordion para informações detalhadas */}
        <Accordion type="single" collapsible className="w-full">
          {/* Histórico Esportivo */}
          <AccordionItem value="historico">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Histórico Esportivo
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {atleta.tempoModalidade && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tempo na modalidade:</span>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {atleta.tempoModalidade}
                    </Badge>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm">Participa de competições:</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={getBadgeColorBoolean(
                        atleta.participaCompeticoes
                      )}
                    >
                      {atleta.participaCompeticoes ? "Sim" : "Não"}
                    </Badge>
                    {atleta.participaCompeticoes ? (
                      <Award className="w-4 h-4 text-green-500" />
                    ) : (
                      <Activity className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>

                {atleta.freqTreinoTecnico && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Treino técnico:</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {formatarFrequencia(atleta.freqTreinoTecnico)}
                    </Badge>
                  </div>
                )}

                {atleta.freqTreinoFisico && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Treino físico:</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {formatarFrequencia(atleta.freqTreinoFisico)}
                    </Badge>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Lesões e Histórico Médico */}
          <AccordionItem value="lesoes">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-600" />
                Lesões e Histórico Médico
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lesão grave:</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={getBadgeColorBoolean(atleta.lesaoGrave, false)}
                    >
                      {atleta.lesaoGrave ? "Sim" : "Não"}
                    </Badge>
                    {atleta.lesaoGrave ? (
                      <XCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>

                {atleta.lesaoGrave && atleta.quaisLesoes && (
                  <div className="ml-4 text-xs text-gray-600">
                    <strong>Quais lesões:</strong> {atleta.quaisLesoes}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm">Cirurgia:</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={getBadgeColorBoolean(atleta.cirurgia, false)}
                    >
                      {atleta.cirurgia ? "Sim" : "Não"}
                    </Badge>
                    {atleta.cirurgia ? (
                      <XCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>

                {atleta.cirurgia && (
                  <div className="ml-4 space-y-1">
                    {atleta.quaisCirurgias && (
                      <div className="text-xs text-gray-600">
                        <strong>Cirurgias:</strong> {atleta.quaisCirurgias}
                      </div>
                    )}
                    {atleta.anoCirurgia && (
                      <div className="text-xs text-gray-600">
                        <strong>Ano:</strong> {atleta.anoCirurgia}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm">Acompanhamento médico:</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={getBadgeColorBoolean(
                        atleta.acompanhamentoMedico
                      )}
                    >
                      {atleta.acompanhamentoMedico ? "Sim" : "Não"}
                    </Badge>
                    {atleta.acompanhamentoMedico ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>

                {atleta.acompanhamentoMedico && atleta.nomeMedico && (
                  <div className="ml-4 text-xs text-gray-600">
                    <strong>Médico:</strong> {atleta.nomeMedico}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm">Fisioterapia:</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={getBadgeColorBoolean(atleta.fisioterapia)}
                    >
                      {atleta.fisioterapia ? "Em tratamento" : "Não"}
                    </Badge>
                    {atleta.fisioterapia ? (
                      <Activity className="w-4 h-4 text-blue-500" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Metas e Expectativas */}
          <AccordionItem value="metas">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                Metas e Expectativas
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {atleta.metas3meses && (
                  <div>
                    <span className="text-sm font-medium">
                      Metas para 3 meses:
                    </span>
                    <p className="text-xs text-gray-600 mt-1 p-2 bg-gray-50 rounded">
                      {atleta.metas3meses}
                    </p>
                  </div>
                )}

                {atleta.avaliacoesRecentes && (
                  <div>
                    <span className="text-sm font-medium">
                      Avaliações recentes:
                    </span>
                    <p className="text-xs text-gray-600 mt-1 p-2 bg-gray-50 rounded">
                      {atleta.avaliacoesRecentes}
                    </p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Logística e Suporte */}
          <AccordionItem value="logistica">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                Logística e Suporte
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Possui local para treino:</span>
                  <div className="flex items-center gap-2">
                    <Badge className={getBadgeColorBoolean(atleta.localTreino)}>
                      {atleta.localTreino ? "Sim" : "Não"}
                    </Badge>
                    {atleta.localTreino ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>

                {atleta.materialDisponivel && (
                  <div>
                    <span className="text-sm font-medium">
                      Material disponível:
                    </span>
                    <p className="text-xs text-gray-600 mt-1 p-2 bg-gray-50 rounded">
                      {atleta.materialDisponivel}
                    </p>
                  </div>
                )}

                {atleta.tipoTreino && (
                  <div>
                    <span className="text-sm font-medium">
                      Tipo de treino preferido:
                    </span>
                    <p className="text-xs text-gray-600 mt-1">
                      {atleta.tipoTreino}
                    </p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Interpretação */}
          <AccordionItem value="interpretacao">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-600" />
                Interpretação
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Perfil de Alto Rendimento:</strong> Este atleta está
                  classificado no programa de alta performance esportiva, com
                  foco em otimização de desempenho específico para sua
                  modalidade.
                </p>

                <p>
                  <strong>Abordagem específica:</strong> O programa será
                  desenvolvido considerando as demandas específicas da
                  modalidade {atleta.modalidade}, histórico de lesões e metas de
                  performance.
                </p>

                {atleta.lesaoGrave || atleta.cirurgia ? (
                  <p className="text-red-600">
                    <strong>Atenção:</strong> Histórico de lesões/cirurgias
                    identificado. Programa será adaptado para prevenção e
                    reabilitação.
                  </p>
                ) : (
                  <p className="text-green-600">
                    <strong>Condição:</strong> Sem histórico significativo de
                    lesões. Foco em prevenção e maximização do desempenho.
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
