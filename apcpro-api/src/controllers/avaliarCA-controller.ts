import { Request, Response } from "express";
import { CaService } from "../services/ca-service";
import { ok, badRequest } from "../utils/http-helper";

/**
 * Controller para avaliação da Circunferência Abdominal (CA).
 * @route POST /avaliar-ca
 * @body { valor: number, genero: "masculino" | "feminino" }
 */
export async function avaliarCAController(req: Request, res: Response) {
  try {
    const { valor, genero } = req.body;
    if (
      typeof valor !== "number" ||
      (genero !== "masculino" && genero !== "feminino")
    ) {
      return res
        .status(400)
        .json(
          badRequest(
            "Valor deve ser número e gênero deve ser 'masculino' ou 'feminino'."
          )
        );
    }
    const resultado = await CaService.avaliarCA({ valor, genero });
    return res.status(200).json(ok(resultado));
  } catch (error: any) {
    return res.status(400).json(badRequest(error.message));
  }
}
