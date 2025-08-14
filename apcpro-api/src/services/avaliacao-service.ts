// src/services/avaliacao-service.ts
import { processarMedidas, MedidasInput, calcularIndicesMedidas } from "../utils/avaliacaoMedidas";
// Importações removidas por não uso: modelos de CA

/**
 * Serviço para processar medidas corporais e calcular índices.
 */
export class AvaliacaoService {
  /**
   * Processa as medidas recebidas e retorna todos os índices e classificações.
   * @param input JSON com dados das medidas (vem do frontend)
   */
  calcularIndices(input: any) {
    return processarMedidas(input);
  }

  /**
   * Processa medidas já formatadas diretamente sem conversão JSON.
   * @param input MedidasInput já formatado
   */
  calcularIndicesDirecto(input: MedidasInput) {
    return calcularIndicesMedidas(input);
  }
}
