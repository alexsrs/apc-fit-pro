import { Genero } from "../models/genero-model";
import { RcqService } from "../services/rcq-service";
import { converterMedidasJson } from "./conversorMedidas";
import { RCQResultado } from "../models/rcq-model";
import { generoParaString } from "./genero-converter";

// Função utilitária para processar o body do frontend:
export function processarMedidas(body: any) {
  const medidas = converterMedidasJson(body);
  return calcularIndicesMedidas(medidas);
}

// Interface para dobras cutâneas (7 pontos mais comuns)
export interface DobrasCutaneas {
  triceps?: number;          // mm
  biceps?: number;           // mm
  subescapular?: number;     // mm
  suprailiaca?: number;      // mm
  abdominal?: number;        // mm
  coxa?: number;             // mm
  panturrilha?: number;      // mm
}

export interface MedidasInput {
  peso: number;
  altura: number; // em cm
  idade: number;
  genero: Genero;
  cintura: number; // em cm
  pescoco?: number; // em cm
  quadril?: number; // em cm (obrigatório para mulheres)
  abdomen?: number; // em cm
  // Novo: Dobras cutâneas
  dobras?: DobrasCutaneas;
}

// Função utilitária para converter genero para número
export function generoToNumber(genero: Genero): 0 | 1 {
  return genero === Genero.Masculino ? 1 : 0;
}

function log10(x: number): number {
  return Math.log(x) / Math.LN10;
}

// Método da Marinha dos EUA (Navy Method)
const calcularPercentualGorduraMarinha = (dados: {
  cintura: number;
  pescoco: number;
  quadril?: number;
  altura: number;
  sexo: "masculino" | "feminino";
}): number => {
  const alturaLog = Math.log10(dados.altura);
  if (dados.sexo === "masculino") {
    return (
      495 /
        (1.0324 -
          0.19077 * Math.log10(dados.cintura - dados.pescoco) +
          0.15456 * alturaLog) -
      450
    );
  } else {
    return (
      495 /
        (1.29579 -
          0.35004 * Math.log10(dados.cintura + dados.quadril! - dados.pescoco) +
          0.221 * alturaLog) -
      450
    );
  }
};

// Classificação do percentual de gordura corporal
const classificarPercentualGordura = (
  percentual: number,
  sexo: "masculino" | "feminino"
): string => {
  const classificacoes =
    sexo === "masculino"
      ? [
          { min: 2, max: 5, label: "Essencial" },
          { min: 6, max: 13, label: "Atletas" },
          { min: 14, max: 17, label: "Fitness" },
          { min: 18, max: 24, label: "Média" },
          { min: 25, max: Infinity, label: "Obeso" },
        ]
      : [
          { min: 10, max: 13, label: "Essencial" },
          { min: 14, max: 20, label: "Atletas" },
          { min: 21, max: 24, label: "Fitness" },
          { min: 25, max: 31, label: "Média" },
          { min: 32, max: Infinity, label: "Obeso" },
        ];

  const found = classificacoes.find(
    (c) => percentual >= c.min && percentual <= c.max
  );
  return found ? found.label : "Não classificado";
};

// Função principal para calcular os índices a partir das medidas fornecidas
export function calcularIndicesMedidas(dados: MedidasInput) {
  const sexoNum = generoToNumber(dados.genero);
  const alturaM = dados.altura / 100;
  const imc = dados.peso / (alturaM * alturaM);

  // %GC Deurenberg
  const percentualGC_Deurenberg =
    1.2 * imc + 0.23 * dados.idade - 10.8 * sexoNum - 5.4;

  // %GC Marinha
  const percentualGC_Marinha = calcularPercentualGorduraMarinha({
    cintura: dados.cintura,
    pescoco: dados.pescoco!,
    quadril: dados.quadril,
    altura: dados.altura,
    sexo: generoParaString(dados.genero),
  });

  const classificacaoGC_Marinha = classificarPercentualGordura(
    percentualGC_Marinha,
    generoParaString(dados.genero)
  );

  // Relação Cintura-Quadril (RCQ)
  let rcqResultado: RCQResultado | null = null;
  if (typeof dados.cintura === "number" && typeof dados.quadril === "number") {
    rcqResultado = RcqService.avaliarRCQ({
      cintura: dados.cintura,
      quadril: dados.quadril,
      genero: dados.genero,
    });
  }

  // Circunferência Abdominal (CA)
  const ca = typeof dados.abdomen === "number" ? dados.abdomen : null;

  // Cálculos de Dobras Cutâneas
  let percentualGC_Faulkner: number | null = null;
  let percentualGC_Pollock: number | null = null;
  let percentualGC_Guedes: number | null = null;
  let classificacaoGC_Faulkner: string | null = null;
  let classificacaoGC_Pollock: string | null = null;
  let classificacaoGC_Guedes: string | null = null;

  if (dados.dobras) {
    percentualGC_Faulkner = calculateFaulkner(dados.dobras, dados.genero);
    percentualGC_Pollock = calculatePollock(dados.dobras, dados.genero, dados.idade);
    percentualGC_Guedes = calculateGuedes(dados.dobras, dados.genero);

    // Classificações das dobras cutâneas
    const sexo = generoParaString(dados.genero);
    if (percentualGC_Faulkner !== null) {
      classificacaoGC_Faulkner = classificarPercentualGordura(percentualGC_Faulkner, sexo);
    }
    if (percentualGC_Pollock !== null) {
      classificacaoGC_Pollock = classificarPercentualGordura(percentualGC_Pollock, sexo);
    }
    if (percentualGC_Guedes !== null) {
      classificacaoGC_Guedes = classificarPercentualGordura(percentualGC_Guedes, sexo);
    }
  }

  return {
    ...dados,
    imc,
    classificacaoIMC: classificarIMC(imc),
    rcq: rcqResultado ? rcqResultado.valor : null,
    classificacaoRCQ: rcqResultado ? rcqResultado.classificacao : null,
    referenciaRCQ: rcqResultado ? rcqResultado.referencia : null,
    ca,
    classificacaoCA: ca !== null ? classificarCA(ca, dados.genero) : null,
    percentualGC_Marinha,
    classificacaoGC_Marinha,
    // Novos campos: Dobras Cutâneas
    percentualGC_Faulkner,
    classificacaoGC_Faulkner,
    percentualGC_Pollock,
    classificacaoGC_Pollock,
    percentualGC_Guedes,
    classificacaoGC_Guedes,
  };
}

// Classificação IMC (OMS/CDC)
// https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight
function classificarIMC(imc: number): string {
  if (imc < 18.5) return "Abaixo do peso";
  if (imc < 25) return "Peso normal";
  if (imc < 30) return "Pré-obesidade";
  if (imc < 35) return "Obesidade I";
  if (imc < 40) return "Obesidade II";
  return "Obesidade III";
}

// Classificação RCQ (OMS/ACSM)
// Observação: O RCQ é útil para identificar risco cardiovascular, especialmente em adultos e idosos. Pode não ser tão preciso para atletas.
function classificarRCQ(rcq: number, sexo: Genero): string {
  const sexoNum = generoToNumber(sexo);
  if (sexoNum === 1) {
    // Homem
    if (rcq < 0.9) return "Baixo risco"; // Indicado para adultos jovens e praticantes de atividade física
    if (rcq < 0.99) return "Risco moderado"; // Frequente em adultos sedentários ou com leve acúmulo abdominal
    return "Alto risco"; // Comum em adultos com obesidade central ou idosos
  } else {
    // Mulher
    if (rcq < 0.8) return "Baixo risco"; // Indicado para mulheres jovens e ativas
    if (rcq < 0.85) return "Risco moderado"; // Frequente em mulheres sedentárias ou com leve acúmulo abdominal
    return "Alto risco"; // Comum em mulheres com obesidade central ou pós-menopausa
  }
}

// Classificação CA (Circunferência Abdominal) - risco metabólico (OMS)
// Observação: A CA é um bom indicador de risco metabólico, especialmente para adultos e idosos. Pode não ser adequada para atletas.
export function classificarCA(ca: number, genero: Genero): string {
  if (genero === Genero.Masculino) {
    if (ca < 94) return "Baixo risco";
    if (ca >= 94 && ca <= 102) return "Risco moderado";
    return "Alto risco";
  } else {
    if (ca < 80) return "Baixo risco";
    if (ca >= 80 && ca <= 88) return "Risco moderado";
    return "Alto risco";
  }
}

// Classificação %GC (ACSM/Navy) - exemplo simplificado
// Observação: O %GC é mais preciso para avaliar composição corporal em atletas, praticantes de atividade física e acompanhamento de emagrecimento.
function classificarPercentualGC(
  percentualGC: number | null,
  sexo: Genero,
  idade: number
): string | null {
  if (percentualGC == null) return null;
  const sexoNum = generoToNumber(sexo);
  // Tabela simplificada ACSM (pode ajustar conforme referência desejada)
  const tabelaHomem = [
    { maxIdade: 29, limites: [8, 19, 24] },
    { maxIdade: 39, limites: [11, 21, 26] },
    { maxIdade: 49, limites: [13, 23, 28] },
    { maxIdade: 59, limites: [15, 25, 30] },
    { maxIdade: 150, limites: [17, 27, 32] },
  ];
  const tabelaMulher = [
    { maxIdade: 29, limites: [21, 32, 39] },
    { maxIdade: 39, limites: [23, 33, 40] },
    { maxIdade: 49, limites: [24, 34, 41] },
    { maxIdade: 59, limites: [26, 36, 42] },
    { maxIdade: 150, limites: [27, 37, 43] },
  ];
  const tabela = sexoNum === 1 ? tabelaHomem : tabelaMulher;
  const faixa =
    tabela.find((f) => idade <= f.maxIdade) || tabela[tabela.length - 1];
  const [baixo, adequado, alto] = faixa.limites;
  if (percentualGC < baixo) return "Abaixo do ideal"; // Mais comum em atletas de alto rendimento ou pessoas com baixo percentual de gordura
  if (percentualGC < adequado) return "Ideal"; // Indicado para praticantes regulares de atividade física e adultos saudáveis
  if (percentualGC < alto) return "Acima do ideal"; // Frequente em adultos sedentários ou em processo de emagrecimento
  return "Muito acima do ideal"; // Comum em pessoas com obesidade ou sedentarismo prolongado
}

// ===== FUNÇÕES PARA CÁLCULO DE DOBRAS CUTÂNEAS =====

/**
 * Protocolo de Faulkner et al. (1968) - 4 dobras
 * Usa: triceps, subescapular, suprailíaca, abdominal
 */
export function calculateFaulkner(dobras: DobrasCutaneas, genero: Genero): number | null {
  const { triceps, subescapular, suprailiaca, abdominal } = dobras;
  
  if (!triceps || !subescapular || !suprailiaca || !abdominal) {
    return null; // Precisa das 4 dobras obrigatórias
  }
  
  const somaDobras = triceps + subescapular + suprailiaca + abdominal;
  
  if (genero === Genero.Masculino) {
    return 0.153 * somaDobras + 5.783;
  } else {
    return 0.213 * somaDobras + 7.9;
  }
}

/**
 * Protocolo de Pollock e Jackson (1984) - 3 ou 7 dobras
 * Para homens: triceps, subescapular, suprailíaca
 * Para mulheres: triceps, coxa, suprailíaca
 */
export function calculatePollock(dobras: DobrasCutaneas, genero: Genero, idade: number): number | null {
  const { triceps, subescapular, suprailiaca, coxa } = dobras;
  
  if (genero === Genero.Masculino) {
    if (!triceps || !subescapular || !suprailiaca) {
      return null;
    }
    const somaDobras = triceps + subescapular + suprailiaca;
    const densidadeCorporal = 1.10938 - (0.0008267 * somaDobras) + (0.0000016 * Math.pow(somaDobras, 2)) - (0.0002574 * idade);
    return ((4.95 / densidadeCorporal) - 4.5) * 100;
  } else {
    if (!triceps || !coxa || !suprailiaca) {
      return null;
    }
    const somaDobras = triceps + coxa + suprailiaca;
    const densidadeCorporal = 1.0994921 - (0.0009929 * somaDobras) + (0.0000023 * Math.pow(somaDobras, 2)) - (0.0001392 * idade);
    return ((4.95 / densidadeCorporal) - 4.5) * 100;
  }
}

/**
 * Protocolo de Guedes (1994) - Específico para brasileiros
 * Usa: triceps, subescapular, suprailíaca, panturrilha
 */
export function calculateGuedes(dobras: DobrasCutaneas, genero: Genero): number | null {
  const { triceps, subescapular, suprailiaca, panturrilha } = dobras;
  
  if (!triceps || !subescapular || !suprailiaca || !panturrilha) {
    return null; // Precisa das 4 dobras obrigatórias
  }
  
  const somaDobras = triceps + subescapular + suprailiaca + panturrilha;
  
  if (genero === Genero.Masculino) {
    return 0.1051 * somaDobras + 2.585;
  } else {
    return 0.1548 * somaDobras + 3.580;
  }
}
