/**
 * Protocolo de Guedes para Dobras Cutâneas (7 pontos)
 * Referência: Guedes & Guedes (1998) - Literatura Brasileira
 * Pontos: Tríceps, Subescapular, Supra-ilíaca, Abdominal, Coxa, Peito, Axilar Média
 */

export interface MedidasGuedes {
  triceps: number;
  subescapular: number;
  suprailiaca: number;
  abdominal: number;
  coxa: number;
  peito: number;
  axilarMedia: number;
}

export interface ResultadoGuedes {
  somaTotal: number;
  percentualGordura: number;
  massaGorda: number;
  massaMagra: number;
  classificacao: string;
}

/**
 * Calcula percentual de gordura pelo protocolo Guedes
 * @param medidas Medidas das dobras cutâneas em mm
 * @param genero genero do avaliado ('M' ou 'F')
 * @param idade Idade em anos
 * @param peso Peso corporal em kg
 * @returns Resultado dos cálculos
 */
export function calcularGuedes(
  medidas: MedidasGuedes,
  genero: 'M' | 'F',
  idade: number,
  peso: number
): ResultadoGuedes {
  const { triceps, subescapular, suprailiaca, abdominal, coxa, peito, axilarMedia } = medidas;
  
  // Validação das medidas
  const medidasArray = [triceps, subescapular, suprailiaca, abdominal, coxa, peito, axilarMedia];
  if (medidasArray.some(medida => medida < 3 || medida > 50)) {
    throw new Error('Medidas de dobras cutâneas devem estar entre 3-50mm');
  }

  // Validação da idade
  if (idade < 15 || idade > 65) {
    throw new Error('Protocolo Guedes válido para idades entre 15-65 anos');
  }

  // Soma das 7 dobras
  const somaTotal = triceps + subescapular + suprailiaca + abdominal + coxa + peito + axilarMedia;
  
  // Fórmulas de Guedes específicas por genero e idade (Literatura Brasileira)
  let percentualGordura: number;
  
  if (genero === 'M') {
    // Fórmula Guedes para homens
    percentualGordura = 0.11077 * somaTotal - 
                       0.00006 * somaTotal * somaTotal + 
                       0.14354 * idade - 5.92;
  } else {
    // Fórmula Guedes para mulheres
    percentualGordura = 0.11187 * somaTotal - 
                       0.00058 * somaTotal * somaTotal + 
                       0.11683 * idade - 7.39;
  }
  
  // Garantir que o percentual não seja negativo
  percentualGordura = Math.max(percentualGordura, 3);
  
  // Cálculos derivados
  const massaGorda = (percentualGordura / 100) * peso;
  const massaMagra = peso - massaGorda;
  
  // Classificação baseada no percentual de gordura
  const classificacao = classificarGorduraGuedes(percentualGordura, genero);
  
  return {
    somaTotal: Math.round(somaTotal * 10) / 10,
    percentualGordura: Math.round(percentualGordura * 10) / 10,
    massaGorda: Math.round(massaGorda * 10) / 10,
    massaMagra: Math.round(massaMagra * 10) / 10,
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
export function validarMedidasGuedes(medidas: MedidasGuedes): boolean {
  const { triceps, subescapular, suprailiaca, abdominal, coxa, peito, axilarMedia } = medidas;
  
  const medidasArray = [triceps, subescapular, suprailiaca, abdominal, coxa, peito, axilarMedia];
  return medidasArray.every(medida => medida >= 3 && medida <= 50);
}

/**
 * Retorna os pontos de medição para o protocolo Guedes
 */
export function getPontosGuedes(): string[] {
  return [
    'Tríceps',
    'Subescapular',
    'Supra-ilíaca',
    'Abdominal',
    'Coxa',
    'Peito',
    'Axilar Média'
  ];
}
