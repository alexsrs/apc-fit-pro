/**
 * Protocolo de Faulkner para Dobras Cutâneas (4 pontos)
 * Referência: Faulkner, J.A. (1968)
 * Pontos: Tríceps, Subescapular, Supra-ilíaca, Bicipital
 */

export interface MedidasFaulkner {
  subescapular: number;
  triceps: number;
  abdominal: number;
  suprailiaca: number;
}

export interface ResultadoFaulkner {
  somaTotal: number;
  percentualGordura: number;
  massaGorda: number;
  massaMagra: number;
  classificacao: string;
}

/**
 * Calcula percentual de gordura pelo protocolo Faulkner
 * @param medidas Medidas das dobras cutâneas em mm
 * @param genero Gênero do avaliado ('M' ou 'F')
 * @param peso Peso corporal em kg
 * @returns Resultado dos cálculos
 */
export function calcularFaulkner(
  medidas: MedidasFaulkner,
  genero: 'M' | 'F',
  peso: number
): ResultadoFaulkner {
  const { subescapular, triceps, abdominal, suprailiaca } = medidas;

  // Validação das medidas (3-50mm típico para dobras cutâneas)
  if (
    subescapular < 3 || subescapular > 50 ||
    triceps < 3 || triceps > 50 ||
    abdominal < 3 || abdominal > 50 ||
    suprailiaca < 3 || suprailiaca > 50
  ) {
    throw new Error('Medidas de dobras cutâneas devem estar entre 3-50mm');
  }

  // Soma das 4 dobras
  const somaTotal = subescapular + triceps + abdominal + suprailiaca;

  // Fórmulas de Faulkner específicas por gênero
  let percentualGordura: number;

  if (genero === 'M') {
    // Fórmula para homens
    percentualGordura = 0.153 * somaTotal + 5.783;
  } else {
    // Fórmula para mulheres
    percentualGordura = 0.154 * somaTotal + 5.045;
  }

  // Cálculos derivados
  const massaGorda = (percentualGordura / 100) * peso;
  const massaMagra = peso - massaGorda;

  // Classificação baseada no percentual de gordura
  const classificacao = classificarGorduraFaulkner(percentualGordura, genero);

  return {
    somaTotal: Math.round(somaTotal * 10) / 10,
    percentualGordura: Math.round(percentualGordura * 10) / 10,
    massaGorda: Math.round(massaGorda * 10) / 10,
    massaMagra: Math.round(massaMagra * 10) / 10,
    classificacao
  };
}

/**
 * Classifica o percentual de gordura segundo referências científicas
 */
function classificarGorduraFaulkner(percentual: number, genero: 'M' | 'F'): string {
  if (genero === 'M') {
    if (percentual < 6) return 'Muito Baixo';
    if (percentual < 11) return 'Atletas';
    if (percentual < 16) return 'Ótimo';
    if (percentual < 21) return 'Bom';
    if (percentual < 26) return 'Acima do Ideal';
    return 'Obesidade';
  } else {
    if (percentual < 12) return 'Muito Baixo';
    if (percentual < 17) return 'Atletas';
    if (percentual < 22) return 'Ótimo';
    if (percentual < 27) return 'Bom';
    if (percentual < 32) return 'Acima do Ideal';
    return 'Obesidade';
  }
}

/**
 * Valida se as medidas estão dentro dos ranges aceitáveis
 */
export function validarMedidasFaulkner(medidas: MedidasFaulkner): boolean {
  const { triceps, subescapular, suprailiaca, abdominal } = medidas;
  
  return triceps >= 3 && triceps <= 50 &&
         subescapular >= 3 && subescapular <= 50 &&
         suprailiaca >= 3 && suprailiaca <= 50 &&
         abdominal >= 3 && abdominal <= 50;
}
