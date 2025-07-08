/**
 * Teste das fórmulas de Pollock em JavaScript puro
 * Testa as versões de 3, 7 e 9 dobras
 */

// Pollock 3 dobras - Homens
function calcularPollock3Homens(medidas, idade, peso) {
  const { peitoral, abdominal, coxa } = medidas;
  
  if (peitoral < 3 || peitoral > 50 || 
      abdominal < 3 || abdominal > 50 || 
      coxa < 3 || coxa > 50) {
    throw new Error('Medidas de dobras cutâneas devem estar entre 3-50mm');
  }

  const somaTotal = peitoral + abdominal + coxa;
  
  // Equação Pollock 3 dobras - Homens
  const densidadeCorporal = 1.10938 - (0.0008267 * somaTotal) + (0.0000016 * Math.pow(somaTotal, 2)) - (0.0002574 * idade);
  const percentualGordura = (4.95 / densidadeCorporal - 4.5) * 100;
  
  const massaGorda = (percentualGordura / 100) * peso;
  const massaMagra = peso - massaGorda;
  
  return {
    somaTotal: Math.round(somaTotal * 10) / 10,
    somaEquacao: Math.round(somaTotal * 10) / 10,
    percentualGordura: Math.round(percentualGordura * 10) / 10,
    massaGorda: Math.round(massaGorda * 10) / 10,
    massaMagra: Math.round(massaMagra * 10) / 10,
    protocolo: 'pollock-3-homens'
  };
}

// Pollock 9 dobras - Para atletas
function calcularPollock9(medidas, genero, idade, peso) {
  const { triceps, subescapular, suprailiaca, abdominal, peitoral, axilarMedia, coxa, biceps, panturrilha } = medidas;
  
  // Validação das medidas
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
  let densidadeCorporal;
  
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
  
  return {
    somaTotal: Math.round(somaTotal * 10) / 10,
    somaEquacao: Math.round(somaEquacao * 10) / 10,
    densidadeCorporal: Math.round(densidadeCorporal * 10000) / 10000,
    percentualGordura: Math.round(percentualGordura * 10) / 10,
    massaGorda: Math.round(massaGorda * 10) / 10,
    massaMagra: Math.round(massaMagra * 10) / 10,
    protocolo: 'pollock-9'
  };
}

// =================== TESTES ===================

console.log('🧪 Executando testes das fórmulas de Pollock...\n');

try {
  // Teste 1: Pollock 3 dobras - Homem
  console.log('Teste 1: Pollock 3 Dobras - Homem (30 anos, 75kg)');
  const resultado1 = calcularPollock3Homens({
    peitoral: 12,
    abdominal: 15,
    coxa: 18
  }, 30, 75);
  
  console.log('Medidas:', { peitoral: 12, abdominal: 15, coxa: 18 });
  console.log('Resultado:', resultado1);
  console.log('');

  // Teste 2: Pollock 9 dobras - Atleta Homem
  console.log('Teste 2: Pollock 9 Dobras - Atleta Homem (25 anos, 80kg)');
  const resultado2 = calcularPollock9({
    triceps: 8,
    subescapular: 10,
    suprailiaca: 12,
    abdominal: 10,
    peitoral: 8,
    axilarMedia: 6,
    coxa: 15,
    biceps: 5,      // NÃO entra na equação
    panturrilha: 7  // NÃO entra na equação
  }, 'M', 25, 80);
  
  console.log('Medidas:', { 
    triceps: 8, subescapular: 10, suprailiaca: 12, abdominal: 10, 
    peitoral: 8, axilarMedia: 6, coxa: 15, biceps: 5, panturrilha: 7 
  });
  console.log('Resultado:', resultado2);
  console.log('');

  // Teste 3: Pollock 9 dobras - Atleta Mulher
  console.log('Teste 3: Pollock 9 Dobras - Atleta Mulher (22 anos, 60kg)');
  const resultado3 = calcularPollock9({
    triceps: 12,
    subescapular: 8,
    suprailiaca: 15,
    abdominal: 10,
    peitoral: 6,
    axilarMedia: 8,
    coxa: 18,
    biceps: 7,      // NÃO entra na equação
    panturrilha: 10 // NÃO entra na equação
  }, 'F', 22, 60);
  
  console.log('Medidas:', { 
    triceps: 12, subescapular: 8, suprailiaca: 15, abdominal: 10, 
    peitoral: 6, axilarMedia: 8, coxa: 18, biceps: 7, panturrilha: 10 
  });
  console.log('Resultado:', resultado3);
  console.log('');

  // Teste 4: Verificação das somas
  console.log('Teste 4: Verificação de Somas (Pollock 9 dobras)');
  console.log('Soma Total (9 dobras):', resultado2.somaTotal);
  console.log('Soma da Equação (7 dobras):', resultado2.somaEquacao);
  console.log('Diferença (bíceps + panturrilha):', resultado2.somaTotal - resultado2.somaEquacao);
  console.log('Esperado (5 + 7):', 5 + 7);
  console.log('');

  console.log('✅ Todos os testes das fórmulas de Pollock foram executados com sucesso!');
  console.log('📊 Pollock 9 dobras: Bíceps e panturrilha registrados mas não usados na equação!');
  
} catch (error) {
  console.error('❌ Erro durante os testes:', error.message);
}
