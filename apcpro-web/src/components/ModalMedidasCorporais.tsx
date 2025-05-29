import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

// Lista de partes do corpo com tooltips
const bodyParts = [
  {
    id: "pescoco",
    label: "Pescoço",
    region: "upper",
    tooltip: "Meça logo abaixo da laringe (pomo de Adão).",
  },
  { id: "ombros", label: "Ombros", region: "upper" },
  { id: "biceps", label: "Bíceps", region: "upper" },
  {
    id: "antebraco",
    label: "Antebraço",
    region: "upper",
    tooltip: "Meça na parte mais grossa do antebraço.",
  },
  { id: "torax", label: "Tórax", region: "torso" },
  {
    id: "cintura",
    label: "Cintura",
    region: "torso",
    tooltip:
      "Homens: ao nível do umbigo. Mulheres: parte mais estreita do abdômen.",
  },
  { id: "abdomen", label: "Abdômen", region: "torso" },
  {
    id: "quadril",
    label: "Quadril",
    region: "torso",
    tooltip: "Meça na parte mais larga dos glúteos.",
  },
  { id: "coxa", label: "Coxa", region: "lower" },
  {
    id: "panturrilha",
    label: "Panturrilha",
    region: "lower",
    tooltip: "Meça na parte mais grossa da panturrilha.",
  },
];

// Tipagem das props
type ModalMedidasCorporaisProps = {
  open: boolean;
  onClose: () => void;
  userPerfilId: string;
  onSuccess: () => void;
};

type MedidasForm = Record<string, string>;

export function ModalMedidasCorporais({
  open,
  onClose,
  userPerfilId,
  onSuccess,
}: ModalMedidasCorporaisProps) {
  const [form, setForm] = useState<MedidasForm>({});
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    // Monta o resultado agrupando por região
    const resultado = {
      peso: form.peso ?? "",
      altura: form.altura ?? "",
      parteSuperior: {
        pescoco: form.pescoco ?? "",
        ombros: form.ombros ?? "",
        biceps: form.biceps ?? "",
        antebraco: form.antebraco ?? "",
      },
      tronco: {
        torax: form.torax ?? "",
        cintura: form.cintura ?? "",
        abdomen: form.abdomen ?? "",
        quadril: form.quadril ?? "",
      },
      parteInferior: {
        coxa: form.coxa ?? "",
        panturrilha: form.panturrilha ?? "",
      },
    };

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/alunos/${userPerfilId}/avaliacoes`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "medidas",
          status: "pendente",
          resultado,
          validadeAte: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        }),
      }
    );

    setLoading(false);
    onSuccess();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full p-0">
        <div className="relative flex flex-col h-[80vh]">
          <DialogHeader className="px-8 pt-8 mb-4">
            <DialogTitle>Medidas Corporais</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-8 pb-8">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* PESO E ALTURA */}
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="peso"
                      >
                        Peso (kg)
                      </label>
                      <Input
                        id="peso"
                        placeholder="Ex: 70"
                        type="number"
                        step="0.01"
                        value={form.peso || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="altura"
                      >
                        Altura (cm)
                      </label>
                      <Input
                        id="altura"
                        placeholder="Ex: 175"
                        type="number"
                        step="0.1"
                        value={form.altura || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* PARTE SUPERIOR: 2 linhas, 2 colunas */}
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Primeira linha: Pescoçoⓘ e Ombros */}
                    {bodyParts
                      .filter((part) => part.region === "upper")
                      .slice(0, 2)
                      .map((part) => (
                        <div key={part.id}>
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor={part.id}
                          >
                            {part.label}
                            {part.tooltip && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="ml-1 text-xs text-muted-foreground cursor-help">
                                      ⓘ
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {part.tooltip}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </label>
                          <Input
                            id={part.id}
                            placeholder="cm"
                            type="number"
                            value={form[part.id] || ""}
                            onChange={handleChange}
                          />
                        </div>
                      ))}
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Segunda linha: Bíceps e Antebraçoⓘ */}
                    {bodyParts
                      .filter((part) => part.region === "upper")
                      .slice(2, 4)
                      .map((part) => (
                        <div key={part.id}>
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor={part.id}
                          >
                            {part.label}
                            {part.tooltip && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="ml-1 text-xs text-muted-foreground cursor-help">
                                      ⓘ
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {part.tooltip}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </label>
                          <Input
                            id={part.id}
                            placeholder="cm"
                            type="number"
                            value={form[part.id] || ""}
                            onChange={handleChange}
                          />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* GRID CENTRAL: Tronco à esquerda, Imagem à direita */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Tronco */}
                <Card className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <div className="flex flex-col gap-4">
                      {bodyParts
                        .filter((part) => part.region === "torso")
                        .map((part) => (
                          <div key={part.id}>
                            <label
                              className="block text-sm font-medium mb-1"
                              htmlFor={part.id}
                            >
                              {part.label}
                              {part.tooltip && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="ml-1 text-xs text-muted-foreground cursor-help">
                                        ⓘ
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {part.tooltip}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </label>
                            <Input
                              id={part.id}
                              placeholder="cm"
                              type="number"
                              value={form[part.id] || ""}
                              onChange={handleChange}
                            />
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                {/* Imagem Central */}
                <div className="flex justify-center items-center">
                  <div className="rounded-xl flex justify-center">
                    <Image
                      src="/images/human-silhouette.png"
                      alt="Figura medidas corporais"
                      width={230}
                      height={380}
                    />
                  </div>
                </div>
              </div>

              {/* PARTE INFERIOR */}
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bodyParts
                      .filter((part) => part.region === "lower")
                      .map((part) => (
                        <div key={part.id}>
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor={part.id}
                          >
                            {part.label}
                            {part.tooltip && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="ml-1 text-xs text-muted-foreground cursor-help">
                                      ⓘ
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {part.tooltip}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </label>
                          <Input
                            id={part.id}
                            placeholder="cm"
                            type="number"
                            value={form[part.id] || ""}
                            onChange={handleChange}
                          />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Botão de envio */}
              <div className="flex justify-end mt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar Medidas"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
