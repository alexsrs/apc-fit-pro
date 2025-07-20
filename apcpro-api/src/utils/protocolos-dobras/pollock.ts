/**
 * Protocolo de Pollock para Dobras Cutâneas
 * Referência: Pollock & Jackson (1984)
 * Versões: 3 dobras, 7 dobras e 9 dobras (atletas)
 */

// Versão 3 dobras - Homens: Peitoral, Abdominal, Coxa
export interface MedidasPollock3Homens {
  peitoral: number;
  abdominal: number;
  coxa: number;
}

// Versão 3 dobras - Mulheres: Tríceps, Supra-ilíaca, Coxa
export interface MedidasPollock3Mulheres {
  triceps: number;
  suprailiaca: number;
  coxa: number;
}

// Versão 7 dobras - Ambos os gêneros
export interface MedidasPollock7 {
  triceps: number;
  subescapular: number;
  suprailiaca: number;
  abdominal: number;
  peitoral: number;
  axilarMedia: number;
  coxa: number;
}

// Versão 9 dobras - Para atletas (inclui bíceps e panturrilha)
export interface MedidasPollock9 {
  triceps: number;
  subescapular: number;
  suprailiaca: number;
  abdominal: number;
  peitoral: number;
  axilarMedia: number;
  coxa: number;
  biceps: number;      // NÃO entra na equação, mas SIM na somatória
  panturrilha: number; // NÃO entra na equação, mas SIM na somatória
}

export interface ResultadoPollock {
  somaTotal: number;
  somaEquacao: number; // Soma usada na equação
  densidadeCorporal: number;
  percentualGordura: number;
  massaGorda: number;
  massaMagra: number;
  classificacao: string;
}

/**
 * Calcula percentual de gordura pelo protocolo Pollock - 3 dobras
 * @param medidas Medidas das dobras cutâneas em mm
 * @param genero Gênero do avaliado ('M' ou 'F')
 * @param idade Idade em anos
 * @param peso Peso corporal em kg
 * @returns Resultado dos cálculos
 */
export function calcularPollock3(
  medidas: MedidasPollock3Homens | MedidasPollock3Mulheres,
  genero: 'M' | 'F',
  idade: number,
  peso: number
): ResultadoPollock {
  // Validação da idade
  if (idade < 18 || idade > 61) {
    throw new Error('Protocolo Pollock válido para idades entre 18-61 anos');
  }

  let somaTotal: number;
  let densidadeCorporal: number;

  if (genero === 'M') {
    const { peitoral, abdominal, coxa } = medidas as MedidasPollock3Homens;
    
    // Validação das medidas
    if (peitoral < 3 || peitoral > 50 || 
        abdominal < 3 || abdominal > 50 || 
        coxa < 3 || coxa > 50) {
      throw new Error('Medidas de dobras cutâneas devem estar entre 3-50mm');
    }

    somaTotal = peitoral + abdominal + coxa;
    
    // Fórmula Pollock 3 dobras - Homens
    densidadeCorporal = 1.10938 - (0.0008267 * somaTotal) + (0.0000016 * Math.pow(somaTotal, 2)) - (0.0002574 * idade);
  } else {
    const { triceps, suprailiaca, coxa } = medidas as MedidasPollock3Mulheres;
    
    // Validação das medidas
    if (triceps < 3 || triceps > 50 || 
        suprailiaca < 3 || suprailiaca > 50 || 
        coxa < 3 || coxa > 50) {
      throw new Error('Medidas de dobras cutâneas devem estar entre 3-50mm');
    }

    somaTotal = triceps + suprailiaca + coxa;
    
    // Fórmula Pollock 3 dobras - Mulheres
    densidadeCorporal = 1.0994921 - (0.0009929 * somaTotal) + (0.0000023 * Math.pow(somaTotal, 2)) - (0.0001392 * idade);
  }

  // Conversão para percentual de gordura (Siri, 1961)
  const percentualGordura = ((4.95 / densidadeCorporal) - 4.50) * 100;
  
  // Cálculos derivados
  const massaGorda = (percentualGordura / 100) * peso;
  const massaMagra = peso - massaGorda;
  
  // Classificação baseada no percentual de gordura
  const classificacao = classificarGorduraPollock(percentualGordura, genero);
  
  return {
    somaTotal: Math.round(somaTotal * 10) / 10,
    somaEquacao: Math.round(somaTotal * 10) / 10, // Para 3 dobras, soma total = soma da equação
    densidadeCorporal: Math.round(densidadeCorporal * 10000) / 10000,
    percentualGordura: Math.round(percentualGordura * 10) / 10,
    massaGorda: Math.round(massaGorda * 10) / 10,
    massaMagra: Math.round(massaMagra * 10) / 10,
    classificacao
  };
}

/**
 * Calcula percentual de gordura pelo protocolo Pollock - 7 dobras
 * @param medidas Medidas das dobras cutâneas em mm
 * @param genero genero do avaliado ('M' ou 'F')
 * @param idade Idade em anos
 * @param peso Peso corporal em kg
 * @returns Resultado dos cálculos
 */
export function calcularPollock7(
  medidas: MedidasPollock7,
  genero: 'M' | 'F',
  idade: number,
  peso: number
): ResultadoPollock {
  // Validação da idade
  if (idade < 18 || idade > 61) {
    throw new Error('Protocolo Pollock válido para idades entre 18-61 anos');
  }

  const { triceps, subescapular, suprailiaca, abdominal, peitoral, axilarMedia, coxa } = medidas;
  
  // Validação das medidas
  if (triceps < 3 || triceps > 50 || 
      subescapular < 3 || subescapular > 50 || 
      suprailiaca < 3 || suprailiaca > 50 ||
      abdominal < 3 || abdominal > 50 ||
      peitoral < 3 || peitoral > 50 ||
      axilarMedia < 3 || axilarMedia > 50 ||
      coxa < 3 || coxa > 50) {
    throw new Error('Medidas de dobras cutâneas devem estar entre 3-50mm');
  }

  // Soma das 7 dobras
  const somaTotal = triceps + subescapular + suprailiaca + abdominal + peitoral + axilarMedia + coxa;
  
  let densidadeCorporal: number;
  
  if (genero === 'M') {
    // Fórmula Pollock 7 dobras - Homens
    densidadeCorporal = 1.112 - (0.00043499 * somaTotal) + (0.00000055 * Math.pow(somaTotal, 2)) - (0.00028826 * idade);
  } else {
    // Fórmula Pollock 7 dobras - Mulheres
    densidadeCorporal = 1.097 - (0.00046971 * somaTotal) + (0.00000056 * Math.pow(somaTotal, 2)) - (0.00012828 * idade);
  }

  // Conversão para percentual de gordura (Siri, 1961)
  const percentualGordura = ((4.95 / densidadeCorporal) - 4.50) * 100;
  
  // Cálculos derivados
  const massaGorda = (percentualGordura / 100) * peso;
  const massaMagra = peso - massaGorda;
  
  // Classificação baseada no percentual de gordura
  const classificacao = classificarGorduraPollock(percentualGordura, genero);
  
  return {
    somaTotal: Math.round(somaTotal * 10) / 10,
    somaEquacao: Math.round(somaTotal * 10) / 10, // Para 7 dobras, soma total = soma da equação
    densidadeCorporal: Math.round(densidadeCorporal * 10000) / 10000,
    percentualGordura: Math.round(percentualGordura * 10) / 10,
    massaGorda: Math.round(massaGorda * 10) / 10,
    massaMagra: Math.round(massaMagra * 10) / 10,
    classificacao
  };
}

/**
 * Calcula percentual de gordura pelo protocolo Pollock - 9 dobras (Atletas)
 * @param medidas Medidas das dobras cutâneas em mm
 * @param genero genero do avaliado ('M' ou 'F')
 * @param idade Idade em anos
 * @param peso Peso corporal em kg
 * @returns Resultado dos cálculos
 * 
 * Nota: Bíceps e panturrilha NÃO entram na equação, mas SIM na somatória total
 */
export function calcularPollock9(
  medidas: MedidasPollock9,
  genero: 'M' | 'F',
  idade: number,
  peso: number
): ResultadoPollock {
  const { triceps, subescapular, suprailiaca, abdominal, peitoral, axilarMedia, coxa, biceps, panturrilha } = medidas;
  
  // Validação das medidas (3-50mm típico para dobras cutâneas)
  if (triceps < 3 || triceps > 50 || 
      subescapular < 3 || subescapular > 50 || 
      suprailiaca < 3 || suprailiaca > 50 ||
      abdominal < 3 || abdominal > 50 ||
      peitoral < 3 || peitoral > 50 ||
      axilarMedia < 3 || axilarMedia > 50 ||
      coxa < 3 || coxa > 50 ||
      biceps < 3 || biceps > 50 ||
      panturrilha < 3 || panturrilha > 50) {
    throw new Error('Medidas de dobras cutâneas devem estar entre 3-50mm');
  }

  // Soma TOTAL das 9 dobras (para registros/relatórios)
  const somaTotal = triceps + subescapular + suprailiaca + abdominal + peitoral + axilarMedia + coxa + biceps + panturrilha;
  
  // Soma das 7 dobras PARA A EQUAÇÃO (sem bíceps e panturrilha)
  const somaEquacao = triceps + subescapular + suprailiaca + abdominal + peitoral + axilarMedia + coxa;
  
  // Cálculo da densidade corporal usando a soma da equação (7 dobras)
  let densidadeCorporal: number;
  
  if (genero === 'M') {
    // Equação Pollock 7 dobras - Homens
    densidadeCorporal = 1.112 - (0.00043499 * somaEquacao) + (0.00000055 * Math.pow(somaEquacao, 2)) - (0.00028826 * idade);
  } else {
    // Equação Pollock 7 dobras - Mulheres
    densidadeCorporal = 1.097 - (0.00046971 * somaEquacao) + (0.00000056 * Math.pow(somaEquacao, 2)) - (0.00012828 * idade);
  }
  
  // Cálculo do percentual de gordura (Siri, 1961)
  const percentualGordura = (4.95 / densidadeCorporal - 4.5) * 100;
  
  // Cálculos derivados
  const massaGorda = (percentualGordura / 100) * peso;
  const massaMagra = peso - massaGorda;
  
  // Classificação baseada no percentual de gordura
  const classificacao = classificarGorduraPollock(percentualGordura, genero);
  
  return {
    somaTotal: Math.round(somaTotal * 10) / 10,
    somaEquacao: Math.round(somaEquacao * 10) / 10,
    densidadeCorporal: Math.round(densidadeCorporal * 10000) / 10000,
    percentualGordura: Math.round(percentualGordura * 10) / 10,
    massaGorda: Math.round(massaGorda * 10) / 10,
    massaMagra: Math.round(massaMagra * 10) / 10,
    classificacao
  };
}

/**
 * Classifica o percentual de gordura segundo ACSM
 */
function classificarGorduraPollock(percentual: number, genero: 'M' | 'F'): string {
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
 * Valida se as medidas estão dentro dos ranges aceitáveis - 3 dobras Homens
 */
export function validarMedidasPollock3Homens(medidas: MedidasPollock3Homens): boolean {
  const { peitoral, abdominal, coxa } = medidas;
  
  return peitoral >= 3 && peitoral <= 50 &&
         abdominal >= 3 && abdominal <= 50 &&
         coxa >= 3 && coxa <= 50;
}

/**
 * Valida se as medidas estão dentro dos ranges aceitáveis - 3 dobras Mulheres
 */
export function validarMedidasPollock3Mulheres(medidas: MedidasPollock3Mulheres): boolean {
  const { triceps, suprailiaca, coxa } = medidas;
  
  return triceps >= 3 && triceps <= 50 &&
         suprailiaca >= 3 && suprailiaca <= 50 &&
         coxa >= 3 && coxa <= 50;
}

/**
 * Valida se as medidas estão dentro dos ranges aceitáveis - 7 dobras
 */
export function validarMedidasPollock7(medidas: MedidasPollock7): boolean {
  const { triceps, subescapular, suprailiaca, abdominal, peitoral, axilarMedia, coxa } = medidas;
  
  return triceps >= 3 && triceps <= 50 &&
         subescapular >= 3 && subescapular <= 50 &&
         suprailiaca >= 3 && suprailiaca <= 50 &&
         abdominal >= 3 && abdominal <= 50 &&
         peitoral >= 3 && peitoral <= 50 &&
         axilarMedia >= 3 && axilarMedia <= 50 &&
         coxa >= 3 && coxa <= 50;
}

/**
 * Valida se as medidas estão dentro dos ranges aceitáveis - 9 dobras
 */
export function validarMedidasPollock9(medidas: MedidasPollock9): boolean {
  const { triceps, subescapular, suprailiaca, abdominal, peitoral, axilarMedia, coxa, biceps, panturrilha } = medidas;
  
  return triceps >= 3 && triceps <= 50 &&
         subescapular >= 3 && subescapular <= 50 &&
         suprailiaca >= 3 && suprailiaca <= 50 &&
         abdominal >= 3 && abdominal <= 50 &&
         peitoral >= 3 && peitoral <= 50 &&
         axilarMedia >= 3 && axilarMedia <= 50 &&
         coxa >= 3 && coxa <= 50 &&
         biceps >= 3 && biceps <= 50 &&
         panturrilha >= 3 && panturrilha <= 50;
}
