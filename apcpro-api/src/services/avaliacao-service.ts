// src/services/avaliacao-service.ts
import {
  processarMedidas,
  MedidasInput,
  classificarCA,
  calcularIndicesMedidas,
} from "../utils/avaliacaoMedidas";
import {
  CircunferenciaAbdominalInput,
  CircunferenciaAbdominalResultado,
} from "../models/ca-model";

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

  /**
   * Processa medidas já formatadas diretamente sem conversão JSON.
   * @param input MedidasInput já formatado
   */
  calcularIndicesDirecto(input: MedidasInput) {
    return calcularIndicesMedidas(input);
  }
}
