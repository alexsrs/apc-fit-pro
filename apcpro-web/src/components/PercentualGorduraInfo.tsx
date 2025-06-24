// Importação de dependências e utilitários necessários para o componente.
import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { renderBadge } from "@/utils/badge-utils";
import { Table, BookOpen, FlaskConical } from "lucide-react"; // Ajustando os ícones para padronização.

/**
 * Exibe o resultado da avaliação do Percentual de Gordura Corporal (Marinha).
 * @param valor Percentual de gordura calculado.
 * @param classificacao Classificação correspondente ao percentual.
 * @param referencia Referência utilizada para o cálculo.
 */
export interface PercentualGorduraInfoProps {
  valor: number; // Valor do percentual de gordura corporal.
  classificacao: string; // Classificação do percentual de gordura.
  referencia: string; // Referência científica ou método utilizado.
}

// Definição das classificações de percentual de gordura com seus rótulos, estilos e palavras-chave.
const classificacoes = [
  {
    label: "Essencial",
    color: "bg-green-100 text-green-700 border border-green-200",
    keywords: ["essencial", "2–5%", "10–13%"],
  },
  {
    label: "Atletas",
    color: "bg-green-100 text-green-700 border border-green-200",
    keywords: ["atleta", "atletas", "6–13%", "14–20%"],
  },
  {
    label: "Fitness",
    color: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    keywords: ["fitness", "14–17%", "21–24%"],
  },
  {
    label: "Média",
    color: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    keywords: ["média", "media", "18–24%", "25–31%"],
  },
  {
    label: "Obeso",
    color: "bg-red-100 text-red-700 border border-red-200",
    keywords: ["obeso", "alto", "≥ 25%", ">= 25", "≥ 32%", ">= 32"],
  },
];

// Componente principal que exibe informações sobre o percentual de gordura corporal.
export function PercentualGorduraInfo({
  valor,
  classificacao,
  referencia,
}: PercentualGorduraInfoProps) {
  return (
    // Card para encapsular o conteúdo do componente com estilização.
    <Card className="mb-4 shadow-sm border border-zinc-200">
      <CardContent className="p-4">
        {/* Exibição do valor calculado do percentual de gordura e sua classificação. */}
        <div className="mb-2">
          <h3 className="font-bold text-lg text-zinc-800 mb-1">
            Percentual de Gordura Corporal (Marinha):{" "}
            <span className="text-2xl font-mono">{valor.toFixed(2)}%</span>
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-zinc-700">Classificação:</span>
            {renderBadge(
              classificacao && classificacao !== "--"
                ? classificacao
                : "Não disponível",
              classificacoes
            )}
          </div>
        </div>

        {/* Accordion para exibir informações adicionais como tabela de classificação, referências e aplicação. */}
        <Accordion type="single" collapsible className="w-full mt-2">
          {/* Item do Accordion para exibir a tabela de classificação. */}
          <AccordionItem value="tabela">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Table className="w-4 h-4 text-blue-600" />
                Tabela de classificação
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border mt-2 mb-4">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">Classificação</th>
                      <th className="border px-2 py-1">Homens</th>
                      <th className="border px-2 py-1">Mulheres</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Renderização das linhas da tabela com badges para cada classificação. */}
                    {classificacoes.map(({ label, keywords }) => (
                      <tr key={label}>
                        <td className="border px-2 py-1">
                          {renderBadge(label, classificacoes)}
                        </td>
                        <td className="border px-2 py-1">
                          {renderBadge(keywords[1], classificacoes)}
                        </td>
                        <td className="border px-2 py-1">
                          {renderBadge(keywords[2], classificacoes)}
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
                <BookOpen className="w-4 h-4 text-blue-600" />
                Referências científicas
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 text-sm mb-4">
                <li>
                  Hodgdon, J. A., & Beckett, M. B. (1984). Prediction of body
                  density using Navy equations.{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Body_fat_percentage"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Wikipedia
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4869763/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    NCBI - Percentual de Gordura Corporal
                  </a>
                </li>
                <li>
                  <a
                    href="https://10dglab.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    10DG Lab
                  </a>
                </li>
                <li>
                  <a
                    href="https://portalrevistas.ucb.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Portal Revistas UCB
                  </a>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Item do Accordion para exibir aplicação prática do percentual de gordura. */}
          <AccordionItem value="aplicacao">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-blue-600" />
                Aplicação
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 text-sm mb-4">
                <li>Indicador de saúde metabólica e cardiovascular.</li>
                <li>Útil para monitoramento de atletas e pacientes.</li>
                <li>
                  Complementa o IMC para avaliação de composição corporal.
                </li>
                <li>
                  Baseado no método da Marinha dos EUA, validado
                  cientificamente.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
