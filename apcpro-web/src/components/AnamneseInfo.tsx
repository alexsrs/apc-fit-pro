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
  History,
  Heart,
  Settings,
  AlertTriangle,
  User,
  CheckCircle,
  Info,
} from "lucide-react";

// Tipagem para o resultado de anamnese
interface AnamneseResultado {
  historicoTreino?: {
    experienciaAnterior?: string;
    preferenciasAtividades?: string;
    frequenciaHorarios?: string;
  };
  preferenciasIndividuais?: {
    tiposIntensidade?: string;
    local?: string;
    equipamentos?: string;
  };
  lesoesLimitacoes?: {
    historicoClinico?: string;
    doresArticulares?: boolean;
    doresArticularesDetalhe?: string;
    limitacoesMovimento?: boolean;
    limitacoesMovimentoDetalhe?: string;
  };
  estiloVidaRecuperacao?: {
    suplementacao?: string;
    alimentacao?: string;
    recuperacaoPosTreino?: string;
  };
}

interface AnamneseInfoProps {
  resultado: AnamneseResultado;
}

/**
 * Componente para exibir resultados de anamnese de forma organizada
 */
export function AnamneseInfo({ resultado }: AnamneseInfoProps) {
  // Debug: Log dos dados recebidos
  console.log("🔍 AnamneseInfo - Dados recebidos:", resultado);
  console.log("🔍 AnamneseInfo - historicoTreino:", resultado.historicoTreino);
  console.log(
    "🔍 AnamneseInfo - preferenciasIndividuais:",
    resultado.preferenciasIndividuais
  );
  console.log(
    "🔍 AnamneseInfo - lesoesLimitacoes:",
    resultado.lesoesLimitacoes
  );
  console.log(
    "🔍 AnamneseInfo - estiloVidaRecuperacao:",
    resultado.estiloVidaRecuperacao
  );

  /**
   * Renderiza um badge baseado em um valor booleano
   */
  const renderBooleanBadge = (
    value: boolean,
    positiveText: string,
    negativeText: string
  ) => {
    if (value) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          {positiveText}
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        {negativeText}
      </Badge>
    );
  };

  /**
   * Renderiza uma seção de informações se houver dados
   */
  const renderSection = (
    title: string,
    data: Record<string, unknown>,
    icon: React.ReactNode
  ) => {
    const hasData = Object.values(data || {}).some(
      (value) => value !== undefined && value !== null && value !== ""
    );

    if (!hasData) return null;

    return (
      <div className="grid gap-2">
        {Object.entries(data || {}).map(([key, value]) => {
          if (value === undefined || value === null || value === "")
            return null;

          const fieldName = getFieldDisplayName(key);

          return (
            <div key={key} className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">
                {fieldName}:
              </span>
              {typeof value === "boolean" ? (
                <div className="ml-2">
                  {key.includes("dores") &&
                    renderBooleanBadge(value, "Relata dores", "Sem dores")}
                  {key.includes("limitacoes") &&
                    renderBooleanBadge(
                      value,
                      "Possui limitações",
                      "Sem limitações"
                    )}
                  {!key.includes("dores") &&
                    !key.includes("limitacoes") &&
                    renderBooleanBadge(value, "Sim", "Não")}
                </div>
              ) : (
                <p className="text-sm text-gray-600 ml-2 bg-gray-50 p-2 rounded">
                  {String(value)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // JSX principal movido para dentro da função
  return (
    <Card className="shadow-md border">
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {/* Histórico de Treino */}
          {resultado.historicoTreino && (
            <AccordionItem value="historico" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3">
                <span className="flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Histórico de Treino</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {renderSection(
                  "Histórico de Treino",
                  resultado.historicoTreino,
                  <History className="w-5 h-5 text-blue-600" />
                )}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Preferências Individuais */}
          {resultado.preferenciasIndividuais && (
            <AccordionItem value="preferencias" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3">
                <span className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">
                    Preferências Individuais
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {renderSection(
                  "Preferências Individuais",
                  resultado.preferenciasIndividuais,
                  <Settings className="w-5 h-5 text-green-600" />
                )}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Lesões e Limitações */}
          {resultado.lesoesLimitacoes && (
            <AccordionItem
              value="lesoes-limitacoes"
              className="border rounded-lg"
            >
              <AccordionTrigger className="px-4 py-3">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold">Lesões e Limitações</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {renderSection(
                  "Lesões e Limitações",
                  resultado.lesoesLimitacoes,
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Estilo de Vida e Recuperação */}
          {resultado.estiloVidaRecuperacao && (
            <AccordionItem value="estilo-vida" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3">
                <span className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold">
                    Estilo de Vida e Recuperação
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {renderSection(
                  "Estilo de Vida e Recuperação",
                  resultado.estiloVidaRecuperacao,
                  <Heart className="w-5 h-5 text-purple-600" />
                )}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        {/* Informação caso não haja dados */}
        {!resultado.historicoTreino &&
          !resultado.preferenciasIndividuais &&
          !resultado.lesoesLimitacoes &&
          !resultado.estiloVidaRecuperacao && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Info className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">
                  Nenhum dado de anamnese disponível
                </p>
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
}

/**
 * Converte o nome do campo técnico para um nome mais amigável
 */
function getFieldDisplayName(fieldName: string): string {
  const displayNames: Record<string, string> = {
    experienciaAnterior: "Experiência Anterior",
    preferenciasAtividades: "Preferências de Atividades",
    frequenciaHorarios: "Frequência e Horários",
    tiposIntensidade: "Tipos de Intensidade",
    local: "Local de Treino",
    equipamentos: "Equipamentos",
    historicoClinico: "Histórico Clínico",
    doresArticulares: "Dores Articulares",
    doresArticularesDetalhe: "Detalhes das Dores Articulares",
    limitacoesMovimento: "Limitações de Movimento",
    limitacoesMovimentoDetalhe: "Detalhes das Limitações",
    suplementacao: "Suplementação",
    alimentacao: "Alimentação",
    recuperacaoPosTreino: "Recuperação Pós-Treino",
  };

  return displayNames[fieldName] || fieldName;
}
