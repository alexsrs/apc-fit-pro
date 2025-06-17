import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ImcClassificacaoModal } from "./ImcClassificacaoModal"; // Importe o componente modal
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Faixas e rótulos conforme ImcCalculator
const classificacoes = [
  {
    min: 0,
    max: 18.49,
    label: "Abaixo do peso",
    color: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  },
  {
    min: 18.5,
    max: 24.99,
    label: "Peso normal",
    color: "bg-green-100 text-green-700 border border-green-200",
  },
  {
    min: 25,
    max: 29.99,
    label: "Pré-obesidade",
    color: "bg-orange-100 text-orange-700 border border-orange-200",
  },
  {
    min: 30,
    max: 34.99,
    label: "Obesidade I",
    color: "bg-red-100 text-red-700 border border-red-200",
  },
  {
    min: 35,
    max: 39.99,
    label: "Obesidade II",
    color: "bg-red-200 text-red-800 border border-red-300",
  },
  {
    min: 40,
    max: Infinity,
    label: "Obesidade III",
    color: "bg-red-300 text-red-900 border border-red-400",
  },
];

// Função para buscar cor do badge pela classificação
function getBadgeColor(classificacao: string): string {
  const found = classificacoes.find(
    (c) => c.label.toLowerCase() === classificacao.toLowerCase()
  );
  return found
    ? found.color
    : "bg-zinc-100 text-zinc-700 border border-zinc-200";
}

type ImcInfoProps = {
  imc: number;
  classificacao: string;
};

export function ImcInfo({ imc, classificacao }: ImcInfoProps) {
  const [openTabela, setOpenTabela] = useState(false);
  const [openReferencias, setOpenReferencias] = useState(false);
  const [openLimitacoes, setOpenLimitacoes] = useState(false);

  return (
    <div className="space-y-2 mb-4">
      <p>
        <strong>IMC calculado:</strong> {imc?.toFixed(2)}
        <br />
        <strong>Classificação:</strong>{" "}
        {classificacao && classificacao !== "--" ? (
          <Badge
            className={cn(
              "ml-2 text-xs font-semibold font-sans px-2 py-0.5 rounded border align-middle",
              getBadgeColor(classificacao)
            )}
          >
            {classificacao}
          </Badge>
        ) : (
          <span className="text-zinc-400 ml-2">Não disponível</span>
        )}
      </p>
      <div className="flex gap-2 flex-wrap">
        <ImcClassificacaoModal
          trigger={
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
              Ver tabela de classificação
            </button>
          }
        />
        <Dialog open={openReferencias} onOpenChange={setOpenReferencias}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm">
              Referências científicas
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Referências científicas sobre IMC</DialogTitle>
            </DialogHeader>
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
            <DialogClose asChild>
              <Button variant="secondary" className="w-full mt-2">
                Fechar
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
        <Dialog open={openLimitacoes} onOpenChange={setOpenLimitacoes}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm">
              Limitações do IMC
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Limitações do IMC</DialogTitle>
            </DialogHeader>
            <ul className="list-disc pl-5 text-sm mb-4">
              <li>Não diferencia massa magra de gordura.</li>
              <li>Não avalia a distribuição da gordura corporal.</li>
              <li>
                Pode superestimar ou subestimar riscos em atletas, idosos e
                diferentes etnias.
              </li>
              <li>É um indicador populacional, não diagnóstico individual.</li>
            </ul>
            <DialogClose asChild>
              <Button variant="secondary" className="w-full mt-2">
                Fechar
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
