// src/services/rcq-service.ts
import { RCQInput, RCQResultado } from "../models/rcq-model";

/**
 * Serviço para avaliação da Relação Cintura-Quadril (RCQ)
 * Fórmula: RCQ = cintura / quadril
 * Valores de referência:
 *   Homem: <0,90 = baixo risco; 0,90–0,99 = moderado; ≥1,00 = alto risco
 *   Mulher: <0,80 = baixo risco; 0,80–0,84 = moderado; ≥0,85 = alto risco
 * Validação científica: WHO 2008, NHANES, UK Biobank, Price, Yusuf.
 */
export class RcqService {
  /**
   * Avalia a RCQ de acordo com o gênero informado.
   */
  static avaliarRCQ(input: RCQInput): RCQResultado {
    const { cintura, quadril, genero } = input;
    const valor = cintura / quadril;
    let classificacao = "";
    let referencia = "";

    const generoStr = String(genero).toLowerCase();
    if (generoStr === "masculino") {
      if (valor < 0.9) classificacao = "Baixo risco";
      else if (valor < 1.0) classificacao = "Risco moderado";
      else classificacao = "Alto risco";
      referencia =
        "H < 0,90 = baixo risco; 0,90–0,99 = moderado; ≥ 1,00 = alto risco";
    } else if (generoStr === "feminino") {
      if (valor < 0.8) classificacao = "Baixo risco";
      else if (valor < 0.85) classificacao = "Risco moderado";
      else classificacao = "Alto risco";
      referencia =
        "M < 0,80 = baixo risco; 0,80–0,84 = moderado; ≥ 0,85 = alto risco";
    } else {
      classificacao = "Gênero não reconhecido";
      referencia = "";
    }

    return {
      valor: Number(valor.toFixed(2)),
      classificacao,
      referencia,
    };
  }
}

export function classificarRCQ(rcq: number, genero: string): string {
  if (!genero || (genero !== "masculino" && genero !== "feminino")) {
    return "Gênero não reconhecido";
  }

  if (genero === "masculino") {
    if (rcq < 0.9) return "Baixo risco";
    if (rcq >= 0.9 && rcq <= 0.99) return "Risco moderado";
    return "Alto risco";
  }

  if (genero === "feminino") {
    if (rcq < 0.8) return "Baixo risco";
    if (rcq >= 0.8 && rcq <= 0.84) return "Risco moderado";
    return "Alto risco";
  }

  return "Gênero não reconhecido";
}
