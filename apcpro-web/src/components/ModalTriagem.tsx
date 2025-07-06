import { ModalPadrao } from "@/components/ui/ModalPadrao";
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
import apiClient from "@/lib/api-client";

type FormData = {
  atleta_frequenciaTreino: number;
  atleta_tempoCarreira: number;
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
  // Bloco 1: Informações pessoais
  atleta_modalidade?: string;
  atleta_posicao?: string;
  atleta_clube?: string;
  // Bloco 2: Histórico Esportivo
  atleta_tempoModalidade?: string;
  atleta_participaCompeticoes?: boolean;
  atleta_freqTreinoTecnico?: string;
  atleta_freqTreinoFisico?: string;
  // Bloco 3: Lesões e Cirurgias
  atleta_lesaoGrave?: boolean;
  atleta_quaisLesoes?: string;
  atleta_cirurgia?: boolean;
  atleta_quaisCirurgias?: string;
  atleta_anoCirurgia?: string;
  atleta_acompanhamentoMedico?: boolean;
  atleta_nomeMedico?: string;
  atleta_fisioterapia?: boolean;
  // Bloco 4: Expectativa
  atleta_metas3meses?: string;
  atleta_avaliacoesRecentes?: string;
  // Bloco 5: Suporte e Logística
  atleta_localTreino?: boolean;
  atleta_materialDisponivel?: string;
  atleta_tipoTreino?: string;

  // --- ANAMNESE (Público Geral) ---
  // Histórico de Treino
  anamnese_experienciaAnterior?: string;
  anamnese_preferenciasAtividades?: string;
  anamnese_frequenciaHorarios?: string;
  // Preferências Individuais
  anamnese_tiposIntensidade?: string;
  anamnese_local?: string; // Corrigido para bater com o register
  anamnese_equipamentos?: string; // Corrigido para bater com o register
  // Lesões e Limitações
  anamnese_historicoClinico?: string;
  anamnese_doresArticulares?: boolean; // Corrigido para boolean
  anamnese_limitacoesMovimento?: boolean; // Corrigido para boolean
  // Estilo de Vida e Recuperação
  anamnese_sono?: string;
  anamnese_suplementacao?: string;
  anamnese_alimentacao?: string;
  anamnese_recuperacaoPosTreino?: string;
};

type ModalTriagemProps = {
  open: boolean;
  onClose: () => void;
  userPerfilId: string;
  onSuccess: (objetivo: string) => void;
};

export function ModalTriagem({
  open,
  onClose,
  userPerfilId,
  onSuccess,
}: ModalTriagemProps) {
  const { register, handleSubmit, control, watch } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  // Adiciona estado para saber se é alto rendimento
  const [isAltoRendimento, setIsAltoRendimento] = useState(false);
  const [, setIsAnamnese] = useState(false);

  const doencaDiagnosticada = watch("bloco2_doencaDiagnosticada");
  const medicacaoContinua = watch("bloco2_medicacaoContinua");
  const cirurgiaRecente = watch("bloco2_cirurgiaRecente");
  const praticaAtividade = watch("bloco3_praticaAtividade");

  async function onSubmit(data: FormData) {
    setLoading(true);

    let tipoAvaliacao = "triagem";
    let resultado: Record<string, unknown> = {};

    if (isAltoRendimento) {
      tipoAvaliacao = "alto_rendimento";
      resultado = {
        bloco4: {
          objetivo: data.bloco4_objetivo,
        },
        atleta: {
          modalidade: data.atleta_modalidade ?? "",
          posicao: data.atleta_posicao ?? "",
          clube: data.atleta_clube ?? "",
          tempoModalidade: data.atleta_tempoModalidade ?? "",
          participaCompeticoes: data.atleta_participaCompeticoes ?? false,
          freqTreinoTecnico: data.atleta_freqTreinoTecnico ?? "",
          freqTreinoFisico: data.atleta_freqTreinoFisico ?? "",
          lesaoGrave: data.atleta_lesaoGrave ?? false,
          quaisLesoes: data.atleta_quaisLesoes ?? "",
          cirurgia: data.atleta_cirurgia ?? false,
          quaisCirurgias: data.atleta_quaisCirurgias ?? "",
          anoCirurgia: data.atleta_anoCirurgia ?? "",
          acompanhamentoMedico: data.atleta_acompanhamentoMedico ?? false,
          nomeMedico: data.atleta_nomeMedico ?? "",
          fisioterapia: data.atleta_fisioterapia ?? false,
          metas3meses: data.atleta_metas3meses ?? "",
          avaliacoesRecentes: data.atleta_avaliacoesRecentes ?? "",
          localTreino: data.atleta_localTreino ?? false,
          materialDisponivel: data.atleta_materialDisponivel ?? "",
          tipoTreino: data.atleta_tipoTreino ?? "",
        },
      };
    } else {
      tipoAvaliacao = "triagem";
      resultado = {
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
    }

    await apiClient.post(`alunos/${userPerfilId}/avaliacoes`, {
      tipo: tipoAvaliacao,
      status: "pendente",
      resultado,
      validadeAte: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    });

    setLoading(false);
    onSuccess(data.bloco4_objetivo);
    onClose();
  }

  return (
    <ModalPadrao
      open={open}
      onClose={onClose}
      title="Triagem inteligente"
      description="Preencha as informações para realizar a triagem inicial do aluno. Todos os dados são confidenciais e ajudam na personalização do acompanhamento."
      maxWidth="md"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
          >
            {/* Objetivo */}
            <div className="space-y-2">
              <Label>Objetivo:</Label>
              <Controller
                control={control}
                name="bloco4_objetivo"
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setIsAltoRendimento(
                        value === "Alto rendimento esportivo"
                      );
                      setIsAnamnese(
                        value === "Melhorar ou controlar uma doença crônica" ||
                          value ===
                            "Melhorar minha disposição, qualidade de vida e envelhecer com saúde" ||
                          value ===
                            "Reduzir gordura corporal, melhorar a estética ou ganhar massa muscular"
                      );
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full h-10 text-sm">
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
                      <SelectItem value="Alto rendimento esportivo">
                        Alto rendimento esportivo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {isAltoRendimento ? (
              <div className="space-y-6">
                {/* Bloco 1: Informações pessoais */}
                <div className="space-y-2">
                  <Label htmlFor="modalidade">Modalidade esportiva:</Label>
                  <Input
                    id="modalidade"
                    placeholder="Ex: Atletismo, Natação"
                    {...register("atleta_modalidade")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="posicao">Posição (se aplicável):</Label>
                  <Input
                    id="posicao"
                    placeholder="Ex: Goleiro, Atacante"
                    {...register("atleta_posicao")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clube">Clube atual:</Label>
                  <Input
                    id="clube"
                    placeholder="Ex: Clube Atlético"
                    {...register("atleta_clube")}
                  />
                </div>

                {/* Bloco 2: Histórico Esportivo */}
                <div className="space-y-2">
                  <Label htmlFor="tempoModalidade">
                    Há quanto tempo você pratica essa modalidade?
                  </Label>
                  <Input
                    id="tempoModalidade"
                    placeholder="Ex: 5 anos"
                    {...register("atleta_tempoModalidade")}
                  />
                </div>
                <Controller
                  control={control}
                  name="atleta_participaCompeticoes"
                  defaultValue={false}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        id="participaCompeticoes"
                      />
                      <Label htmlFor="participaCompeticoes">
                        Participa de competições?
                      </Label>
                    </div>
                  )}
                />
                <div className="space-y-2">
                  <Label htmlFor="freqTreinoTecnico">
                    Frequência semanal de treinos técnicos:
                  </Label>
                  <Input
                    id="freqTreinoTecnico"
                    placeholder="Ex: 3"
                    type="number"
                    min={0}
                    max={14}
                    {...register("atleta_freqTreinoTecnico")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freqTreinoFisico">
                    Frequência semanal de treinos físicos:
                  </Label>
                  <Input
                    id="freqTreinoFisico"
                    placeholder="Ex: 4"
                    type="number"
                    min={0}
                    max={14}
                    {...register("atleta_freqTreinoFisico")}
                  />
                </div>

                {/* Bloco 3: Lesões e Cirurgias */}
                <Controller
                  control={control}
                  name="atleta_lesaoGrave"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        id="lesaoGrave"
                      />
                      <Label htmlFor="lesaoGrave">
                        Já teve alguma lesão grave?
                      </Label>
                    </div>
                  )}
                />
                {watch("atleta_lesaoGrave") && (
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="quaisLesoes">Qual(is)?</Label>
                    <Input
                      id="quaisLesoes"
                      placeholder="Descreva as lesões"
                      {...register("atleta_quaisLesoes")}
                    />
                  </div>
                )}
                <Controller
                  control={control}
                  name="atleta_cirurgia"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        id="cirurgia"
                      />
                      <Label htmlFor="cirurgia">Já passou por cirurgia?</Label>
                    </div>
                  )}
                />
                {watch("atleta_cirurgia") && (
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="quaisCirurgias">Qual(is)?</Label>
                    <Input
                      id="quaisCirurgias"
                      placeholder="Descreva as cirurgias"
                      {...register("atleta_quaisCirurgias")}
                    />
                    <Label htmlFor="anoCirurgia">Ano?</Label>
                    <Input
                      id="anoCirurgia"
                      placeholder="Ex: 2022"
                      {...register("atleta_anoCirurgia")}
                    />
                  </div>
                )}
                <Controller
                  control={control}
                  name="atleta_acompanhamentoMedico"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        id="acompanhamentoMedico"
                      />
                      <Label htmlFor="acompanhamentoMedico">
                        Possui acompanhamento médico atual?
                      </Label>
                    </div>
                  )}
                />
                {watch("atleta_acompanhamentoMedico") && (
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="nomeMedico">
                      Nome do médico/responsável:
                    </Label>
                    <Input
                      id="nomeMedico"
                      placeholder="Nome completo"
                      {...register("atleta_nomeMedico")}
                    />
                  </div>
                )}
                <Controller
                  control={control}
                  name="atleta_fisioterapia"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        id="fisioterapia"
                      />
                      <Label htmlFor="fisioterapia">
                        Está em tratamento fisioterapêutico atualmente?
                      </Label>
                    </div>
                  )}
                />

                {/* Bloco 4: Expectativa */}
                <div className="space-y-2">
                  <Label htmlFor="metas3meses">
                    Quais são suas metas de performance para os próximos 3
                    meses?
                  </Label>
                  <Input
                    id="metas3meses"
                    placeholder="Descreva suas metas"
                    {...register("atleta_metas3meses")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avaliacoesRecentes">
                    Já realizou avaliações físicas recentemente? Quais?
                  </Label>
                  <Input
                    id="avaliacoesRecentes"
                    placeholder="Descreva as avaliações"
                    {...register("atleta_avaliacoesRecentes")}
                  />
                </div>

                {/* Bloco 5: Suporte e Logística */}
                <div className="space-y-2">
                  <Controller
                    control={control}
                    name="atleta_localTreino"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                          id="localTreino"
                        />
                        <Label htmlFor="localTreino">
                          Possui local para realizar treinos físicos
                          regularmente?
                        </Label>
                      </div>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="materialDisponivel">
                    Possui material disponível para treino? (elásticos, pesos,
                    bola, quadra etc.)
                  </Label>
                  <Input
                    id="materialDisponivel"
                    placeholder="Descreva o material disponível"
                    {...register("atleta_materialDisponivel")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoTreino">
                    Deseja treinos presenciais, online ou híbridos?
                  </Label>
                  <Input
                    id="tipoTreino"
                    placeholder="Presencial, online ou híbrido"
                    {...register("atleta_tipoTreino")}
                  />
                </div>
              </div>
            ) : (
              <>
                {/* Doença diagnosticada */}
                <div className="space-y-2">
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
                          <Label htmlFor="doenca">
                            Possui doença diagnosticada?
                          </Label>
                        </>
                      )}
                    />
                  </div>
                  {doencaDiagnosticada && (
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="quaisDoencas">Qual(is) doença(s)?</Label>
                      <Input
                        id="quaisDoencas"
                        placeholder="Ex: Diabetes, Hipertensão"
                        {...register("bloco2_quaisDoencas")}
                      />
                    </div>
                  )}
                </div>

                {/* Medicação contínua */}
                <div className="space-y-2">
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
                          <Label htmlFor="medicacao">
                            Usa medicação contínua?
                          </Label>
                        </>
                      )}
                    />
                  </div>
                  {medicacaoContinua && (
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="quaisMedicacoes">
                        Qual(is) medicação(ões)?
                      </Label>
                      <Input
                        id="quaisMedicacoes"
                        placeholder="Ex: Metformina"
                        {...register("bloco2_quaisMedicacoes")}
                      />
                    </div>
                  )}
                </div>

                {/* Cirurgia recente */}
                <div className="space-y-2">
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
                      <Label htmlFor="quaisCirurgias">
                        Qual(is) cirurgia(s)?
                      </Label>
                      <Input
                        id="quaisCirurgias"
                        placeholder="Ex: Apendicectomia"
                        {...register("bloco2_quaisCirurgias")}
                      />
                    </div>
                  )}
                </div>

                {/* Prática de atividade física */}
                <div className="space-y-2">
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
                          <Label htmlFor="atividade">
                            Pratica atividade física?
                          </Label>
                        </>
                      )}
                    />
                  </div>
                  {praticaAtividade && (
                    <div className="flex flex-row gap-4">
                      <div className="flex flex-col gap-1 flex-1">
                        <Label htmlFor="qualAtividade">Qual atividade?</Label>
                        <Input
                          id="qualAtividade"
                          placeholder="Ex: Caminhada, Musculação"
                          {...register("bloco3_qualAtividade")}
                        />
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <Label>Frequência:</Label>
                        <Controller
                          control={control}
                          name="bloco3_frequencia"
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="h-10 text-sm">
                                <SelectValue placeholder="Frequência" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1-2x">
                                  1-2x por semana
                                </SelectItem>
                                <SelectItem value="3-4x">
                                  3-4x por semana
                                </SelectItem>
                                <SelectItem value="5x ou mais">
                                  5x ou mais
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Qualidade e horas de sono + nível de estresse */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <Label>Qualidade do sono:</Label>
                    <Controller
                      control={control}
                      name="bloco5_qualidadeSono"
                      render={({ field }) => (
                        <Select
                          onValueChange={(val) => field.onChange(Number(val))}
                          defaultValue={
                            field.value ? String(field.value) : undefined
                          }
                        >
                          <SelectTrigger className="h-10 text-sm">
                            <SelectValue placeholder="Selecione a qualidade do sono" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <SelectItem key={n} value={String(n)}>
                                {n} -{" "}
                                {
                                  [
                                    "Muito ruim",
                                    "Ruim",
                                    "Regular",
                                    "Boa",
                                    "Excelente",
                                  ][n - 1]
                                }
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="flex flex-row gap-4">
                    <div className="flex flex-col gap-1 flex-1">
                      <Label htmlFor="horasSono">
                        Horas de sono por noite:
                      </Label>
                      <Input
                        id="horasSono"
                        type="number"
                        min={1}
                        max={24}
                        placeholder="Ex: 7"
                        {...register("bloco5_horasSono", {
                          valueAsNumber: true,
                        })}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <Label>Nível de estresse:</Label>
                      <Controller
                        control={control}
                        name="bloco5_nivelEstresse"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="h-10 text-sm">
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
                </div>
              </>
            )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 mt-4"
        >
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </form>
    </ModalPadrao>
  );
}
