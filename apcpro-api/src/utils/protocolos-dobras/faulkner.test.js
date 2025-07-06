/**
 * Teste das fórmulas de Faulkner em JavaScript puro
 * Versão transpilada para Node.js testar as funções
 */

/**
 * Calcula percentual de gordura pelo protocolo Faulkner
 * @param {Object} medidas - Medidas das dobras cutâneas em mm
 * @param {string} genero - Gênero do avaliado ('M' ou 'F')
 * @param {number} peso - Peso corporal em kg
 * @returns {Object} Resultado dos cálculos
 */
function calcularFaulkner(medidas, genero, peso) {
  const { triceps, subescapular, suprailiaca, bicipital } = medidas;
  
  // Validação das medidas (3-50mm típico para dobras cutâneas)
  if (triceps < 3 || triceps > 50 || 
      subescapular < 3 || subescapular > 50 || 
      suprailiaca < 3 || suprailiaca > 50 ||
      bicipital < 3 || bicipital > 50) {
    throw new Error('Medidas de dobras cutâneas devem estar entre 3-50mm');
  }

  // Soma das 4 dobras
  const somaTotal = triceps + subescapular + suprailiaca + bicipital;
  
  // Fórmulas de Faulkner específicas por genero
  let percentualGordura;
  
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
function classificarGorduraFaulkner(percentual, genero) {
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
function validarMedidasFaulkner(medidas) {
  const { triceps, subescapular, suprailiaca, bicipital } = medidas;
  
  return triceps >= 3 && triceps <= 50 &&
         subescapular >= 3 && subescapular <= 50 &&
         suprailiaca >= 3 && suprailiaca <= 50 &&
         bicipital >= 3 && bicipital <= 50;
}

module.exports = {
  calcularFaulkner,
  validarMedidasFaulkner
};

// =================== TESTES ===================

console.log('🧪 Executando testes das fórmulas de Faulkner...\n');

try {
  // Teste 1: Homem com medidas normais
  console.log('Teste 1: Homem (25 anos, 80kg)');
  const resultado1 = calcularFaulkner({
    triceps: 15,
    subescapular: 20,
    suprailiaca: 18,
    bicipital: 12
  }, 'M', 80);
  
  console.log('Medidas:', { triceps: 15, subescapular: 20, suprailiaca: 18, bicipital: 12 });
  console.log('Resultado:', resultado1);
  console.log('');

  // Teste 2: Mulher com medidas normais
  console.log('Teste 2: Mulher (30 anos, 65kg)');
  const resultado2 = calcularFaulkner({
    triceps: 20,
    subescapular: 15,
    suprailiaca: 22,
    bicipital: 18
  }, 'F', 65);
  
  console.log('Medidas:', { triceps: 20, subescapular: 15, suprailiaca: 22, bicipital: 18 });
  console.log('Resultado:', resultado2);
  console.log('');

  // Teste 3: Validação de medidas inválidas
  console.log('Teste 3: Validando medidas inválidas');
  try {
    calcularFaulkner({
      triceps: 2, // Muito baixo
      subescapular: 15,
      suprailiaca: 20,
      bicipital: 12
    }, 'M', 70);
  } catch (error) {
    console.log('✅ Erro capturado corretamente:', error.message);
  }
  console.log('');

  // Teste 4: Validação de função de validação
  console.log('Teste 4: Testando função de validação');
  const valido = validarMedidasFaulkner({ triceps: 15, subescapular: 20, suprailiaca: 18, bicipital: 12 });
  const invalido = validarMedidasFaulkner({ triceps: 2, subescapular: 20, suprailiaca: 18, bicipital: 12 });
  
  console.log('Medidas válidas (15,20,18,12):', valido);
  console.log('Medidas inválidas (2,20,18,12):', invalido);
  console.log('');

  console.log('✅ Todos os testes das fórmulas de Faulkner foram executados com sucesso!');
  
} catch (error) {
  console.error('❌ Erro durante os testes:', error.message);
}
