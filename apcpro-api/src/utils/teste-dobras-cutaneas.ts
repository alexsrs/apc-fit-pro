// Teste das funções de dobras cutâneas
import { calculateFaulkner, calculatePollock, calculateGuedes, DobrasCutaneas } from "./avaliacaoMedidas";
import { Genero } from "../models/genero-model";

/**
 * Teste com dados conhecidos para validar os cálculos
 */
function testarCalculosDobras() {
  console.log("=== TESTE DOS PROTOCOLOS DE DOBRAS CUTÂNEAS ===\n");

  // Dados de teste - Homem jovem ativo
  const dobrasHomem: DobrasCutaneas = {
    triceps: 10,
    biceps: 8,
    subescapular: 12,
    suprailiaca: 14,
    abdominal: 16,
    coxa: 15,
    panturrilha: 10
  };

  // Dados de teste - Mulher jovem ativa
  const dobrasMulher: DobrasCutaneas = {
    triceps: 15,
    biceps: 12,
    subescapular: 18,
    suprailiaca: 20,
    abdominal: 22,
    coxa: 25,
    panturrilha: 15
  };

  console.log("HOMEM (25 anos):");
  console.log("Dobras:", dobrasHomem);
  
  const faulknerH = calculateFaulkner(dobrasHomem, Genero.Masculino);
  const pollockH = calculatePollock(dobrasHomem, Genero.Masculino, 25);
  const guedesH = calculateGuedes(dobrasHomem, Genero.Masculino);
  
  console.log(`Faulkner: ${faulknerH?.toFixed(1)}%`);
  console.log(`Pollock: ${pollockH?.toFixed(1)}%`);
  console.log(`Guedes: ${guedesH?.toFixed(1)}%`);
  
  console.log("\nMULHER (25 anos):");
  console.log("Dobras:", dobrasMulher);
  
  const faulknerM = calculateFaulkner(dobrasMulher, Genero.Feminino);
  const pollockM = calculatePollock(dobrasMulher, Genero.Feminino, 25);
  const guedesM = calculateGuedes(dobrasMulher, Genero.Feminino);
  
  console.log(`Faulkner: ${faulknerM?.toFixed(1)}%`);
  console.log(`Pollock: ${pollockM?.toFixed(1)}%`);
  console.log(`Guedes: ${guedesM?.toFixed(1)}%`);

  // Teste com dados incompletos
  console.log("\nTESTE COM DADOS INCOMPLETOS:");
  const dobrasIncompletas: DobrasCutaneas = {
    triceps: 10,
    subescapular: 12
    // Faltam outras dobras
  };

  const faulknerIncompleto = calculateFaulkner(dobrasIncompletas, Genero.Masculino);
  console.log(`Faulkner com dados incompletos: ${faulknerIncompleto}`); // Deve ser null
}

// Executar teste se chamado diretamente
if (require.main === module) {
  testarCalculosDobras();
}

export { testarCalculosDobras };
