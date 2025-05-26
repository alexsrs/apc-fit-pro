import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

type FormData = {
  bloco1_altura: number;
  bloco1_pesoAtual: number;
  bloco2_doencaDiagnosticada: boolean;
  bloco2_quaisDoencas?: string;
  bloco2_medicacaoContinua: boolean;
  bloco2_quaisMedicacoes?: string;
  bloco2_cirurgiaRecente: boolean;
  bloco2_quaisCirurgias?: string;
  bloco3_praticaAtividade: boolean;
  bloco3_qualAtividade?: string;
  bloco3_frequencia: string;
  bloco4_objetivo: string;
  bloco5_horasSono: number;
  bloco5_qualidadeSono: number;
  bloco5_nivelEstresse: string;
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
  const { register, handleSubmit, control, watch } = useForm<FormData>();
  const [loading, setLoading] = useState(false);

  // Assista o valor do campo para mostrar o input condicionalmente
  const doencaDiagnosticada = watch("bloco2_doencaDiagnosticada");
  const medicacaoContinua = watch("bloco2_medicacaoContinua");
  const cirurgiaRecente = watch("bloco2_cirurgiaRecente");
  const praticaAtividade = watch("bloco3_praticaAtividade");

  async function onSubmit(data: FormData) {
    setLoading(true);

    const resultado = {
      bloco1: {
        altura: data.bloco1_altura,
        pesoAtual: data.bloco1_pesoAtual,
      },
      bloco2: {
        doencaDiagnosticada: data.bloco2_doencaDiagnosticada,
        quaisDoencas: data.bloco2_quaisDoencas ?? "",
        medicacaoContinua: data.bloco2_medicacaoContinua,
        quaisMedicacoes: data.bloco2_quaisMedicacoes ?? "",
        cirurgiaRecente: data.bloco2_cirurgiaRecente,
        quaisCirurgias: data.bloco2_quaisCirurgias ?? "",
      },
      bloco3: {
        praticaAtividade: data.bloco3_praticaAtividade,
        qualAtividade: data.bloco3_qualAtividade ?? "",
        frequencia: data.bloco3_frequencia,
      },
      bloco4: {
        objetivo: data.bloco4_objetivo,
      },
      bloco5: {
        horasSono: data.bloco5_horasSono,
        qualidadeSono: data.bloco5_qualidadeSono,
        nivelEstresse: data.bloco5_nivelEstresse,
      },
    };

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/alunos/${userPerfilId}/avaliacoes`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "anamnese",
          status: "valida",
          resultado,
          validadeAte: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 dias em ms
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Anamnese Inicial</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="py-2">
          <div className="space-y-4">
            {/* Altura e Peso Atual */}
            <div className="flex flex-row gap-4 mb-4">
              <div className="flex flex-col gap-1 flex-1">
                <Label htmlFor="altura" className="mb-1">
                  Altura (cm):
                </Label>
                <Input
                  id="altura"
                  type="number"
                  min={50}
                  max={250}
                  placeholder="Ex: 180"
                  {...register("bloco1_altura", { valueAsNumber: true })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <Label htmlFor="pesoAtual" className="mb-1">
                  Peso atual (kg):
                </Label>
                <Input
                  id="pesoAtual"
                  type="number"
                  min={20}
                  max={300}
                  step="0.1"
                  inputMode="decimal"
                  placeholder="Ex: 80.5"
                  {...register("bloco1_pesoAtual", { valueAsNumber: true })}
                  required
                />
              </div>
            </div>
            {/* Objetivo */}
            <div className="space-y-3">
              <Label>Objetivo:</Label>
              <Controller
                control={control}
                name="bloco4_objetivo"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Melhorar ou controlar uma doença crônica">
                        Controle de Doença
                      </SelectItem>
                      <SelectItem value="Melhorar minha disposição, qualidade de vida e envelhecer com saúde">
                        Saúde e Bem-estar
                      </SelectItem>
                      <SelectItem value="Reduzir gordura corporal, melhorar a estética ou ganhar massa muscular">
                        Estética / Hipertrofia
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {/* Doença diagnosticada */}
            <div className="flex items-center space-x-2">
              <Controller
                control={control}
                name="bloco2_doencaDiagnosticada"
                defaultValue={false}
                render={({ field }) => (
                  <>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="doenca"
                    />
                    <Label htmlFor="doenca">Possui doença diagnosticada?</Label>
                  </>
                )}
              />
            </div>
            {doencaDiagnosticada && (
              <div className="flex flex-col gap-1">
                <Label htmlFor="quaisDoencas" className="mb-1">
                  Qual(is) doença(s)?
                </Label>
                <Input
                  id="quaisDoencas"
                  placeholder="Ex: Diabetes, Hipertensão"
                  {...register("bloco2_quaisDoencas")}
                />
              </div>
            )}

            {/* Medicação contínua */}
            <div className="flex items-center space-x-2">
              <Controller
                control={control}
                name="bloco2_medicacaoContinua"
                defaultValue={false}
                render={({ field }) => (
                  <>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="medicacao"
                    />
                    <Label htmlFor="medicacao">Usa medicação contínua?</Label>
                  </>
                )}
              />
            </div>
            {medicacaoContinua && (
              <div className="flex flex-col gap-1">
                <Label htmlFor="quaisMedicacoes" className="mb-1">
                  Qual(is) medicação(ões)?
                </Label>
                <Input
                  id="quaisMedicacoes"
                  placeholder="Ex: Metformina"
                  {...register("bloco2_quaisMedicacoes")}
                />
              </div>
            )}

            {/* Cirurgia recente */}
            <div className="flex items-center space-x-2">
              <Controller
                control={control}
                name="bloco2_cirurgiaRecente"
                defaultValue={false}
                render={({ field }) => (
                  <>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="cirurgia"
                    />
                    <Label htmlFor="cirurgia">
                      Cirurgia nos últimos 2 anos?
                    </Label>
                  </>
                )}
              />
            </div>
            {cirurgiaRecente && (
              <div className="flex flex-col gap-1">
                <Label htmlFor="quaisCirurgias" className="mb-1">
                  Qual(is) cirurgia(s)?
                </Label>
                <Input
                  id="quaisCirurgias"
                  placeholder="Ex: Apendicectomia"
                  {...register("bloco2_quaisCirurgias")}
                />
              </div>
            )}

            {/* Pratica atividade física */}
            <div className="flex items-center space-x-2">
              <Controller
                control={control}
                name="bloco3_praticaAtividade"
                defaultValue={false}
                render={({ field }) => (
                  <>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="atividade"
                    />
                    <Label htmlFor="atividade">Pratica atividade física?</Label>
                  </>
                )}
              />
            </div>
            {praticaAtividade && (
              <div className="flex flex-row gap-2 items-end">
                <div className="flex flex-col gap-1 flex-1">
                  <Label htmlFor="qualAtividade" className="mb-1">
                    Qual atividade?
                  </Label>
                  <Input
                    id="qualAtividade"
                    placeholder="Ex: Caminhada, Musculação"
                    {...register("bloco3_qualAtividade")}
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <Label className="mb-1">Frequência:</Label>
                  <Controller
                    control={control}
                    name="bloco3_frequencia"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Frequência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2x">1-2x por semana</SelectItem>
                          <SelectItem value="3-4x">3-4x por semana</SelectItem>
                          <SelectItem value="5x ou mais">5x ou mais</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Qualidade do sono */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="sono" className="mb-1">
                Qualidade do sono:
              </Label>
              <Controller
                control={control}
                name="bloco5_qualidadeSono"
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value ? String(field.value) : undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a qualidade do sono" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">
                        1 - Muito ruim (acorda várias vezes, não descansa)
                      </SelectItem>
                      <SelectItem value="2">
                        2 - Ruim (sono leve, acorda cansado)
                      </SelectItem>
                      <SelectItem value="3">
                        3 - Regular (sono razoável, cansaço moderado)
                      </SelectItem>
                      <SelectItem value="4">
                        4 - Boa (acorda bem, poucas interrupções)
                      </SelectItem>
                      <SelectItem value="5">
                        5 - Excelente (sono profundo, acorda disposto)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-row gap-4">
              {/* Horas de sono */}
              <div className="flex flex-col gap-1 flex-1">
                <Label htmlFor="horasSono" className="mb-1">
                  Horas de sono por noite:
                </Label>
                <Input
                  id="horasSono"
                  type="number"
                  min={1}
                  max={24}
                  placeholder="Ex: 7"
                  {...register("bloco5_horasSono", { valueAsNumber: true })}
                  required
                />
              </div>
              {/* Nível de estresse */}
              <div className="flex flex-col gap-1 flex-1">
                <Label className="mb-1">Nível de estresse:</Label>
                <Controller
                  control={control}
                  name="bloco5_nivelEstresse"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baixo">Baixo</SelectItem>
                        <SelectItem value="Moderado">Moderado</SelectItem>
                        <SelectItem value="Alto">Alto</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
