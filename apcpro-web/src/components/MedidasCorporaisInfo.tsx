import React from "react";
import {
  Ruler,
  Weight,
  User,
  TrendingUp,
  Info,
  BarChart3,
} from "lucide-react";
import { ImcInfo } from "./ImcInfo";
import { CaInfo } from "./CaInfo";
import { RcqInfo } from "./RcqInfo";
import { PercentualGorduraInfo } from "./PercentualGorduraInfo";
// ...existing code...
import { MedidasPorRegiaoCharts } from "./charts/MedidasPorRegiaoCharts";

// Tipagem para o resultado de medidas corporais
interface MedidasCorporaisResultado {
  peso?: number;
  altura?: number;
  idade?: number;
  genero?: string;
  dataAvaliacao?: string; // opcional, usado para exibir a data do registro
  circunferencias?: Record<string, number>;
  diametros?: Record<string, number>;
// ...existing code...
  // Índices calculados usando os componentes específicos
  indices?: {
    imc?: number;
    classificacaoIMC?: string;
    ca?: number;
    classificacaoCA?: string;
    rcq?: number;
    classificacaoRCQ?: string;
    percentualGC_Marinha?: number;
    classificacaoGC_Marinha?: string;
    riscoCA?: string;
    referenciaCA?: string;
    referenciaRCQ?: string;
    referenciaGC_Marinha?: string;
  };
  // Ou valores diretos (para compatibilidade)
  imc?: number;
  classificacaoIMC?: string;
  ca?: number;
  classificacaoCA?: string;
  rcq?: number;
  classificacaoRCQ?: string;
  percentualGC?: number;
  classificacaoGC?: string;
  observacoes?: string;
  status?: string; // Adiciona status opcional
}

interface MedidasCorporaisInfoProps {
  resultado: MedidasCorporaisResultado;
}

/**
 * Componente para exibir resultados de medidas corporais de forma organizada
 */
export function MedidasCorporaisInfo({ resultado }: MedidasCorporaisInfoProps) {
  // Debug: Log dos dados recebidos
  console.log("🔍 MedidasCorporaisInfo - Dados recebidos:", resultado);
// ...existing code...

  const {
    peso,
    altura,
    idade,
    genero,
    circunferencias,
    diametros,
// ...existing code...
    indices,
    // Valores diretos para compatibilidade
    imc: imcDireto,
    classificacaoIMC: classificacaoIMCDireto,
    ca: caDireto,
    classificacaoCA: classificacaoCADireto,
    rcq: rcqDireto,
    classificacaoRCQ: classificacaoRCQDireto,
    percentualGC: percentualGCDireto,
    classificacaoGC: classificacaoGCDireto,
    observacoes,
  } = resultado;

  // Prioriza valores dos índices, depois valores diretos
  const imc = indices?.imc ?? imcDireto;
  const classificacaoIMC = indices?.classificacaoIMC ?? classificacaoIMCDireto;
  const ca = indices?.ca ?? caDireto;
  const classificacaoCA = indices?.classificacaoCA ?? classificacaoCADireto;
  const rcq = indices?.rcq ?? rcqDireto;
  const classificacaoRCQ = indices?.classificacaoRCQ ?? classificacaoRCQDireto;
  const percentualGC = indices?.percentualGC_Marinha ?? percentualGCDireto;
  const classificacaoGC = indices?.classificacaoGC_Marinha ?? classificacaoGCDireto;

  /**
   * Renderiza dados antropométricos básicos
   */
  const renderDadosBasicos = () => {
    // Exibe todos os dados disponíveis, independente do status
    const dados = [
      { label: "Peso", valor: peso, unidade: "kg", icon: Weight },
      { label: "Altura", valor: altura, unidade: "cm", icon: Ruler },
      { label: "Idade", valor: idade, unidade: "anos", icon: User },
      { label: "Gênero", valor: genero, unidade: "", icon: User },
    ].filter(item => item.valor !== undefined && item.valor !== null);

    if (dados.length === 0) return null;

    return (
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 text-lg font-semibold text-blue-800 mb-3">
          <User className="w-5 h-5" />
          Dados Antropométricos
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {dados.map(({ label, valor, unidade, icon: Icon }) => (
            <div
              key={label}
              className="bg-white p-3 rounded-lg border border-blue-300"
            >
              <div className="flex items-center gap-1 mb-1">
                <Icon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  {label}
                </span>
              </div>
              <div className="text-lg font-bold text-blue-900">
                {typeof valor === 'number' ? valor.toFixed(1) : valor} {unidade}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renderiza circunferências
   */
  const renderCircunferencias = () => {
    if (!circunferencias || Object.keys(circunferencias).length === 0) return null;

    return (
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 text-lg font-semibold text-green-800 mb-3">
          <Ruler className="w-5 h-5" />
          Circunferências ({Object.keys(circunferencias).length} medidas)
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(circunferencias).map(([local, valor]) => (
            <div
              key={local}
              className="bg-white p-3 rounded-lg border border-green-300"
            >
              <div className="text-sm font-medium text-green-800 capitalize mb-1">
                {formatarNomeLocal(local)}
              </div>
              <div className="text-lg font-bold text-green-900">
                {valor} cm
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renderiza diâmetros
   */
  const renderDiametros = () => {
    if (!diametros || Object.keys(diametros).length === 0) return null;

    return (
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2 text-lg font-semibold text-purple-800 mb-3">
          <Ruler className="w-5 h-5" />
          Diâmetros Ósseos ({Object.keys(diametros).length} medidas)
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(diametros).map(([local, valor]) => (
            <div
              key={local}
              className="bg-white p-3 rounded-lg border border-purple-300"
            >
              <div className="text-sm font-medium text-purple-800 capitalize mb-1">
                {formatarNomeLocal(local)}
              </div>
              <div className="text-lg font-bold text-purple-900">
                {valor} cm
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renderiza índices calculados usando componentes específicos (sem card wrapper)
   */
  const renderIndicesCalculados = () => {
    const temIndices = imc || ca || rcq || percentualGC;
    if (!temIndices) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Índices Calculados
          </h3>
        </div>

        {/* IMC usando componente específico */}
        {imc && classificacaoIMC && (
          <ImcInfo imc={imc} classificacao={classificacaoIMC} />
        )}

        {/* CA usando componente específico */}
        {ca && classificacaoCA && (
          <CaInfo
            resultado={{
              valor: ca,
              classificacao: classificacaoCA,
              risco: indices?.riscoCA ?? "",
              referencia: indices?.referenciaCA ?? "",
            }}
          />
        )}

        {/* RCQ usando componente específico */}
        {rcq && classificacaoRCQ && (
          <RcqInfo
            valor={rcq}
            classificacao={classificacaoRCQ}
            referencia={indices?.referenciaRCQ ?? ""}
          />
        )}

        {/* Percentual de Gordura usando componente específico */}
        {percentualGC && classificacaoGC && (
          <PercentualGorduraInfo
            valor={percentualGC}
            classificacao={classificacaoGC}
            referencia={indices?.referenciaGC_Marinha ?? ""}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Título principal para identificar a seção */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
        <Ruler className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">
          Resultado das Medidas Corporais
        </h2>
      </div>

      {/* Dados Antropométricos Básicos */}
      {(peso || altura || idade || genero) && renderDadosBasicos()}

      {/* Circunferências */}
      {circunferencias && Object.keys(circunferencias).length > 0 && renderCircunferencias()}

      {/* Diâmetros */}
      {diametros && Object.keys(diametros).length > 0 && renderDiametros()}

      {/* Observações */}
      {observacoes && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
            <Info className="w-5 h-5" />
            Observações
          </div>
          <p className="text-sm text-gray-700">{observacoes}</p>
        </div>
      )}

      {/* Índices Calculados - Renderizados como seção independente */}
      {renderIndicesCalculados()}

      {/* Visualização Gráfica - Gráficos estilo FineShape */}
      {(circunferencias && Object.keys(circunferencias).length >= 4) && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Análise Visual das Medidas
          </div>
          
          <MedidasPorRegiaoCharts
            tronco={{
              torax: circunferencias.torax || circunferencias.peito || 0,
              cintura: circunferencias.cintura || 0,
              abdome: circunferencias.abdominal || circunferencias.abdome || 0,
              quadril: circunferencias.quadril || 0,
            }}
            membrosSuperiores={{
              bracoEsquerdo: circunferencias.bracoEsquerdo || circunferencias.braco || 0,
              bracoDireito: circunferencias.bracoDireito || circunferencias.braco || 0,
              anteBracoEsquerdo: circunferencias.anteBracoEsquerdo || circunferencias.antebraco || 0,
              anteBracoDireito: circunferencias.anteBracoDireito || circunferencias.antebraco || 0,
            }}
            membrosInferiores={{
              coxaEsquerda: circunferencias.coxaEsquerda || circunferencias.coxa || 0,
              coxaDireita: circunferencias.coxaDireita || circunferencias.coxa || 0,
              panturrilhaEsquerda: circunferencias.panturrilhaEsquerda || circunferencias.panturrilha || 0,
              panturrilhaDireita: circunferencias.panturrilhaDireita || circunferencias.panturrilha || 0,
            }}
          />
        </div>
      )}

      {/* Análise Corporal Básica - Para casos com dados limitados */}
      {imc && peso && !(circunferencias && Object.keys(circunferencias).length >= 4) && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Análise Corporal
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">
              IMC: {imc?.toFixed(1)} kg/m²
            </div>
            <div className="text-sm text-gray-600">
              Peso: {peso} kg
              {altura && ` | Altura: ${altura} cm`}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Para análise detalhada da composição corporal, realize uma avaliação de dobras cutâneas.
            </p>
          </div>
        </div>
      )}

      {/* Informação caso não haja dados */}
      {!peso && !altura && !circunferencias && !diametros && !imc && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">
              Nenhum dado de medidas corporais disponível
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Formata o nome do local para exibição
 */
function formatarNomeLocal(nome: string): string {
  const nomes: Record<string, string> = {
    cintura: "Cintura",
    quadril: "Quadril",
    braco: "Braço",
    biceps: "Bíceps",
    antebraco: "Antebraço",
    coxa: "Coxa",
    panturrilha: "Panturrilha",
    torax: "Tórax",
    abdominal: "Abdominal",
    pescoco: "Pescoço",
    ombro: "Ombro",
    punho: "Punho",
    joelho: "Joelho",
    tornozelo: "Tornozelo",
    biestiloideo: "Biestilóideo",
    biepicondiliano: "Biepicondiliano",
    femur: "Fêmur",
    triceps: "Tríceps",
    peito: "Peito",
    tronco: "Tronco",
    costas: "Costas",
    ombros: "Ombros",
    // Adicione outros nomes conforme necessário
  };

  return nomes[nome.toLowerCase()] || nome.charAt(0).toUpperCase() + nome.slice(1);
}