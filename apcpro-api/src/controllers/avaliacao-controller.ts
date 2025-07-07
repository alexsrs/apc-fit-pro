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
    // Validação básica dos dados de entrada
    const { peso, altura, idade, genero } = req.body;
    
    if (peso === undefined || altura === undefined || idade === undefined || !genero) {
      return res.status(400).json({
        erro: "Dados obrigatórios ausentes",
        message: "peso, altura, idade e genero são obrigatórios"
      });
    }

    if (Number(peso) <= 0 || Number(altura) <= 0 || Number(idade) <= 0) {
      return res.status(400).json({
        erro: "Dados inválidos",
        message: "peso, altura e idade devem ser maiores que zero"
      });
    }

    // Usar calcularIndicesDirecto para payload já formatado
    const resultado = avaliacaoService.calcularIndicesDirecto(req.body);
    return res.status(200).json(resultado);
  } catch (error) {
    // Se o erro for de validação, retornar 400
    if (error instanceof Error && (
      error.message.includes('inválid') || 
      error.message.includes('NaN') ||
      error.message.includes('zero')
    )) {
      return res.status(400).json({
        erro: "Dados inválidos",
        message: error.message
      });
    }
    next(error);
  }
};
