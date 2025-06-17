// src/models/avaliacao-model.ts
import { MedidasInput } from "../utils/avaliacaoMedidas";

/**
 * Modelo de resposta para avaliação de medidas corporais
 */
export interface AvaliacaoMedidasResponse extends MedidasInput {
  imc: number;
  classificacaoIMC: string;
  percentualGC_Deurenberg: number;
  classificacaoGC_Deurenberg: string | null;
  percentualGC_Gomez: number;
  classificacaoGC_Gomez: string | null;
  percentualGC_Marinha: number | null;
  classificacaoGC_Marinha: string | null;
  massaMuscular_Lee: number;
  massaMuscular_Doupe: number;
  rcq: number | null;
  classificacaoRCQ: string | null;
  ca: number | null;
  classificacaoCA: string | null;
}
