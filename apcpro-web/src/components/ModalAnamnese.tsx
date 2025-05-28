import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Checkbox } from "@/components/ui/checkbox";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

type FormData = {
  // Bloco 1: Histórico de Treino
  anamnese_experienciaAnterior?: string;
  anamnese_preferenciasAtividades?: string;
  anamnese_frequenciaHorarios?: string;
  // Bloco 2: Preferências Individuais
  anamnese_tiposIntensidade?: string;
  anamnese_local?: string;
  anamnese_equipamentos?: string;
  // Bloco 3: Lesões e Limitações
  anamnese_historicoClinico?: string;
  anamnese_doresArticulares?: boolean;
  anamnese_doresArticularesDetalhe?: string;
  anamnese_limitacoesMovimento?: boolean;
  anamnese_limitacoesMovimentoDetalhe?: string;
  // Bloco 4: Estilo de Vida e Recuperação
  anamnese_suplementacao?: string;
  anamnese_alimentacao?: string;
  anamnese_recuperacaoPosTreino?: string;
};

interface ModalAnamneseProps {
  open: boolean;
  onClose: () => void;
  userPerfilId: string;
  onSuccess: () => void;
}

export function ModalAnamnese({
  open,
  onClose,
  userPerfilId,
  onSuccess,
}: ModalAnamneseProps) {
  const { register, handleSubmit, control } = useForm<FormData>();
  const [loading, setLoading] = useState(false);

  // Assista o valor do campo para mostrar o input condicionalmente

  async function onSubmit(data: FormData) {
    setLoading(true);

    const resultado = {
      historicoTreino: {
        experienciaAnterior: data.anamnese_experienciaAnterior ?? "",
        preferenciasAtividades: data.anamnese_preferenciasAtividades ?? "",
        frequenciaHorarios: data.anamnese_frequenciaHorarios ?? "",
      },
      preferenciasIndividuais: {
        tiposIntensidade: data.anamnese_tiposIntensidade ?? "",
        local: data.anamnese_local ?? "",
        equipamentos: data.anamnese_equipamentos ?? "",
      },
      lesoesLimitacoes: {
        historicoClinico: data.anamnese_historicoClinico ?? "",
        doresArticulares: data.anamnese_doresArticulares ?? false,
        doresArticularesDetalhe: data.anamnese_doresArticularesDetalhe ?? "",
        limitacoesMovimento: data.anamnese_limitacoesMovimento ?? false,
        limitacoesMovimentoDetalhe:
          data.anamnese_limitacoesMovimentoDetalhe ?? "",
      },
      estiloVidaRecuperacao: {
        suplementacao: data.anamnese_suplementacao ?? "",
        alimentacao: data.anamnese_alimentacao ?? "",
        recuperacaoPosTreino: data.anamnese_recuperacaoPosTreino ?? "",
      },
    };

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/alunos/${userPerfilId}/avaliacoes`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "anamnese",
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
      <DialogContent className="max-w-md p-0">
        <ScrollArea className="max-h-[80vh] rounded-lg px-6 py-6">
          <DialogHeader>
            <DialogTitle>Anamnese</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 py-8 px-4"
          >
            {/* Bloco 1: Histórico de Treino */}
            <div className="space-y-2">
              <Label htmlFor="anamnese_experienciaAnterior">
                Experiência anterior com treino físico:
              </Label>
              <Input
                id="anamnese_experienciaAnterior"
                placeholder="Descreva sua experiência"
                {...register("anamnese_experienciaAnterior")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anamnese_preferenciasAtividades">
                Preferências de atividades:
              </Label>
              <Input
                id="anamnese_preferenciasAtividades"
                placeholder="Ex: Caminhada, Musculação, Yoga"
                {...register("anamnese_preferenciasAtividades")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anamnese_frequenciaHorarios">
                Frequência e horários preferidos:
              </Label>
              <Input
                id="anamnese_frequenciaHorarios"
                placeholder="Ex: 3x por semana, manhã"
                {...register("anamnese_frequenciaHorarios")}
              />
            </div>
            {/* Bloco 2: Preferências Individuais */}
            <div className="space-y-2">
              <Label htmlFor="anamnese_tiposIntensidade">
                Tipos e intensidade de treino preferidos:
              </Label>
              <Input
                id="anamnese_tiposIntensidade"
                placeholder="Ex: Leve, Moderado, HIIT, Força"
                {...register("anamnese_tiposIntensidade")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anamnese_local">
                Local preferido para treinar:
              </Label>
              <Input
                id="anamnese_local"
                placeholder="Ex: Academia, Casa, Parque"
                {...register("anamnese_local")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anamnese_equipamentos">
                Equipamentos disponíveis:
              </Label>
              <Input
                id="anamnese_equipamentos"
                placeholder="Ex: Halteres, Faixa elástica, Esteira"
                {...register("anamnese_equipamentos")}
              />
            </div>
            {/* Bloco 3: Lesões e Limitações */}
            <div className="space-y-2">
              <Label htmlFor="anamnese_historicoClinico">
                Histórico clínico detalhado:
              </Label>
              <Input
                id="anamnese_historicoClinico"
                placeholder="Descreva doenças, condições ou cirurgias relevantes"
                {...register("anamnese_historicoClinico")}
              />
            </div>
            <Controller
              control={control}
              name="anamnese_doresArticulares"
              defaultValue={false}
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                      id="anamnese_doresArticulares"
                    />
                    <Label htmlFor="anamnese_doresArticulares">
                      Sente dores articulares atualmente?
                    </Label>
                  </div>
                  {!!field.value && (
                    <Input
                      className="mt-1"
                      id="anamnese_doresArticularesDetalhe"
                      placeholder="Descreva as articulações, intensidade, etc."
                      {...register("anamnese_doresArticularesDetalhe")}
                    />
                  )}
                </div>
              )}
            />
            <Controller
              control={control}
              name="anamnese_limitacoesMovimento"
              defaultValue={false}
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                      id="anamnese_limitacoesMovimento"
                    />
                    <Label htmlFor="anamnese_limitacoesMovimento">
                      Possui limitações de movimento?
                    </Label>
                  </div>
                  {!!field.value && (
                    <Input
                      className="mt-1"
                      id="anamnese_limitacoesMovimentoDetalhe"
                      placeholder="Descreva as limitações, regiões, etc."
                      {...register("anamnese_limitacoesMovimentoDetalhe")}
                    />
                  )}
                </div>
              )}
            />
            {/* Bloco 4: Estilo de Vida e Recuperação */}
            <div className="space-y-2">
              <Label htmlFor="anamnese_suplementacao">
                Faz uso de suplementação?
              </Label>
              <Input
                id="anamnese_suplementacao"
                placeholder="Ex: Whey, Creatina, Não uso"
                {...register("anamnese_suplementacao")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anamnese_alimentacao">
                Como avalia sua alimentação?
              </Label>
              <Input
                id="anamnese_alimentacao"
                placeholder="Ex: Balanceada, Rica em proteínas, Pouco variada"
                {...register("anamnese_alimentacao")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anamnese_recuperacaoPosTreino">
                Como sente sua recuperação pós-treino?
              </Label>
              <Input
                id="anamnese_recuperacaoPosTreino"
                placeholder="Ex: Rápida, Lenta, Sinto dores prolongadas"
                {...register("anamnese_recuperacaoPosTreino")}
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-4"
            >
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
