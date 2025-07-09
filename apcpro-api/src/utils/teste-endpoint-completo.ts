// Teste do endpoint de avaliação com dobras cutâneas
import { calcularIndicesMedidas } from "./avaliacaoMedidas";
import { Genero } from "../models/genero-model";

/**
 * Simula uma requisição completa com dobras cutâneas
 */
function testarEndpointCompleto() {
  console.log("=== TESTE COMPLETO DO ENDPOINT ===\n");

  const dadosCompletos = {
    peso: 70,
    altura: 175,
    idade: 25,
    genero: Genero.Masculino,
    cintura: 80,
    pescoco: 38,
    quadril: 95,
    abdomen: 82,
    dobras: {
      triceps: 10,
      biceps: 8,
      subescapular: 12,
      suprailiaca: 14,
      abdominal: 16,
      coxa: 15,
      panturrilha: 10
    }
  };

  console.log("Dados de entrada:");
  console.log(JSON.stringify(dadosCompletos, null, 2));

  const resultado = calcularIndicesMedidas(dadosCompletos);

  console.log("\n=== RESULTADOS CALCULADOS ===");
  console.log(`IMC: ${resultado.imc.toFixed(1)} (${resultado.classificacaoIMC})`);
  console.log(`RCQ: ${resultado.rcq?.toFixed(2)} (${resultado.classificacaoRCQ})`);
  console.log(`CA: ${resultado.ca} (${resultado.classificacaoCA})`);
  
  console.log("\n=== DOBRAS CUTÂNEAS ===");
  console.log(`Faulkner: ${resultado.percentualGC_Faulkner !== null ? resultado.percentualGC_Faulkner?.toFixed(1) : "N/A"}% (${resultado.classificacaoGC_Faulkner ?? "N/A"})`);
  console.log(`Pollock: ${resultado.percentualGC_Pollock !== null ? resultado.percentualGC_Pollock?.toFixed(1) : "N/A"}% (${resultado.classificacaoGC_Pollock ?? "N/A"})`);
  console.log(`Guedes: ${resultado.percentualGC_Guedes !== null ? resultado.percentualGC_Guedes?.toFixed(1) : "N/A"}% (${resultado.classificacaoGC_Guedes ?? "N/A"})`);
  
  console.log("\n=== OUTROS MÉTODOS ===");
  console.log(`Marinha: ${resultado.percentualGC_Marinha?.toFixed(1)}% (${resultado.classificacaoGC_Marinha})`);

  return resultado;
}

// Executar teste
if (require.main === module) {
  testarEndpointCompleto();
}

export { testarEndpointCompleto };
