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
  Target,
  Heart,
  Activity,
  Moon,
  Brain,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";

// Tipagem para o resultado de triagem
interface TriagemResultado {
  bloco2?: {
    doencaDiagnosticada: boolean;
    quaisDoencas?: string;
    medicacaoContinua: boolean;
    quaisMedicacoes?: string;
    cirurgiaRecente: boolean;
    quaisCirurgias?: string;
  };
  bloco3?: {
    praticaAtividade: boolean;
    qualAtividade?: string;
    frequencia: string;
  };
  bloco4?: {
    objetivo: string;
  };
  bloco5?: {
    horasSono: number;
    qualidadeSono: number;
    nivelEstresse: string;
  };
}

interface TriagemInfoProps {
  resultado: TriagemResultado;
  objetivoClassificado?: string;
}

/**
 * Retorna a cor do badge baseada no nível de risco ou categoria
 */
function getBadgeColor(
  value: string | boolean | number,
  type: "health" | "activity" | "stress" | "sleep"
): string {
  switch (type) {
    case "health":
      return value
        ? "bg-red-100 text-red-700 border-red-200"
        : "bg-green-100 text-green-700 border-green-200";
    case "activity":
      return value
        ? "bg-green-100 text-green-700 border-green-200"
        : "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "stress":
      const stress = value as string;
      if (stress === "Baixo")
        return "bg-green-100 text-green-700 border-green-200";
      if (stress === "Moderado")
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      return "bg-red-100 text-red-700 border-red-200";
    case "sleep":
      const quality = value as number;
      if (quality >= 4) return "bg-green-100 text-green-700 border-green-200";
      if (quality >= 3)
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

/**
 * Converte o texto do objetivo para um formato mais legível
 */
function formatarObjetivo(objetivo: string): string {
  const objetivos: Record<string, string> = {
    "Melhorar ou controlar uma doença crônica": "Controle de Doença",
    "Melhorar minha disposição, qualidade de vida e envelhecer com saúde":
      "Saúde e Bem-estar",
    "Reduzir gordura corporal, melhorar a estética ou ganhar massa muscular":
      "Estética / Hipertrofia",
    "Alto rendimento esportivo": "Alto Rendimento",
  };
  return objetivos[objetivo] || objetivo;
}

/**
 * Exibe o resultado da triagem inicial.
 * Este componente utiliza Accordion para exibir informações detalhadas sobre
 * saúde, atividade física, objetivos e bem-estar do usuário.
 */
export function TriagemInfo({
  resultado,
  objetivoClassificado,
}: TriagemInfoProps) {
  const { bloco2, bloco3, bloco4, bloco5 } = resultado;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-800">
            Triagem Inicial
          </h3>
          <Target className="w-5 h-5 text-blue-600" />
        </div>

        {/* Objetivo Classificado */}
        {objetivoClassificado && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-800">
                Objetivo Classificado:
              </span>
            </div>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              {objetivoClassificado}
            </Badge>
          </div>
        )}

        {/* Objetivo Declarado */}
        {bloco4?.objetivo && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Info className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-700">
                Objetivo Declarado:
              </span>
            </div>
            <span className="text-sm text-gray-600">
              {formatarObjetivo(bloco4.objetivo)}
            </span>
          </div>
        )}

        {/* Accordion para informações detalhadas */}
        <Accordion type="single" collapsible className="w-full">
          {/* Estado de Saúde */}
          {bloco2 && (
            <AccordionItem value="saude">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  Estado de Saúde
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Doença diagnosticada:</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={getBadgeColor(
                          bloco2.doencaDiagnosticada,
                          "health"
                        )}
                      >
                        {bloco2.doencaDiagnosticada ? "Sim" : "Não"}
                      </Badge>
                      {bloco2.doencaDiagnosticada ? (
                        <XCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>

                  {bloco2.doencaDiagnosticada && bloco2.quaisDoencas && (
                    <div className="ml-4 text-xs text-gray-600">
                      <strong>Quais:</strong> {bloco2.quaisDoencas}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Medicação contínua:</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={getBadgeColor(
                          bloco2.medicacaoContinua,
                          "health"
                        )}
                      >
                        {bloco2.medicacaoContinua ? "Sim" : "Não"}
                      </Badge>
                      {bloco2.medicacaoContinua ? (
                        <XCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>

                  {bloco2.medicacaoContinua && bloco2.quaisMedicacoes && (
                    <div className="ml-4 text-xs text-gray-600">
                      <strong>Quais:</strong> {bloco2.quaisMedicacoes}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cirurgia recente (2 anos):</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={getBadgeColor(
                          bloco2.cirurgiaRecente,
                          "health"
                        )}
                      >
                        {bloco2.cirurgiaRecente ? "Sim" : "Não"}
                      </Badge>
                      {bloco2.cirurgiaRecente ? (
                        <XCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>

                  {bloco2.cirurgiaRecente && bloco2.quaisCirurgias && (
                    <div className="ml-4 text-xs text-gray-600">
                      <strong>Quais:</strong> {bloco2.quaisCirurgias}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Atividade Física */}
          {bloco3 && (
            <AccordionItem value="atividade">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  Atividade Física
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pratica atividade física:</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={getBadgeColor(
                          bloco3.praticaAtividade,
                          "activity"
                        )}
                      >
                        {bloco3.praticaAtividade ? "Sim" : "Não"}
                      </Badge>
                      {bloco3.praticaAtividade ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>

                  {bloco3.praticaAtividade && (
                    <>
                      {bloco3.qualAtividade && (
                        <div className="ml-4 text-xs text-gray-600">
                          <strong>Atividade:</strong> {bloco3.qualAtividade}
                        </div>
                      )}
                      <div className="ml-4 text-xs text-gray-600">
                        <strong>Frequência:</strong> {bloco3.frequencia}
                      </div>
                    </>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Bem-estar */}
          {bloco5 && (
            <AccordionItem value="bem-estar">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-purple-600" />
                  Sono e Bem-estar
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Horas de sono por noite:</span>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {bloco5.horasSono}h
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Qualidade do sono:</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={getBadgeColor(bloco5.qualidadeSono, "sleep")}
                      >
                        {bloco5.qualidadeSono}/5
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {bloco5.qualidadeSono >= 4
                          ? "Boa"
                          : bloco5.qualidadeSono >= 3
                          ? "Regular"
                          : "Ruim"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nível de estresse:</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={getBadgeColor(
                          bloco5.nivelEstresse,
                          "stress"
                        )}
                      >
                        {bloco5.nivelEstresse}
                      </Badge>
                      <Brain className="w-4 h-4 text-purple-500" />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Interpretação */}
          <AccordionItem value="interpretacao">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                Interpretação
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Triagem Inicial:</strong> Esta avaliação identifica o
                  perfil básico de saúde e atividade física para direcionamento
                  adequado do programa de exercícios.
                </p>

                {objetivoClassificado && (
                  <p>
                    <strong>Classificação automática:</strong> O sistema
                    analisou suas respostas e classificou automaticamente seu
                    objetivo principal como{" "}
                    <strong>{objetivoClassificado}</strong>.
                  </p>
                )}

                <p>
                  <strong>Próximos passos:</strong> Com base nesta triagem, será
                  desenvolvido um plano personalizado de exercícios adequado ao
                  seu perfil e objetivos.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
