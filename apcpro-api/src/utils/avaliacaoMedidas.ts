import { converterMedidasJson } from "./conversorMedidas";

// Função utilitária para processar o body do frontend:
export function processarMedidas(body: any) {
  const medidas = converterMedidasJson(body);
  return calcularIndicesMedidas(medidas);
}

type Sexo = 0 | 1 | "masculino" | "feminino";

export interface MedidasInput {
  peso: number;
  altura: number; // em cm
  idade: number;
  sexo: Sexo;
  cintura: number; // em cm
  pescoco?: number; // em cm
  quadril?: number; // em cm (obrigatório para mulheres)
  abdomen?: number; // em cm
}

// Função utilitária para converter sexo para número
function sexoToNumber(sexo: Sexo): 0 | 1 {
  if (sexo === 1 || sexo === "masculino") return 1;
  return 0; // feminino ou 0
}

function log10(x: number): number {
  return Math.log(x) / Math.LN10;
}

export function calcularIndicesMedidas(dados: MedidasInput) {
  const sexoNum = sexoToNumber(dados.sexo);
  const alturaM = dados.altura / 100;
  const imc = dados.peso / (alturaM * alturaM);

  // %GC Deurenberg
  const percentualGC_Deurenberg =
    1.2 * imc + 0.23 * dados.idade - 10.8 * sexoNum - 5.4;

  // %GC Gómez-Ambrosi
  const cc = dados.cintura;
  const percentualGC_Gomez =
    -44.988 +
    0.503 * dados.idade +
    10.689 * sexoNum +
    3.172 * imc +
    0.026 * cc -
    0.02 * imc * cc -
    0.015 * imc * dados.idade +
    0.00021 * imc * imc * cc -
    0.000084 * imc * cc * dados.idade;

  // Massa Muscular (Lee) - sem raça
  const massaMuscular_Lee =
    0.244 * dados.peso +
    7.8 * alturaM +
    6.6 * sexoNum -
    0.098 * dados.idade -
    3.3;

  // Massa Muscular Esquelética (Doupe)
  const massaMuscular_Doupe = 0.407 * dados.peso + 0.267 * dados.altura - 19.2;

  // %GC Protocolo Marinha dos EUA
  let percentualGC_Marinha: number | null = null;
  if (
    typeof dados.pescoco === "number" &&
    typeof dados.cintura === "number" &&
    typeof dados.altura === "number"
  ) {
    if (sexoNum === 1) {
      // Homem: precisa de cintura, pescoco, altura
      percentualGC_Marinha =
        495 /
          (1.0324 -
            0.19077 * log10(dados.cintura - dados.pescoco) +
            0.15456 * log10(dados.altura)) -
        450;
    } else if (
      typeof dados.quadril === "number" &&
      typeof dados.cintura === "number" &&
      typeof dados.pescoco === "number" &&
      typeof dados.altura === "number"
    ) {
      // Mulher: precisa de cintura, quadril, pescoco, altura
      percentualGC_Marinha =
        495 /
          (1.29579 -
            0.35004 * log10(dados.cintura + dados.quadril - dados.pescoco) +
            0.221 * log10(dados.altura)) -
        450;
    }
  }

  // Relação Cintura-Quadril (RCQ)
  let rcq: number | null = null;
  if (typeof dados.cintura === "number" && typeof dados.quadril === "number") {
    rcq = dados.cintura / dados.quadril;
  }

  // Circunferência Abdominal (CA)
  const ca = typeof dados.abdomen === "number" ? dados.abdomen : null;

  return {
    ...dados,
    imc,
    classificacaoIMC: classificarIMC(imc),
    percentualGC_Deurenberg,
    classificacaoGC_Deurenberg: classificarPercentualGC(
      percentualGC_Deurenberg,
      dados.sexo,
      dados.idade
    ),
    percentualGC_Gomez,
    classificacaoGC_Gomez: classificarPercentualGC(
      percentualGC_Gomez,
      dados.sexo,
      dados.idade
    ),
    percentualGC_Marinha,
    classificacaoGC_Marinha: classificarPercentualGC(
      percentualGC_Marinha,
      dados.sexo,
      dados.idade
    ),
    massaMuscular_Lee,
    massaMuscular_Doupe,
    rcq,
    classificacaoRCQ: rcq ? classificarRCQ(rcq, dados.sexo) : null,
    ca,
    classificacaoCA: classificarCA(ca, dados.sexo),
  };
}

// Classificação IMC (OMS)
// Observação: O IMC é mais indicado para adultos saudáveis. Pode não refletir adequadamente a composição corporal de atletas, idosos ou pessoas muito musculosas.
function classificarIMC(imc: number): string {
  if (imc < 18.5) return "Baixo peso"; // Mais comum em adolescentes, idosos ou pessoas com desnutrição
  if (imc < 25) return "Peso normal"; // Indicado para adultos saudáveis e praticantes recreativos
  if (imc < 30) return "Sobrepeso"; // Frequente em adultos sedentários ou com leve excesso de gordura
  if (imc < 35) return "Obesidade grau I"; // Risco aumentado, comum em adultos com maus hábitos alimentares
  if (imc < 40) return "Obesidade grau II"; // Risco alto, atenção especial para adultos e idosos
  return "Obesidade grau III"; // Risco muito alto, geralmente demanda acompanhamento multiprofissional
}

// Classificação RCQ (OMS/ACSM)
// Observação: O RCQ é útil para identificar risco cardiovascular, especialmente em adultos e idosos. Pode não ser tão preciso para atletas.
function classificarRCQ(rcq: number, sexo: Sexo): string {
  const sexoNum = sexoToNumber(sexo);
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
function classificarCA(ca: number | null, sexo: Sexo): string | null {
  if (ca == null) return null;
  const sexoNum = sexoToNumber(sexo);
  if (sexoNum === 1) {
    // Homem
    if (ca < 94) return "Baixo risco"; // Indicado para adultos jovens e praticantes de atividade física
    if (ca < 102) return "Risco aumentado"; // Frequente em adultos sedentários ou com sobrepeso
    return "Risco muito aumentado"; // Comum em adultos com obesidade abdominal
  } else {
    // Mulher
    if (ca < 80) return "Baixo risco"; // Indicado para mulheres jovens e ativas
    if (ca < 88) return "Risco aumentado"; // Frequente em mulheres sedentárias ou com sobrepeso
    return "Risco muito aumentado"; // Comum em mulheres com obesidade abdominal ou pós-menopausa
  }
}

// Classificação %GC (ACSM/Navy) - exemplo simplificado
// Observação: O %GC é mais preciso para avaliar composição corporal em atletas, praticantes de atividade física e acompanhamento de emagrecimento.
function classificarPercentualGC(
  percentualGC: number | null,
  sexo: Sexo,
  idade: number
): string | null {
  if (percentualGC == null) return null;
  const sexoNum = sexoToNumber(sexo);
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
