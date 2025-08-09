// Importação de dependências e utilitários necessários para o componente.
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  avaliarCA,
  CircunferenciaAbdominalResultado,
} from "@/services/ca-service";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Table, BookOpen, FlaskConical } from "lucide-react"; // Ajustando os ícones para padronização.
import { renderBadge } from "@/utils/badge-utils";
import { normalizarGenero } from "@/utils/normalizar-genero";
import { useUserProfile } from "../contexts/UserProfileContext";
import { TriagemInfo } from "./TriagemInfo";
import { AltoRendimentoInfo } from "./AltoRendimentoInfo";
import { InfoGeralAvaliacao } from "./InfoGeralAvaliacao";
import { AnamneseInfo } from "./AnamneseInfo";
import { DobrasCutaneasInfo } from "./DobrasCutaneasInfo";
import { MedidasCorporaisInfo } from "./MedidasCorporaisInfo";

// Tipagem para os índices de avaliação
interface IndicesAvaliacao {
  imc?: number;
  classificacaoIMC?: string;
  ca?: number;
  classificacaoCA?: string;
  rcq?: number;
  classificacaoRCQ?: string;
  percentualGC_Marinha?: number; // Percentual de Gordura Corporal (US Navy)
  classificacaoGC_Marinha?: string; // Classificação do Percentual de Gordura (US Navy)
  riscoCA?: string;
  referenciaCA?: string;
  referenciaRCQ?: string;
  referenciaGC_Marinha?: string; // Referência US Navy
  genero?: string; // Adicionado para corrigir o erro
}

// Tipagem para o resultado de avaliação
export interface ResultadoAvaliacaoProps {
  resultado: {
    indices?: IndicesAvaliacao;
    genero?: string;
    riscoCA?: string;
    referenciaCA?: string;
    referenciaRCQ?: string;
    referenciaGC_Marinha?: string;
    // Campos específicos para triagem
    bloco2?: Record<string, unknown>;
    bloco3?: Record<string, unknown>;
    bloco4?: Record<string, unknown>;
    bloco5?: Record<string, unknown>;
    // Campos específicos para alto rendimento
    atleta?: Record<string, unknown>;
    // Campos específicos para anamnese
    historicoTreino?: Record<string, unknown>;
    preferenciasIndividuais?: Record<string, unknown>;
    lesoesLimitacoes?: Record<string, unknown>;
    estiloVidaRecuperacao?: Record<string, unknown>;
    // Campos específicos para dobras cutâneas
    protocolo?: string;
    medidas?: Record<string, number>;
    resultados?: {
      percentualGordura?: number;
      massaGorda?: number;
      massaMagra?: number;
      massaMuscular?: number;
      musculoEsqueletico?: number;
      classificacao?: string;
    };
    // Campos específicos para medidas corporais
    peso?: number;
    altura?: number;
    circunferencias?: Record<string, number>;
    diametros?: Record<string, number>;
    // Campos comuns para informações gerais
    criadoEm?: string;
    atualizadoEm?: string;
    usuario?: {
      nome: string;
      email: string;
    };
    professor?: {
      nome: string;
      email: string;
    };
    status?: string;
    validade?: string;
    observacoes?: string;
  };
  inModal?: boolean; // Adicionando a propriedade inModal
  generoUsuario?: string; // Novo prop opcional para garantir o gênero correto
  tipo?: string; // Tipo da avaliação para determinar qual componente usar
  objetivoClassificado?: string; // Objetivo classificado automaticamente
  status?: string; // Status explícito da avaliação
}

// Componente principal que exibe os resultados de avaliação
export function ResultadoAvaliacao({
  resultado,
  inModal,
  generoUsuario,
  tipo,
  objetivoClassificado,
  status,
}: ResultadoAvaliacaoProps) {
  // Busca o gênero do contexto caso não venha por prop
  const { profile } = useUserProfile();
  const generoContexto = profile?.genero;

  if (!resultado || typeof resultado !== "object") return null;

  // Renderiza as informações gerais apenas quando não está em modal
  const renderInfoGeral = () => {
    if (inModal) return null;

    return (
      <InfoGeralAvaliacao
        criadoEm={resultado.criadoEm || new Date().toISOString()}
        atualizadoEm={resultado.atualizadoEm}
        usuario={resultado.usuario}
        professor={resultado.professor}
        status={resultado.status || "concluída"}
        tipo={tipo || "medidas"}
        objetivoClassificado={objetivoClassificado}
        validade={resultado.validade}
        observacoes={resultado.observacoes}
      />
    );
  };

  // Verifica se é uma avaliação de triagem
  if (
    tipo === "triagem" ||
    (resultado.bloco2 &&
      resultado.bloco3 &&
      resultado.bloco4 &&
      resultado.bloco5)
  ) {
    return (
      <div>
        {renderInfoGeral()}
        <TriagemInfo
          resultado={
            resultado as unknown as Parameters<
              typeof TriagemInfo
            >[0]["resultado"]
          }
          objetivoClassificado={objetivoClassificado}
        />
      </div>
    );
  }

  // Verifica se é uma avaliação de alto rendimento
  if (tipo === "alto_rendimento" || resultado.atleta) {
    return (
      <div>
        {renderInfoGeral()}
        <AltoRendimentoInfo
          resultado={
            resultado as unknown as Parameters<
              typeof AltoRendimentoInfo
            >[0]["resultado"]
          }
        />
      </div>
    );
  }

  // Verifica se é uma avaliação de anamnese
  if (
    tipo === "anamnese" ||
    resultado.historicoTreino ||
    resultado.preferenciasIndividuais ||
    resultado.lesoesLimitacoes ||
    resultado.estiloVidaRecuperacao
  ) {
    return (
      <div>
        {renderInfoGeral()}
        <AnamneseInfo
          resultado={
            resultado as unknown as Parameters<
              typeof AnamneseInfo
            >[0]["resultado"]
          }
        />
      </div>
    );
  }

  // Verifica se é uma avaliação de dobras cutâneas
  if (
    tipo === "dobras-cutaneas" ||
    tipo === "dobras_cutaneas" ||
    (resultado.protocolo && resultado.medidas)
  ) {
    // Debug: verificar dados chegando no resultado
    console.log("🔍 ResultadoAvaliacao - Dobras Cutâneas - Dados recebidos:", resultado);
    console.log("🔍 ResultadoAvaliacao - Campos de data disponíveis:", {
      dataAvaliacao: (resultado as any).dataAvaliacao,
      data: (resultado as any).data,
      createdAt: resultado.criadoEm,
      updatedAt: resultado.atualizadoEm
    });
    
    // Garantir que todos os dados necessários sejam passados para DobrasCutaneasInfo
    const resultadoCompleto = {
      ...resultado,
      // Garantir que a data esteja sempre presente
      dataAvaliacao: (resultado as any).dataAvaliacao || (resultado as any).data || resultado.criadoEm,
      // Mapear possíveis variações de campo para garantir compatibilidade
      resultados: {
        ...(resultado.resultados || {}),
        // Garantir que novos campos sejam incluídos se existirem
        massaMuscular: (resultado.resultados as any)?.massaMuscular,
        musculoEsqueletico: (resultado.resultados as any)?.musculoEsqueletico,
        // Mapear possíveis variações de nomes de campos
        somaDobras: (resultado.resultados as any)?.somaTotal || (resultado.resultados as any)?.somaDobras,
        densidade: (resultado.resultados as any)?.densidadeCorporal || (resultado.resultados as any)?.densidade,
      }
    };
    
    return (
      <div>
        {renderInfoGeral()}
        <DobrasCutaneasInfo
          resultado={resultadoCompleto as Parameters<typeof DobrasCutaneasInfo>[0]["resultado"]}
        />
      </div>
    );
  }

  // Declaração antecipada de indices para evitar erro de uso antes da atribuição
  const indices: IndicesAvaliacao = resultado.indices ?? {};

  // Verifica se é uma avaliação de medidas corporais SEM índices (apenas medidas básicas)
  if (
    (tipo === "medidas" || tipo === "medidas-corporais") &&
    !resultado.indices &&
    !indices.imc &&
    !indices.ca &&
    !indices.rcq &&
    (resultado.circunferencias || resultado.diametros || (resultado.peso && resultado.altura))
  ) {
    // Debug: verificar dados chegando no resultado para medidas corporais
    console.log("🔍 ResultadoAvaliacao - Medidas Corporais - Dados recebidos:", resultado);
    console.log("🔍 ResultadoAvaliacao - Medidas Corporais - Campos de data disponíveis:", {
      dataAvaliacao: (resultado as any).dataAvaliacao,
      data: (resultado as any).data,
      createdAt: resultado.criadoEm,
      updatedAt: resultado.atualizadoEm
    });
    
    return (
      <div>
        {renderInfoGeral()}
        <MedidasCorporaisInfo
          resultado={{ 
            ...resultado, 
            status: status ?? resultado.status,
            dataAvaliacao: (resultado as any).dataAvaliacao || (resultado as any).data || resultado.criadoEm
          }}
        />
      </div>
    );
  }

  const imc = indices.imc ?? resultado.indices?.imc;
  const classificacaoImc =
    indices.classificacaoIMC ?? resultado.indices?.classificacaoIMC;
  const ca = indices.ca ?? resultado.indices?.ca;
  const classificacaoCa =
    indices.classificacaoCA ?? resultado.indices?.classificacaoCA;
  const rcq = indices.rcq ?? resultado.indices?.rcq;
  // Busca o gênero na seguinte ordem: prop, contexto, indices, resultado
  const generoRaw =
    generoUsuario ??
    generoContexto ??
    indices.genero ??
    resultado.genero ??
    "não informado";
  const genero = normalizarGenero(generoRaw) ?? "não reconhecido";
  const classificacaoRcq =
    rcq !== undefined && rcq !== null && !isNaN(Number(rcq))
      ? classificarRCQ(Number(rcq), genero)
      : "Dados de RCQ não disponíveis";

  const percentualGC_Marinha = indices.percentualGC_Marinha;
  const classificacaoGC_Marinha = indices.classificacaoGC_Marinha;

  // Se tem índices calculados, usa o componente MedidasCorporaisInfo completo
  if (imc || ca || rcq || percentualGC_Marinha) {
    // Debug: verificar dados chegando no resultado para medidas corporais com índices
    console.log("🔍 ResultadoAvaliacao - Medidas Corporais (com índices) - Dados recebidos:", resultado);
    console.log("🔍 ResultadoAvaliacao - Medidas Corporais (com índices) - Campos de data disponíveis:", {
      dataAvaliacao: (resultado as any).dataAvaliacao,
      data: (resultado as any).data,
      createdAt: resultado.criadoEm,
      updatedAt: resultado.atualizadoEm
    });
    
    return (
      <div className={`space-y-4 ${inModal ? "modal-class" : ""}`}>
        {renderInfoGeral()}
        <MedidasCorporaisInfo
          resultado={{
            ...resultado,
            status: status ?? resultado.status,
            dataAvaliacao: (resultado as any).dataAvaliacao || (resultado as any).data || resultado.criadoEm,
            indices: {
              imc,
              classificacaoIMC: classificacaoImc,
              ca,
              classificacaoCA: classificacaoCa,
              rcq,
              classificacaoRCQ: classificacaoRcq,
              percentualGC_Marinha,
              classificacaoGC_Marinha,
              riscoCA: indices.riscoCA,
              referenciaCA: indices.referenciaCA,
              referenciaRCQ: indices.referenciaRCQ,
              referenciaGC_Marinha: indices.referenciaGC_Marinha,
            },
          }}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${inModal ? "modal-class" : ""}`}>
      {/* Exibe informações gerais apenas quando não está em modal */}
      {renderInfoGeral()}

      {/* Fallback: Exibe componentes individuais se não conseguiu processar com outros componentes */}
      {/* Exibe IMC usando ImcInfo */}
      {imc && classificacaoImc && (
        <ImcInfo imc={imc} classificacao={classificacaoImc} />
      )}

      {/* Exibe CA usando CaInfo */}
      {ca && classificacaoCa && (
        <CaInfo
          resultado={{
            valor: ca,
            classificacao: classificacaoCa,
            risco: indices.riscoCA ?? "",
            referencia: indices.referenciaCA ?? "",
          }}
        />
      )}

      {/* Exibe RCQ usando RcqInfo */}
      {rcq && classificacaoRcq && (
        <RcqInfo
          valor={rcq}
          classificacao={classificacaoRcq}
          referencia={indices.referenciaRCQ ?? ""}
        />
      )}

      {/* Exibe Percentual de Gordura Corporal (US Navy) usando PercentualGorduraInfo */}
      {percentualGC_Marinha && classificacaoGC_Marinha && (
        <PercentualGorduraInfo
          valor={percentualGC_Marinha}
          classificacao={classificacaoGC_Marinha}
          referencia={indices.referenciaGC_Marinha ?? ""}
        />
      )}
    </div>
  );
}

type ResultadoAvaliacoesProps = {
  resultadoIMC?: {
    valor: number;
    classificacao: string;
    risco: string;
    referencia: string;
  };
  resultadoCA?: {
    valor: number;
    classificacao: string;
    risco: string;
    referencia: string;
  };
  // ...outros resultados de avaliações
};

export function ResultadoAvaliacoes({
  resultadoIMC,
  resultadoCA,
}: ResultadoAvaliacoesProps) {
  return (
    <div>
      {resultadoIMC && (
        <ImcInfo
          imc={resultadoIMC.valor}
          classificacao={resultadoIMC.classificacao}
        />
      )}
      {resultadoCA && <CaInfo resultado={resultadoCA} />}
    </div>
  );
}

// Componente reutilizável para renderizar tabelas de classificação
function TabelaClassificacao({
  classificacoes,
  badgeClassificacoes,
}: {
  classificacoes: Array<{ label: string; homens: string; mulheres: string }>;
  badgeClassificacoes: Array<{
    min: number;
    max: number;
    label: string;
    color: string;
  }>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs border mt-2 mb-4 text-center">
        <thead>
          <tr>
            <th className="border px-2 py-1">Classificação</th>
            <th className="border px-2 py-1">Homens</th>
            <th className="border px-2 py-1">Mulheres</th>
          </tr>
        </thead>
        <tbody>
          {classificacoes.map(({ label, homens, mulheres }) => (
            <tr key={label}>
              <td className="border px-2 py-1">
                {renderBadge(label, badgeClassificacoes)}
              </td>
              <td className="border px-2 py-1">
                {renderBadge(homens, badgeClassificacoes)}
              </td>
              <td className="border px-2 py-1">
                {renderBadge(mulheres, badgeClassificacoes)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Tipagem para o componente PercentualGorduraInfo
type PercentualGorduraInfoProps = {
  valor: number;
  classificacao: string;
  referencia?: string;
};

export function PercentualGorduraInfo({
  valor,
  classificacao,
}: PercentualGorduraInfoProps) {
  // Array para exibição da tabela
  const classificacoes = [
    { label: "Essencial", homens: "2–5%", mulheres: "10–13%" },
    { label: "Atletas", homens: "6–13%", mulheres: "14–20%" },
    { label: "Fitness", homens: "14–17%", mulheres: "21–24%" },
    { label: "Média", homens: "18–24%", mulheres: "25–31%" },
    { label: "Obeso", homens: "≥ 25%", mulheres: "≥ 32%" },
  ];

  // Array para o renderBadge, conforme tipagem BadgeClassificacao[]
  const badgeClassificacoes = [
    {
      min: 0,
      max: 5,
      label: "Essencial",
      color: "bg-green-100 text-green-700 border border-green-200",
    },
    {
      min: 6,
      max: 13,
      label: "Atletas",
      color: "bg-green-100 text-green-700 border border-green-200",
    },
    {
      min: 14,
      max: 17,
      label: "Fitness",
      color: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    },
    {
      min: 18,
      max: 24,
      label: "Média",
      color: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    },
    {
      min: 25,
      max: 100,
      label: "Obeso",
      color: "bg-red-100 text-red-700 border border-red-200",
    },
  ];

  return (
    <Card className="mb-4 shadow-sm border border-zinc-200">
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-bold text-lg text-zinc-800 mb-1">
            Percentual de Gordura Corporal (US Navy):{" "}
            <span className="text-2xl font-mono">{valor.toFixed(2)}%</span>
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-zinc-700">Classificação:</span>
            {renderBadge(classificacao, badgeClassificacoes)}
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full mt-2">
          <AccordionItem value="tabela">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Table className="w-4 h-4 text-blue-600" />
                Tabela de classificação
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <TabelaClassificacao
                classificacoes={classificacoes}
                badgeClassificacoes={badgeClassificacoes}
              />
            </AccordionContent>
          </AccordionItem>
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
                <li>Baseado no método da US Navy, validado cientificamente.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

export function ModalMedidasCorporais({
  tipoAvaliacao,
}: {
  tipoAvaliacao: string;
}) {
  const [resultadoCA, setResultadoCA] =
    React.useState<CircunferenciaAbdominalResultado | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await avaliarCA({ valor: Number(0), genero: "masculino" }); // Exemplo, ajuste conforme uso real
    console.log("Resultado CA da API:", res); // <-- Aqui você vê o resultado no console
    setResultadoCA(res);
  }

  return (
    <div>
      {tipoAvaliacao === "medidas" && (
        <form onSubmit={handleSubmit}>{/* ...inputs... */}</form>
      )}
      {resultadoCA && <CaInfo resultado={resultadoCA} />}
    </div>
  );
}

// Nova função para classificar RCQ
export function classificarRCQ(rcq: number, genero: string): string {
  if (!genero || (genero !== "masculino" && genero !== "feminino")) {
    return "Gênero não reconhecido";
  }

  if (genero === "masculino") {
    if (rcq < 0.9) return "Baixo risco";
    if (rcq >= 0.9 && rcq <= 0.99) return "Risco moderado";
    return "Alto risco";
  }

  if (genero === "feminino") {
    if (rcq < 0.8) return "Baixo risco";
    if (rcq >= 0.8 && rcq <= 0.84) return "Risco moderado";
    return "Alto risco";
  }

  return "Gênero não reconhecido";
}

// Atualizar o componente RcqInfo para usar TabelaClassificacao
export function RcqInfo({
  valor,
  classificacao,
}: {
  valor: number;
  classificacao: string;
  referencia: string;
}) {
  const classificacoes = [
    { label: "Baixo risco", homens: "< 0.9", mulheres: "< 0.8" },
    { label: "Risco moderado", homens: "0.9–0.99", mulheres: "0.8–0.84" },
    { label: "Alto risco", homens: "> 0.99", mulheres: "> 0.84" },
  ];

  const badgeClassificacoes = [
    {
      min: 0,
      max: 0.89,
      label: "Baixo risco",
      color: "bg-green-100 text-green-700 border border-green-200",
    },
    {
      min: 0.9,
      max: 0.99,
      label: "Risco moderado",
      color: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    },
    {
      min: 1,
      max: 100,
      label: "Alto risco",
      color: "bg-red-100 text-red-700 border border-red-200",
    },
  ];

  return (
    <Card className="mb-4 shadow-sm border border-zinc-200">
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-bold text-lg text-zinc-800 mb-1">
            Relação cintura-quadril (RCQ):{" "}
            <span className="text-2xl font-mono">{valor.toFixed(2)}</span>
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-zinc-700">Classificação:</span>
            {renderBadge(classificacao, badgeClassificacoes)}
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full mt-2">
          <AccordionItem value="tabela">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Table className="w-4 h-4 text-blue-600" />
                Tabela de classificação
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <TabelaClassificacao
                classificacoes={classificacoes}
                badgeClassificacoes={badgeClassificacoes}
              />
            </AccordionContent>
          </AccordionItem>
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
                <li>Baseado no método da US Navy, validado cientificamente.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

// Atualizar o componente CaInfo para usar TabelaClassificacao
export function CaInfo({
  resultado,
}: {
  resultado: {
    valor: number;
    classificacao: string;
    risco: string;
    referencia: string;
  };
}) {
  const classificacoes = [
    { label: "Baixo risco", homens: "< 94 cm", mulheres: "< 80 cm" },
    { label: "Risco moderado", homens: "94–102 cm", mulheres: "80–88 cm" },
    { label: "Alto risco", homens: "> 102 cm", mulheres: "> 88 cm" },
  ];

  const badgeClassificacoes = [
    {
      min: 0,
      max: 93,
      label: "Baixo risco",
      color: "bg-green-100 text-green-700 border border-green-200",
    },
    {
      min: 94,
      max: 102,
      label: "Risco moderado",
      color: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    },
    {
      min: 103,
      max: 1000,
      label: "Alto risco",
      color: "bg-red-100 text-red-700 border border-red-200",
    },
  ];

  return (
    <Card className="mb-4 shadow-sm border border-zinc-200">
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-bold text-lg text-zinc-800 mb-1">
            Circunferência Abdominal (CA):{" "}
            <span className="text-2xl font-mono">
              {resultado.valor.toFixed(2)} cm
            </span>
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-zinc-700">Classificação:</span>
            {renderBadge(resultado.classificacao, badgeClassificacoes)}
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full mt-2">
          <AccordionItem value="tabela">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Table className="w-4 h-4 text-blue-600" />
                Tabela de classificação
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <TabelaClassificacao
                classificacoes={classificacoes}
                badgeClassificacoes={badgeClassificacoes}
              />
            </AccordionContent>
          </AccordionItem>
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
                  Organização Mundial da Saúde (OMS) - Diretrizes para avaliação
                  de obesidade.
                </li>
                <li>
                  <a
                    href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4869763/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    NCBI - Circunferência Abdominal
                  </a>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
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

// Corrigir o componente ImcInfo para exibir as indicações corretamente
export function ImcInfo({
  imc,
  classificacao,
}: {
  imc: number;
  classificacao: string;
}) {
  const classificacoes = [
    { label: "Abaixo do peso", homens: "< 18.5", mulheres: "< 18.5" },
    { label: "Peso normal", homens: "18.5–24.9", mulheres: "18.5–24.9" },
    { label: "Sobrepeso", homens: "25–29.9", mulheres: "25–29.9" },
    { label: "Obesidade", homens: "≥ 30", mulheres: "≥ 30" },
  ];

  const badgeClassificacoes = [
    {
      min: 0,
      max: 18.4,
      label: "Abaixo do peso",
      color: "bg-blue-100 text-blue-700 border border-blue-200",
    },
    {
      min: 18.5,
      max: 24.9,
      label: "Peso normal",
      color: "bg-green-100 text-green-700 border border-green-200",
    },
    {
      min: 25,
      max: 29.9,
      label: "Sobrepeso",
      color: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    },
    {
      min: 30,
      max: 100,
      label: "Obesidade",
      color: "bg-red-100 text-red-700 border border-red-200",
    },
  ];

  return (
    <Card className="mb-4 shadow-sm border border-zinc-200">
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-bold text-lg text-zinc-800 mb-1">
            Índice de Massa Corporal (IMC):{" "}
            <span className="text-2xl font-mono">{imc.toFixed(2)}</span>
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-zinc-700">Classificação:</span>
            {renderBadge(classificacao, badgeClassificacoes)}
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full mt-2">
          <AccordionItem value="tabela">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Table className="w-4 h-4 text-blue-600" />
                Tabela de classificação
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <TabelaClassificacao
                classificacoes={classificacoes}
                badgeClassificacoes={badgeClassificacoes}
              />
            </AccordionContent>
          </AccordionItem>
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
                  Organização Mundial da Saúde (OMS) - Diretrizes para IMC.
                </li>
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
              </ul>
            </AccordionContent>
          </AccordionItem>
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
                  O IMC é uma ferramenta útil para avaliar o estado nutricional
                  de indivíduos, classificando-os em categorias como abaixo do
                  peso, peso normal, sobrepeso e obesidade.
                </li>
                <li>
                  É amplamente utilizado em estudos populacionais e em
                  consultórios médicos para monitorar a saúde.
                </li>
                <li>
                  Apesar de suas limitações, o IMC é um indicador prático e
                  rápido para identificar riscos associados ao excesso ou
                  insuficiência de peso.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
