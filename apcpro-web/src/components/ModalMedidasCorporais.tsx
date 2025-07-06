import React, { useState } from "react";
import { ModalPadrao } from "@/components/ui/ModalPadrao";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useSession } from "next-auth/react";
import apiClient from "@/lib/api-client";
import type { AvaliacaoCompleta } from "@/types/dobras-cutaneas";
import {
  avaliarCA,
  CircunferenciaAbdominalResultado,
} from "@/services/ca-service";
import { CaInfo } from "./CaInfo";
import { DobrasCutaneasModernas } from "./DobrasCutaneasModernas";
import { useUserProfile } from "@/contexts/UserProfileContext";

// Service que chama a API de medidas

// Lista de partes do corpo com laterais
const bodyParts = [
  {
    id: "pescoco",
    label: "Pescoço",
    region: "upper",
    side: "center",
    tooltip: "Meça logo abaixo da laringe (pomo de Adão).",
    required: true,
  },
  {
    id: "biceps_d",
    label: "Bíceps Direito",
    region: "upper",
    side: "right",
    required: true,
  },
  {
    id: "biceps_e",
    label: "Bíceps Esquerdo",
    region: "upper",
    side: "left",
    required: true,
  },
  {
    id: "antebraco_d",
    label: "Antebraço Direito",
    region: "upper",
    side: "right",
    tooltip: "Meça na parte mais grossa do antebraço.",
    required: true,
  },
  {
    id: "antebraco_e",
    label: "Antebraço Esquerdo",
    region: "upper",
    side: "left",
    tooltip: "Meça na parte mais grossa do antebraço.",
    required: true,
  },
  {
    id: "torax",
    label: "Tórax",
    region: "torso",
    side: "center",
    required: true,
  },
  {
    id: "cintura",
    label: "Cintura",
    region: "torso",
    side: "center",
    tooltip:
      "Homens: ao nível do umbigo. Mulheres: parte mais estreita do abdômen.",
    required: true,
  },
  {
    id: "abdomen",
    label: "Abdômen",
    region: "torso",
    side: "center",
    required: true,
  },
  {
    id: "quadril",
    label: "Quadril",
    region: "torso",
    side: "center",
    tooltip: "Meça na parte mais larga dos glúteos.",
    required: true,
  },
  {
    id: "coxa_d",
    label: "Coxa Direita",
    region: "lower",
    side: "right",
    required: true,
  },
  {
    id: "coxa_e",
    label: "Coxa Esquerda",
    region: "lower",
    side: "left",
    required: true,
  },
  {
    id: "panturrilha_d",
    label: "Panturrilha Direita",
    region: "lower",
    side: "right",
    tooltip: "Meça na parte mais grossa da panturrilha.",
    required: true,
  },
  {
    id: "panturrilha_e",
    label: "Panturrilha Esquerda",
    region: "lower",
    side: "left",
    tooltip: "Meça na parte mais grossa da panturrilha.",
    required: true,
  },
];

// Tipagem das props
type ModalMedidasCorporaisProps = {
  open: boolean;
  onClose: () => void;
  userPerfilId: string;
  onSuccess: () => void;
  idade: number;
  dataNascimento: string;
};

type MedidasForm = Record<string, string>;

export function ModalMedidasCorporais({
  open,
  onClose,
  userPerfilId,
  onSuccess,
  idade,
  dataNascimento,
}: ModalMedidasCorporaisProps) {
  const [form, setForm] = useState<MedidasForm>({});
  const [loading, setLoading] = useState(false);
  const [resultadoCA] = useState<CircunferenciaAbdominalResultado | null>(null);
  const [activeTab, setActiveTab] = useState("medidas");
  const [dobrasCutaneasResultados, setDobrasCutaneasResultados] = useState<AvaliacaoCompleta | null>(null);
  const { profile } = useUserProfile();

  // Verifica se o usuário é professor
  const isUserProfessor = profile?.role === "professor";

  // Função para lidar com a tentativa de acesso à aba de dobras cutâneas
  function handleTabChange(value: string) {
    if (value === "dobras" && !isUserProfessor) {
      alert("⚠️ Acesso Restrito: Apenas professores podem avaliar dobras cutâneas. Esta funcionalidade requer conhecimento técnico especializado e equipamentos adequados para medições precisas.");
      return; // Não permite a mudança de aba
    }
    setActiveTab(value);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  // Callback para receber os resultados das dobras cutâneas
  function handleDobrasCutaneasResultados(resultados: AvaliacaoCompleta) {
    setDobrasCutaneasResultados(resultados);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!idade || isNaN(idade)) {
      alert("Idade não encontrada ou inválida!");
      setLoading(false);
      return;
    }

    // Lista de campos obrigatórios
    const requiredFields = [
      "peso",
      "altura",
      ...bodyParts.map((part) => part.id),
    ];
    const missingFields = requiredFields.filter((field) => !form[field]);
    if (missingFields.length > 0) {
      alert("Preencha todos os campos obrigatórios de medidas corporais.");
      setLoading(false);
      return;
    }

    const resultado = {
      peso: form.peso ? Number(form.peso) : undefined,
      altura: form.altura ? Number(form.altura) : undefined,
      idade: typeof idade === "number" && !isNaN(idade) ? idade : undefined,
      dataNascimento,
      membrosSuperiores: {
        biceps_d: form.biceps_d ? Number(form.biceps_d) : undefined,
        biceps_e: form.biceps_e ? Number(form.biceps_e) : undefined,
        antebraco_d: form.antebraco_d ? Number(form.antebraco_d) : undefined,
        antebraco_e: form.antebraco_e ? Number(form.antebraco_e) : undefined,
      },
      tronco: {
        pescoco: form.pescoco ? Number(form.pescoco) : undefined,
        torax: form.torax ? Number(form.torax) : undefined,
        cintura: form.cintura ? Number(form.cintura) : undefined,
        abdomen: form.abdomen ? Number(form.abdomen) : undefined,
        quadril: form.quadril ? Number(form.quadril) : undefined,
      },
      membrosInferiores: {
        coxa_d: form.coxa_d ? Number(form.coxa_d) : undefined,
        coxa_e: form.coxa_e ? Number(form.coxa_e) : undefined,
        panturrilha_d: form.panturrilha_d
          ? Number(form.panturrilha_d)
          : undefined,
        panturrilha_e: form.panturrilha_e
          ? Number(form.panturrilha_e)
          : undefined,
      },
      // Adiciona os resultados das dobras cutâneas se disponíveis
      dobrasCutaneas: dobrasCutaneasResultados,
    };

    // Chama a API que já retorna todos os índices, inclusive CA
    // Não é necessário chamar avaliarMedidas aqui, pois a API já calcula e persiste o valor de CA junto com as demais medidas.

    await apiClient.post(`alunos/${userPerfilId}/avaliacoes`, {
      tipo: "medidas",
      status: "pendente",
      resultado,
      validadeAte: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    });

    setLoading(false);
    onSuccess();
    onClose();
  }

  // Função utilitária para renderizar label com tooltip
  function LabelWithTooltip({
    htmlFor,
    label,
    tooltip,
  }: {
    htmlFor: string;
    label: string;
    tooltip?: string;
  }) {
    return (
      <label className="block text-sm font-medium mb-0.5" htmlFor={htmlFor}>
        {label}
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ml-1 text-xs text-muted-foreground cursor-help">
                  ⓘ
                </span>
              </TooltipTrigger>
              <TooltipContent>{tooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </label>
    );
  }

  return (
    <ModalPadrao
      open={open}
      onClose={onClose}
      title="Avaliação Física Completa"
      description="Complete a avaliação física do aluno com medidas corporais e dobras cutâneas."
      maxWidth="lg"
    >
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="medidas">Medidas Corporais</TabsTrigger>
          <TabsTrigger 
            value="dobras"
            className={!isUserProfessor ? "opacity-50 cursor-not-allowed" : ""}
          >
            Dobras Cutâneas {!isUserProfessor && "🔒"}
          </TabsTrigger>
        </TabsList>

              <TabsContent value="medidas" className="space-y-4">
                <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
                  {/* PESO E ALTURA CENTRALIZADOS EM 2 COLUNAS */}
                  <div className="grid grid-cols-2 gap-x-8 mb-4">
                    <div className="flex flex-col items-center">
                      <LabelWithTooltip
                        htmlFor="peso"
                        label="Peso (kg)"
                        tooltip="Informe o peso corporal atual em quilogramas."
                      />
                      <Input
                        id="peso"
                        className="w-28"
                        placeholder="Ex: 70"
                        type="number"
                        step="0.01"
                        value={form.peso || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <LabelWithTooltip
                        htmlFor="altura"
                        label="Altura (cm)"
                        tooltip="Informe a altura em centímetros, sem sapatos."
                      />
                      <Input
                        id="altura"
                        className="w-28"
                        placeholder="Ex: 175"
                        type="number"
                        step="0.1"
                        value={form.altura || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Inputs centrais acima da imagem, divididos em 3 colunas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 mb-2">
                    <div className="flex flex-col items-center gap-2">
                      <div>
                        <LabelWithTooltip
                          htmlFor="pescoco"
                          label="Pescoço"
                          tooltip="Meça logo abaixo da laringe (pomo de Adão)."
                        />
                        <Input
                          id="pescoco"
                          className="w-28"
                          placeholder="cm"
                          type="number"
                          value={form.pescoco || ""}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <LabelWithTooltip
                          htmlFor="torax"
                          label="Tórax"
                          tooltip="Meça a circunferência do tórax na linha dos mamilos, com os braços relaxados."
                        />
                        <Input
                          id="torax"
                          className="w-28"
                          placeholder="cm"
                          type="number"
                          value={form.torax || ""}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div>
                        <LabelWithTooltip
                          htmlFor="cintura"
                          label="Cintura"
                          tooltip="Homens: ao nível do umbigo. Mulheres: parte mais estreita do abdômen."
                        />
                        <Input
                          id="cintura"
                          className="w-28"
                          placeholder="cm"
                          type="number"
                          value={form.cintura || ""}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div>
                        <LabelWithTooltip
                          htmlFor="quadril"
                          label="Quadril"
                          tooltip="Meça na parte mais larga dos glúteos."
                        />
                        <Input
                          id="quadril"
                          className="w-28"
                          placeholder="cm"
                          type="number"
                          value={form.quadril || ""}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <LabelWithTooltip
                          htmlFor="abdomen"
                          label="Abdômen"
                          tooltip="Meça a circunferência abdominal na altura do umbigo."
                        />
                        <Input
                          id="abdomen"
                          className="w-28"
                          placeholder="cm"
                          type="number"
                          value={form.abdomen || ""}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Inputs laterais e imagem central */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 items-start">
                    {/* Coluna esquerda */}
                    <div className="flex flex-col items-center gap-2">
                      {bodyParts
                        .filter((part) => part.side === "left")
                        .map((part) => (
                          <div key={part.id}>
                            <LabelWithTooltip
                              htmlFor={part.id}
                              label={part.label}
                              tooltip={
                                part.tooltip ||
                                "Meça a circunferência na parte indicada, mantendo a fita confortável e nivelada."
                              }
                            />
                            <Input
                              id={part.id}
                              className="w-28"
                              placeholder="cm"
                              type="number"
                              value={form[part.id] || ""}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        ))}
                    </div>
                    {/* Imagem central */}
                    <div className="flex flex-col items-center gap-2">
                      <Image
                        src="/images/human-silhouette.png"
                        alt="Figura medidas corporais"
                        width={220}
                        height={370}
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    </div>
                    {/* Coluna direita */}
                    <div className="flex flex-col items-center gap-2">
                      {bodyParts
                        .filter((part) => part.side === "right")
                        .map((part) => (
                          <div key={part.id}>
                            <LabelWithTooltip
                              htmlFor={part.id}
                              label={part.label}
                              tooltip={
                                part.tooltip ||
                                "Meça a circunferência na parte indicada, mantendo a fita confortável e nivelada."
                              }
                            />
                            <Input
                              id={part.id}
                              className="w-28"
                              placeholder="cm"
                              type="number"
                              value={form[part.id] || ""}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Botão de envio */}
                  <div className="flex justify-end mt-6 p-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Salvando..." : "Salvar Avaliação"}
                    </Button>
                  </div>
                </form>
                {/* Exibe o resultado do CA se existir */}
                {resultadoCA && <CaInfo resultado={resultadoCA} />}
              </TabsContent>

              <TabsContent value="dobras" className="space-y-4">
                {form.peso && form.altura ? (
                  <DobrasCutaneasModernas
                    userPerfilId={profile?.id}
                    onResultado={handleDobrasCutaneasResultados}
                    modoCalculoApenas={false}
                    className="mt-4"
                  />
                ) : (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground">
                    Para calcular as dobras cutâneas, primeiro preencha o peso e altura na aba &quot;Medidas Corporais&quot;.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
    </ModalPadrao>
  );
}

// Função utilitária para calcular idade
function calcularIdade(dataNascimento?: string): number | undefined {
  if (!dataNascimento) return undefined;
  const nascimento = new Date(dataNascimento);
  if (isNaN(nascimento.getTime())) return undefined; // Data inválida
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade >= 0 ? idade : undefined;
}

export default function PaginaAluno() {
  const { data: session } = useSession();
  const [modalAberto, setModalAberto] = useState(false);

  // Defina um tipo que inclua dataNascimento
  type UsuarioComDataNascimento = {
    id: string;
    email: string;
    role?: string;
    dataNascimento: string;
  };

  // Faça o cast do usuário para o novo tipo
  const profile = session?.user as UsuarioComDataNascimento | undefined;
  const dataNascimento = profile?.dataNascimento;
  const idade = dataNascimento ? calcularIdade(dataNascimento) : undefined;

  function handleAbrirModal() {
    if (
      !dataNascimento ||
      typeof idade !== "number" ||
      isNaN(idade) ||
      idade <= 0
    ) {
      alert(
        "Data de nascimento não encontrada ou inválida no seu perfil. Atualize seu cadastro para registrar medidas."
      );
      return;
    }
    setModalAberto(true);
  }

  return (
    <>
      <button onClick={handleAbrirModal}>Registrar minhas medidas</button>
      {modalAberto &&
        dataNascimento &&
        typeof idade === "number" &&
        idade > 0 && (
          <ModalMedidasCorporais
            open={modalAberto}
            onClose={() => setModalAberto(false)}
            userPerfilId={profile.id}
            onSuccess={() => setModalAberto(false)}
            idade={idade}
            dataNascimento={dataNascimento}
          />
        )}
    </>
  );
}

export function FormularioCA() {
  const [valor, setValor] = useState("");
  const [genero, setGenero] = useState<"masculino" | "feminino">("masculino");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] =
    useState<CircunferenciaAbdominalResultado | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Envia para o backend, que faz o cálculo/classificação
      const res = await avaliarCA({ valor: Number(valor), genero });
      setResultado(res);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">
            Circunferência abdominal (cm)
          </label>
          <input
            type="number"
            min={0}
            step={0.1}
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Gênero</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={genero}
            onChange={(e) =>
              setGenero(e.target.value as "masculino" | "feminino")
            }
          >
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded py-2"
          disabled={loading}
        >
          {loading ? "Avaliando..." : "Avaliar CA"}
        </button>
      </form>
      {resultado && <CaInfo resultado={resultado} />}
    </>
  );
}
