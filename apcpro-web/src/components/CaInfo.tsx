import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getBadgeColor } from "@/utils/badge-utils";
import { Table, BookOpen, FlaskConical } from "lucide-react";

/**
 * Exibe o resultado da avaliação de Circunferência Abdominal (CA).
 * Este componente utiliza Accordion para exibir informações detalhadas, como tabela de classificação,
 * referências científicas e aplicação prática.
 */
export function CaInfo({ resultado }: CaInfoProps) {
  return (
    <Card className="mb-4 shadow-sm border border-zinc-200">
      <CardContent className="p-4">
        {/* Exibição do valor calculado de CA */}
        <div className="mb-2">
          <h3 className="font-bold text-lg text-zinc-800 mb-1">
            Circunferência abdominal:{" "}
            <span className="text-2xl font-mono">{resultado.valor} cm</span>
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-zinc-700">Classificação:</span>
            <Badge
              className={
                "text-xs font-semibold font-sans px-2 py-0.5 rounded border align-middle " +
                getBadgeColor(resultado.classificacao, classificacoes)
              }
            >
              {resultado.classificacao}
            </Badge>
          </div>
        </div>

        {/* Accordion para informações adicionais */}
        <Accordion type="single" collapsible className="w-full mt-2">
          {/* Tabela de classificação */}
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
                      <th className="border px-2 py-1">Gênero</th>
                      <th className="border px-2 py-1">Baixo risco</th>
                      <th className="border px-2 py-1">Risco aumentado</th>
                      <th className="border px-2 py-1">
                        Risco muito aumentado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-2 py-1">Masculino</td>
                      <td className="border px-2 py-1">
                        <Badge className="bg-green-100 text-green-700 border border-green-200">
                          {"< 94 cm"}
                        </Badge>
                      </td>
                      <td className="border px-2 py-1">
                        <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">
                          {"94–101 cm"}
                        </Badge>
                      </td>
                      <td className="border px-2 py-1">
                        <Badge className="bg-red-100 text-red-700 border border-red-200">
                          {"≥ 102 cm"}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1">Feminino</td>
                      <td className="border px-2 py-1">
                        <Badge className="bg-green-100 text-green-700 border border-green-200">
                          {"< 80 cm"}
                        </Badge>
                      </td>
                      <td className="border px-2 py-1">
                        <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">
                          {"80–87 cm"}
                        </Badge>
                      </td>
                      <td className="border px-2 py-1">
                        <Badge className="bg-red-100 text-red-700 border border-red-200">
                          {"≥ 88 cm"}
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Referências científicas */}
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
                  <a
                    href="https://www.who.int/europe/news-room/fact-sheets/item/a-healthy-lifestyle---who-recommendations"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    OMS - Circunferência abdominal e risco cardiometabólico
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    NCBI - Waist Circumference and Health Risk
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.scielo.br/j/rbme/a/8k6k6w6w6w6w6w6w6w/?lang=pt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    SciELO - Utilidade clínica da circunferência abdominal
                  </a>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Aplicação prática */}
          <AccordionItem value="aplicacao">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-blue-600" />
                Aplicação
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 text-sm mb-4">
                <li>
                  A circunferência abdominal (CA) é um marcador simples e
                  prático para estimar a gordura abdominal, associada ao risco
                  cardiovascular e metabólico.
                </li>
                <li>
                  Valores elevados de CA indicam maior risco de doenças como
                  diabetes tipo 2, hipertensão e doenças cardíacas.
                </li>
                <li>
                  A CA complementa o IMC, pois avalia a distribuição da gordura
                  corporal, especialmente a visceral.
                </li>
                <li>
                  Recomenda-se medir a CA no ponto médio entre a última costela
                  e a crista ilíaca, com a fita paralela ao solo.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

/**
 * Propriedades esperadas pelo componente CaInfo.
 */
type CaInfoProps = {
  resultado: {
    valor: number;
    classificacao: string;
    risco: string;
    referencia: string;
    aplicacao?: string[]; // Adicionado para suportar a seção de aplicação.
  };
};

/**
 * Classificações possíveis para CA, com suas cores e palavras-chave associadas.
 */
const classificacoes = [
  {
    label: "Baixo risco",
    color: "bg-green-100 text-green-700 border border-green-200",
    keywords: ["baixo"],
  },
  {
    label: "Risco aumentado",
    color: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    keywords: ["aumentado"],
  },
  {
    label: "Risco muito aumentado",
    color: "bg-red-100 text-red-700 border border-red-200",
    keywords: ["muito aumentado"],
  },
];
