// Importação de dependências e utilitários necessários para o componente.
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { getBadgeColor } from "@/utils/badge-utils";

// Definição das classificações de IMC com seus intervalos, rótulos e estilos visuais.
const classificacoes = [
  {
    min: 0,
    max: 18.49,
    label: "Abaixo do peso",
    color: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    keywords: ["abaixo"],
  },
  {
    min: 18.5,
    max: 24.99,
    label: "Peso normal",
    color: "bg-green-100 text-green-700 border border-green-200",
    keywords: ["normal"],
  },
  {
    min: 25,
    max: 29.99,
    label: "Pré-obesidade",
    color: "bg-orange-100 text-orange-700 border border-orange-200",
    keywords: ["pré-obesidade", "sobrepeso"],
  },
  {
    min: 30,
    max: 34.99,
    label: "Obesidade I",
    color: "bg-red-100 text-red-700 border border-red-200",
    keywords: ["obesidade i"],
  },
  {
    min: 35,
    max: 39.99,
    label: "Obesidade II",
    color: "bg-red-200 text-red-800 border border-red-300",
    keywords: ["obesidade ii"],
  },
  {
    min: 40,
    max: Infinity,
    label: "Obesidade III",
    color: "bg-red-300 text-red-900 border border-red-400",
    keywords: ["obesidade iii"],
  },
];

// Tipagem das propriedades esperadas pelo componente.
type ImcInfoProps = {
  imc: number; // Valor do IMC calculado.
  classificacao: string; // Classificação correspondente ao IMC.
};

// Componente principal que exibe informações sobre o IMC calculado e sua classificação.
export function ImcInfo({ imc, classificacao }: ImcInfoProps) {
  return (
    // Card para encapsular o conteúdo do componente com estilização.
    <Card className="mb-4 shadow-sm border border-zinc-200">
      <CardContent className="p-4">
        {/* Exibição do valor calculado do IMC e sua classificação. */}
        <div className="mb-2">
          <h3 className="font-bold text-lg text-zinc-800 mb-1">
            IMC calculado:{" "}
            <span className="text-2xl font-mono">{imc?.toFixed(2)}</span>
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-zinc-700">Classificação:</span>
            {classificacao && classificacao !== "--" ? (
              // Badge para exibir a classificação com estilo dinâmico baseado na função getBadgeColor.
              <Badge
                className={
                  "text-xs font-semibold font-sans px-2 py-0.5 rounded border align-middle " +
                  getBadgeColor(classificacao, classificacoes)
                }
              >
                {classificacao}
              </Badge>
            ) : (
              // Mensagem padrão caso a classificação não esteja disponível.
              <span className="text-zinc-400 ml-2">Não disponível</span>
            )}
          </div>
        </div>

        {/* Accordion para exibir informações adicionais como tabela de classificação, referências e limitações. */}
        <Accordion type="single" collapsible className="w-full mt-2">
          {/* Item do Accordion para exibir a tabela de classificação. */}
          <AccordionItem value="tabela">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                Tabela de classificação
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border mt-2 mb-4">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">IMC</th>
                      <th className="border px-2 py-1">Classificação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Renderização das linhas da tabela com badges para cada classificação. */}
                    {classificacoes.map(({ min, max, label, color }) => (
                      <tr key={label}>
                        <td className="border px-2 py-1">
                          {min === 0 ? `< ${max}` : `${min} – ${max}`}
                        </td>
                        <td className="border px-2 py-1">
                          <Badge className={color}>{label}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Item do Accordion para exibir referências científicas. */}
          <AccordionItem value="referencias">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20h9"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4h9"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4h16v16H4z"
                  />
                </svg>
                Referências científicas
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 text-sm mb-4">
                <li>
                  <a
                    href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    OMS - Obesidade e Sobrepeso
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4869763/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    NCBI - Limitações do IMC
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.verywellhealth.com/body-mass-index-bmi-5184776"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Verywell Health - BMI
                  </a>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Item do Accordion para exibir limitações do IMC. */}
          <AccordionItem value="limitacoes">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20h9"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4h9"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4h16v16H4z"
                  />
                </svg>
                Limitações do IMC
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 text-sm mb-4">
                <li>Não diferencia massa magra de gordura.</li>
                <li>Não avalia a distribuição da gordura corporal.</li>
                <li>
                  Pode superestimar ou subestimar riscos em atletas, idosos e
                  diferentes etnias.
                </li>
                <li>
                  É um indicador populacional, não diagnóstico individual.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
