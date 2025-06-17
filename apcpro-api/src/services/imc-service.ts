// src/services/imc-service.ts
/**
 * Serviço para cálculo e classificação do IMC conforme OMS.
 */
export class ImcService {
  /**
   * Calcula o IMC e retorna classificação.
   * @param peso Peso em kg
   * @param altura Altura em metros
   */
  calcularImc(peso: number, altura: number) {
    if (!peso || !altura || altura <= 0) {
      throw new Error("Peso e altura devem ser válidos.");
    }
    const imc = peso / (altura * altura);
    const classificacao = this.classificarImc(imc);
    return {
      imc: Number(imc.toFixed(2)),
      classificacao,
    };
  }

  /**
   * Classifica o IMC conforme OMS.
   */
  private classificarImc(imc: number): string {
    if (imc < 18.5) return "Abaixo do peso";
    if (imc < 25) return "Peso normal";
    if (imc < 30) return "Pré-obesidade";
    if (imc < 35) return "Obesidade I";
    if (imc < 40) return "Obesidade II";
    return "Obesidade III";
  }
}
