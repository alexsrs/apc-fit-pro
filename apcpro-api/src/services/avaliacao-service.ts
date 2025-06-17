// src/services/avaliacao-service.ts
import { processarMedidas, MedidasInput } from "../utils/avaliacaoMedidas";

/**
 * Serviço para processar medidas corporais e calcular índices.
 */
export class AvaliacaoService {
  /**
   * Processa as medidas recebidas e retorna todos os índices e classificações.
   * @param input MedidasInput
   */
  calcularIndices(input: MedidasInput) {
    return processarMedidas(input);
  }
}
