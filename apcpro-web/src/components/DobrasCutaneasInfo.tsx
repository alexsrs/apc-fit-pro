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
  Ruler,
  Calculator,
  TrendingUp,
  BarChart3,
  CheckCircle,
  Info,
} from "lucide-react";
// ...existing code...
import { ComposicaoCorporalCharts } from "./charts/ComposicaoCorporalCharts";
import { DobrasCutaneasChart } from "./charts/DobrasCutaneasChart";

// Tipagem para o resultado de dobras cutâneas
interface DobrasCutaneasResultado {
  protocolo?: string;
  medidas?: Record<string, number>;
  dataAvaliacao?: string; // Data da avaliação
  resultados?: {
    percentualGordura?: number;
    massaGorda?: number;
    massaMagra?: number;
    massaMuscular?: number;
    musculoEsqueletico?: number;
    classificacao?: string;
    densidade?: number;
    somaDobras?: number;
  };
  pesoAtual?: number;
  genero?: string;
  idade?: number;
}

interface DobrasCutaneasInfoProps {
  resultado: DobrasCutaneasResultado;
}

/**
 * Componente para exibir resultados de dobras cutâneas de forma organizada
 */
export function DobrasCutaneasInfo({ resultado }: DobrasCutaneasInfoProps) {
  const { protocolo, medidas, resultados, pesoAtual } = resultado;

  /**
   * Renderiza uma seção de medidas se houver dados
   */
  const renderMedidas = () => {
    if (!medidas || Object.keys(medidas).length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <Ruler className="w-5 h-5 text-blue-600" />
          Medidas das Dobras Cutâneas
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(medidas).map(([dobra, valor]) => (
            <div
              key={dobra}
              className="bg-blue-50 p-3 rounded-lg border border-blue-200"
            >
              <div className="text-sm font-medium text-blue-800 capitalize mb-1">
                {formatarNomeDobra(dobra)}
              </div>
              <div className="text-lg font-bold text-blue-900">
                {valor}mm
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renderiza os resultados calculados
   */
  const renderResultados = () => {
    if (!resultados) return null;

    const {
      percentualGordura,
      massaGorda,
      massaMagra,
      massaMuscular,
      musculoEsqueletico,
      classificacao,
      densidade,
      somaDobras,
    } = resultados;

    // Debug: verificar valores de composição corporal
    console.log("🔍 DobrasCutaneasInfo - Dados de composição:", {
      massaGorda,
      massaMagra,
      massaMuscular,
      musculoEsqueletico,
      percentualGordura
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <Calculator className="w-5 h-5 text-green-600" />
          Resultados Calculados
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Percentual de Gordura */}
          {percentualGordura !== undefined && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">
                  Percentual de Gordura
                </span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {percentualGordura.toFixed(2)}%
              </div>
              {classificacao && (
                <Badge className={getClassificacaoColor(classificacao)}>
                  {classificacao}
                </Badge>
              )}
            </div>
          )}

          {/* Massa Gorda */}
          {massaGorda !== undefined && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-orange-800">Massa Gorda</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">
                {massaGorda.toFixed(2)} kg
              </div>
            </div>
          )}

          {/* Massa Magra */}
          {massaMagra !== undefined && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-800">Massa Magra</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {massaMagra.toFixed(2)} kg
              </div>
            </div>
          )}

          {/* Massa Muscular */}
          {massaMuscular !== undefined && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Massa Muscular</span>
              </div>
              <div className="text-2xl font-bold text-yellow-900">
                {massaMuscular.toFixed(2)} kg
              </div>
            </div>
          )}

          {/* Músculo Esquelético */}
          {musculoEsqueletico !== undefined && (
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-pink-600" />
                <span className="font-medium text-pink-800">Músculo Esquelético</span>
              </div>
              <div className="text-2xl font-bold text-pink-900">
                {musculoEsqueletico.toFixed(2)} kg
              </div>
            </div>
          )}

          {/* Densidade Corporal */}
          {densidade !== undefined && (
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-indigo-800">
                  Densidade Corporal
                </span>
              </div>
              <div className="text-2xl font-bold text-indigo-900">
                {densidade.toFixed(4)} g/cm³
              </div>
            </div>
          )}

          {/* Soma das Dobras */}
          {somaDobras !== undefined && (
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
              <div className="flex items-center gap-2 mb-2">
                <Ruler className="w-4 h-4 text-teal-600" />
                <span className="font-medium text-teal-800">
                  Soma das Dobras
                </span>
              </div>
              <div className="text-2xl font-bold text-teal-900">
                {somaDobras.toFixed(1)} mm
              </div>
            </div>
          )}

          {/* Peso Atual */}
          {pesoAtual !== undefined && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-gray-800">Peso Atual</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {pesoAtual.toFixed(1)} kg
              </div>
            </div>
          )}
        </div>

        {/* Gráficos estilo FineShape */}
        {percentualGordura !== undefined && massaMagra !== undefined && massaGorda !== undefined && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-semibold text-gray-800">Análise Visual Completa</span>
            </div>
            
            {/* Composição Corporal - Múltiplos gráficos como FineShape */}
            <ComposicaoCorporalCharts
              dados={{
                massaGorda: massaGorda,
                massaMagra: massaMagra,
                massaMuscular: massaMuscular || 0,
                musculoEsqueletico: musculoEsqueletico || 0,
              }}
              peso={massaGorda + massaMagra}
              mostrarTodas={true}
            />
          </div>
        )}

        {/* Gráfico das Dobras Cutâneas */}
        {medidas && Object.keys(medidas).length > 0 && (
          <div className="mt-6">
            <DobrasCutaneasChart
              dobras={medidas}
              orientacao="horizontal"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Ruler className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Resultado das Dobras Cutâneas
          </h2>
          {protocolo && (
            <Badge variant="outline" className="ml-auto">
              Protocolo: {protocolo}
            </Badge>
          )}
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2">
          {/* Medidas das Dobras */}
          {medidas && Object.keys(medidas).length > 0 && (
            <AccordionItem value="medidas" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3">
                <span className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">
                    Medidas das Dobras ({Object.keys(medidas).length} pontos)
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {renderMedidas()}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Resultados Calculados */}
          {resultados && (
            <AccordionItem value="resultados" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3">
                <span className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">Resultados da Análise</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {renderResultados()}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        {/* Informação caso não haja dados */}
        {(!medidas || Object.keys(medidas).length === 0) && !resultados && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Info className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">
                Nenhum dado de dobras cutâneas disponível
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Formata o nome da dobra para exibição
 */
function formatarNomeDobra(nome: string): string {
  const nomes: Record<string, string> = {
    triceps: "Tríceps",
    biceps: "Bíceps",
    subescapular: "Subescapular",
    suprailiaca: "Supra-ilíaca",
    abdominal: "Abdominal",
    coxa: "Coxa",
    panturrilha: "Panturrilha",
    axilarMedia: "Axilar Média",
    peitoral: "Peitoral",
    // Adicione outros nomes conforme necessário
  };

  return nomes[nome] || nome.charAt(0).toUpperCase() + nome.slice(1);
}

/**
 * Retorna a cor do badge baseada na classificação
 */
function getClassificacaoColor(classificacao: string): string {
  const classificacaoLower = classificacao.toLowerCase();

  if (classificacaoLower.includes("excelente") || classificacaoLower.includes("atlético")) {
    return "bg-green-100 text-green-800 border-green-200";
  }
  if (classificacaoLower.includes("bom") || classificacaoLower.includes("boa")) {
    return "bg-blue-100 text-blue-800 border-blue-200";
  }
  if (classificacaoLower.includes("médio") || classificacaoLower.includes("media")) {
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }
  if (classificacaoLower.includes("alto") || classificacaoLower.includes("elevado")) {
    return "bg-orange-100 text-orange-800 border-orange-200";
  }
  if (classificacaoLower.includes("muito alto") || classificacaoLower.includes("obesidade")) {
    return "bg-red-100 text-red-800 border-red-200";
  }

  return "bg-gray-100 text-gray-800 border-gray-200";
}
