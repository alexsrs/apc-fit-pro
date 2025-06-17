import { classificarCA } from "../utils/avaliacaoMedidas";
import {
  CircunferenciaAbdominalInput,
  CircunferenciaAbdominalResultado,
} from "../models/ca-model";

/**
 * Serviço para avaliação da Circunferência Abdominal (CA)
 */
export class CaService {
  /**
   * Avalia a Circunferência Abdominal de acordo com o gênero informado.
   */
  static async avaliarCA(
    input: CircunferenciaAbdominalInput
  ): Promise<CircunferenciaAbdominalResultado> {
    const { valor, genero } = input;
    const classificacao = classificarCA(valor, genero);

    let risco = "";
    if (genero === "masculino") {
      if (valor < 94) risco = "Baixo risco";
      else if (valor < 102) risco = "Risco moderado";
      else risco = "Risco muito aumentado";
    } else {
      if (valor < 80) risco = "Baixo risco";
      else if (valor < 88) risco = "Risco moderado";
      else risco = "Risco muito aumentado";
    }

    return {
      valor,
      classificacao,
      risco,
      referencia: "OMS/NIH/NCEP-ATP III",
    };
  }
}
