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

const tabelaCA = [
  {
    genero: "masculino",
    baixo: "< 94 cm",
    aumentado: "94–101 cm",
    muitoAumentado: "≥ 102 cm",
  },
  {
    genero: "feminino",
    baixo: "< 80 cm",
    aumentado: "80–87 cm",
    muitoAumentado: "≥ 88 cm",
  },
];

export function CaClassificacaoModal({
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
          <DialogTitle>
            Classificação da Circunferência Abdominal (OMS/NIH)
          </DialogTitle>
        </DialogHeader>
        <table className="w-full text-sm mb-4 border text-center">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-center">Gênero</th>
              <th className="border px-2 py-1 text-center">Baixo risco</th>
              <th className="border px-2 py-1 text-center">Risco aumentado</th>
              <th className="border px-2 py-1 text-center">
                Risco muito aumentado
              </th>
            </tr>
          </thead>
          <tbody>
            {tabelaCA.map((linha) => (
              <tr key={linha.genero}>
                <td className="border px-2 py-1 text-center capitalize">
                  {linha.genero}
                </td>
                <td className="border px-2 py-1 text-center">
                  <Badge className="bg-green-100 text-green-700 border border-green-200">
                    {linha.baixo}
                  </Badge>
                </td>
                <td className="border px-2 py-1 text-center">
                  <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">
                    {linha.aumentado}
                  </Badge>
                </td>
                <td className="border px-2 py-1 text-center">
                  <Badge className="bg-red-100 text-red-700 border border-red-200">
                    {linha.muitoAumentado}
                  </Badge>
                </td>
              </tr>
            ))}
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
