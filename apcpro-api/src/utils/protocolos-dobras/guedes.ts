/**
 * Protocolo de Guedes para Dobras Cutâneas (3 dobras)
 * Referência: Guedes & Guedes (1998) - Literatura Brasileira
 * Mulher: Subescapular, Supra-ilíaca, Coxa
 * Homem: Tríceps, Abdominal, Supra-ilíaca
 */

export interface MedidasGuedesMulher {
  subescapular: number;
  suprailiaca: number;
  coxa: number;
}

export interface MedidasGuedesHomem {
  triceps: number;
  abdominal: number;
  suprailiaca: number;
}

export interface ResultadoGuedes {
  somaTotal: number;
  percentualGordura: number;
  massaGorda: number;
  massaMagra: number;
  massaMuscular?: number;
  musculoEsqueletico?: number;
  classificacao: string;
}


/**
 * Calcula percentual de gordura pelo protocolo Guedes 3 dobras - Mulher
 * @param medidas Medidas das dobras cutâneas em mm
 * @param idade Idade em anos
 * @param peso Peso corporal em kg
 * @returns Resultado dos cálculos
 */
export function calcularGuedesMulher(
  medidas: MedidasGuedesMulher,
  idade: number,
  peso: number
): ResultadoGuedes {
  const { subescapular, suprailiaca, coxa } = medidas;
  // Validação das medidas
  if ([subescapular, suprailiaca, coxa].some(m => m < 3 || m > 50)) {
    throw new Error('Medidas de dobras cutâneas devem estar entre 3-50mm');
  }
  if (idade < 15 || idade > 65) {
    throw new Error('Protocolo Guedes válido para idades entre 15-65 anos');
  }
  const somaTotal = subescapular + suprailiaca + coxa;
  // Fórmula Guedes 3 dobras - Mulher
  let percentualGordura = 0.610 * somaTotal + 0.163 * idade - 5.4;
  percentualGordura = Math.max(percentualGordura, 3);
  const massaGorda = (percentualGordura / 100) * peso;
  const massaMagra = peso - massaGorda;
  const classificacao = classificarGorduraGuedes(percentualGordura, 'F');
  return {
    somaTotal: Math.round(somaTotal * 10) / 10,
    percentualGordura: Math.round(percentualGordura * 10) / 10,
    massaGorda: Math.round(massaGorda * 10) / 10,
    massaMagra: Math.round(massaMagra * 10) / 10,
  massaMuscular: Math.round((massaMagra * 0.50) * 10) / 10,
  musculoEsqueletico: Math.round((massaMagra * 0.40) * 10) / 10,
    classificacao
  };
}

/**
 * Calcula percentual de gordura pelo protocolo Guedes 3 dobras - Homem
 * @param medidas Medidas das dobras cutâneas em mm
 * @param idade Idade em anos
 * @param peso Peso corporal em kg
 * @returns Resultado dos cálculos
 */
export function calcularGuedesHomem(
  medidas: MedidasGuedesHomem,
  idade: number,
  peso: number
): ResultadoGuedes {
  const { triceps, abdominal, suprailiaca } = medidas;
  if ([triceps, abdominal, suprailiaca].some(m => m < 3 || m > 50)) {
    throw new Error('Medidas de dobras cutâneas devem estar entre 3-50mm');
  }
  if (idade < 15 || idade > 65) {
    throw new Error('Protocolo Guedes válido para idades entre 15-65 anos');
  }
  const somaTotal = triceps + abdominal + suprailiaca;
  // Fórmula Guedes 3 dobras - Homem
  let percentualGordura = 0.614 * somaTotal + 0.151 * idade - 5.2;
  percentualGordura = Math.max(percentualGordura, 3);
  const massaGorda = (percentualGordura / 100) * peso;
  const massaMagra = peso - massaGorda;
  const classificacao = classificarGorduraGuedes(percentualGordura, 'M');
  return {
    somaTotal: Math.round(somaTotal * 10) / 10,
    percentualGordura: Math.round(percentualGordura * 10) / 10,
    massaGorda: Math.round(massaGorda * 10) / 10,
    massaMagra: Math.round(massaMagra * 10) / 10,
  massaMuscular: Math.round((massaMagra * 0.50) * 10) / 10,
  musculoEsqueletico: Math.round((massaMagra * 0.40) * 10) / 10,
    classificacao
  };
}

/**
 * Classifica o percentual de gordura segundo referências brasileiras
 */
function classificarGorduraGuedes(percentual: number, genero: 'M' | 'F'): string {
  if (genero === 'M') {
    if (percentual < 7) return 'Muito Baixo';
    if (percentual < 12) return 'Atletas';
    if (percentual < 17) return 'Ótimo';
    if (percentual < 22) return 'Bom';
    if (percentual < 27) return 'Acima do Ideal';
    return 'Obesidade';
  } else {
    if (percentual < 13) return 'Muito Baixo';
    if (percentual < 18) return 'Atletas';
    if (percentual < 23) return 'Ótimo';
    if (percentual < 28) return 'Bom';
    if (percentual < 33) return 'Acima do Ideal';
    return 'Obesidade';
  }
}

/**
 * Valida se as medidas estão dentro dos ranges aceitáveis
 */

export function validarMedidasGuedesMulher(medidas: MedidasGuedesMulher): boolean {
  const { subescapular, suprailiaca, coxa } = medidas;
  return [subescapular, suprailiaca, coxa].every(m => m >= 3 && m <= 50);
}

export function validarMedidasGuedesHomem(medidas: MedidasGuedesHomem): boolean {
  const { triceps, abdominal, suprailiaca } = medidas;
  return [triceps, abdominal, suprailiaca].every(m => m >= 3 && m <= 50);
}

/**
 * Retorna os pontos de medição para o protocolo Guedes
 */

export function getPontosGuedesMulher(): string[] {
  return [
    'Subescapular',
    'Supra-ilíaca',
    'Coxa'
  ];
}

export function getPontosGuedesHomem(): string[] {
  return [
    'Tríceps',
    'Abdominal',
    'Supra-ilíaca'
  ];
}

/**
 * Função unificada para cálculo do protocolo Guedes
 * Determina automaticamente o protocolo baseado no gênero
 * @param medidas - Medidas das dobras cutâneas
 * @param genero - Gênero ('M' ou 'F')
 * @param idade - Idade em anos
 * @param peso - Peso corporal em kg
 * @returns Resultado dos cálculos
 */
export function calcularGuedes(
  medidas: any,
  genero: 'M' | 'F',
  idade: number,
  peso: number
): ResultadoGuedes {
  if (genero === 'F') {
    // Para mulheres: subescapular, suprailiaca, coxa
    const medidasMulher: MedidasGuedesMulher = {
      subescapular: medidas.subescapular,
      suprailiaca: medidas.suprailiaca,
      coxa: medidas.coxa
    };
    return calcularGuedesMulher(medidasMulher, idade, peso);
  } else {
    // Para homens: triceps, abdominal, suprailiaca
    const medidasHomem: MedidasGuedesHomem = {
      triceps: medidas.triceps,
      abdominal: medidas.abdominal,
      suprailiaca: medidas.suprailiaca
    };
    return calcularGuedesHomem(medidasHomem, idade, peso);
  }
}

/**
 * Função unificada para validação de medidas do protocolo Guedes
 * @param medidas - Medidas das dobras cutâneas
 * @param genero - Gênero ('M' ou 'F')
 * @returns true se as medidas são válidas
 */
export function validarMedidasGuedes(medidas: any, genero: 'M' | 'F'): boolean {
  if (genero === 'F') {
    const medidasMulher: MedidasGuedesMulher = {
      subescapular: medidas.subescapular,
      suprailiaca: medidas.suprailiaca,
      coxa: medidas.coxa
    };
    return validarMedidasGuedesMulher(medidasMulher);
  } else {
    const medidasHomem: MedidasGuedesHomem = {
      triceps: medidas.triceps,
      abdominal: medidas.abdominal,
      suprailiaca: medidas.suprailiaca
    };
    return validarMedidasGuedesHomem(medidasHomem);
  }
}
