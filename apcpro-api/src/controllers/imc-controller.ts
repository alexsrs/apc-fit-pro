// src/controllers/imc-controller.ts
import { Request, Response } from "express";
import { ImcService } from "../services/imc-service";

const imcService = new ImcService();

/**
 * Controller para cálculo de IMC.
 * @route POST /imc
 * @body { peso: number, altura: number }
 */
export async function calcularImcController(req: Request, res: Response) {
  try {
    const { peso, altura } = req.body;
    if (typeof peso !== "number" || typeof altura !== "number") {
      return res.status(400).json({ erro: "Peso e altura devem ser números." });
    }
    const resultado = imcService.calcularImc(peso, altura);
    return res.status(200).json(resultado);
  } catch (error: any) {
    return res.status(400).json({ erro: error.message });
  }
}
