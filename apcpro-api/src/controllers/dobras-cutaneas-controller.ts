/**
 * Controller para Avaliação de Dobras Cutâneas
 * Gerencia endpoints para criação, consulta e listagem de avaliações
 */

import { Request, Response, NextFunction } from 'express';
import { DobrasCutaneasService } from '../services/dobras-cutaneas-service';
import { DobrasCutaneasInput } from '../models/dobras-cutaneas-model';

const dobrasCutaneasService = new DobrasCutaneasService();

/**
 * Criar nova avaliação de dobras cutâneas
 * POST /api/dobras-cutaneas
 */
export const criarAvaliacaoDobrasCutaneas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const input: DobrasCutaneasInput = req.body;
    
    // Pegar o ID do usuário que está calculando (professor)
    const calculadoPor = req.user?.id;
    
    const avaliacao = await dobrasCutaneasService.salvarAvaliacao(input, calculadoPor);
    
    return res.status(201).json({
      success: true,
      message: 'Avaliação de dobras cutâneas criada com sucesso',
      data: avaliacao
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Processar avaliação sem salvar (apenas cálculo)
 * POST /api/dobras-cutaneas/calcular
 */
export const calcularDobrasCutaneas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const input: DobrasCutaneasInput = req.body;
    
    const resultado = await dobrasCutaneasService.processarAvaliacao(input);
    
    return res.status(200).json({
      success: true,
      message: 'Cálculo realizado com sucesso',
      data: resultado
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Buscar avaliações por usuário
 * GET /api/dobras-cutaneas/usuario/:userPerfilId
 */
export const buscarAvaliacoesPorUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userPerfilId } = req.params;
    
    const avaliacoes = await dobrasCutaneasService.buscarAvaliacoesPorUsuario(userPerfilId);
    
    return res.status(200).json({
      success: true,
      message: 'Avaliações encontradas',
      data: avaliacoes,
      total: avaliacoes.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Buscar avaliação específica por ID
 * GET /api/dobras-cutaneas/:id
 */
export const buscarAvaliacaoPorId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    const avaliacao = await dobrasCutaneasService.buscarAvaliacaoPorId(id);
    
    if (!avaliacao) {
      return res.status(404).json({
        success: false,
        message: 'Avaliação não encontrada'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Avaliação encontrada',
      data: avaliacao
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Listar protocolos disponíveis
 * GET /api/dobras-cutaneas/protocolos
 */
export const listarProtocolos = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const protocolos = dobrasCutaneasService.listarProtocolosDisponiveis();
    
    return res.status(200).json({
      success: true,
      message: 'Protocolos disponíveis',
      data: protocolos
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Validar dados de entrada antes do cálculo
 * POST /api/dobras-cutaneas/validar
 */
export const validarDadosDobrasCutaneas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const input: DobrasCutaneasInput = req.body;
    
    // Usar o método privado através de processamento sem salvar
    try {
      await dobrasCutaneasService.processarAvaliacao(input);
      
      return res.status(200).json({
        success: true,
        message: 'Dados válidos',
        valida: true
      });
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        valida: false,
        erros: [(validationError as Error).message]
      });
    }
  } catch (error) {
    next(error);
  }
};
