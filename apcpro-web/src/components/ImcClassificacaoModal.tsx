import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Faixas, rótulos e cores conforme padrão do sistema
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

export function ImcClassificacaoModal({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="default" size="sm">
            Ver tabela de classificação
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Classificação do IMC (OMS/CDC)</DialogTitle>
        </DialogHeader>
        <table className="w-full text-sm mb-4 border text-center">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-center">IMC</th>
              <th className="border px-2 py-1 text-center">Classificação</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1 text-center">&lt; 18,5</td>
              <td className="border px-2 py-1 text-center">
                <Badge className={classificacoes[0].color}>
                  {classificacoes[0].label}
                </Badge>
              </td>
            </tr>
            <tr>
              <td className="border px-2 py-1 text-center">18,5 – 24,9</td>
              <td className="border px-2 py-1 text-center">
                <Badge className={classificacoes[1].color}>
                  {classificacoes[1].label}
                </Badge>
              </td>
            </tr>
            <tr>
              <td className="border px-2 py-1 text-center">25 – 29,9</td>
              <td className="border px-2 py-1 text-center">
                <Badge className={classificacoes[2].color}>
                  {classificacoes[2].label}
                </Badge>
              </td>
            </tr>
            <tr>
              <td className="border px-2 py-1 text-center">30 – 34,9</td>
              <td className="border px-2 py-1 text-center">
                <Badge className={classificacoes[3].color}>
                  {classificacoes[3].label}
                </Badge>
              </td>
            </tr>
            <tr>
              <td className="border px-2 py-1 text-center">35 – 39,9</td>
              <td className="border px-2 py-1 text-center">
                <Badge className={classificacoes[4].color}>
                  {classificacoes[4].label}
                </Badge>
              </td>
            </tr>
            <tr>
              <td className="border px-2 py-1 text-center">&ge; 40</td>
              <td className="border px-2 py-1 text-center">
                <Badge className={classificacoes[5].color}>
                  {classificacoes[5].label}
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
        <DialogClose asChild>
          <Button variant="secondary" className="w-full mt-2">
            Fechar
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
