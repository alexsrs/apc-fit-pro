// src/controllers/avaliacao-controller.ts
import { Request, Response, NextFunction } from "express";
import { AvaliacaoService } from "../services/avaliacao-service";

const avaliacaoService = new AvaliacaoService();

/**
 * Controller para calcular medidas corporais.
 * Recebe os dados no corpo da requisição e retorna o resultado do cálculo.
 */
export const calcularMedidasController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resultado = avaliacaoService.calcularIndices(req.body);
    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};
