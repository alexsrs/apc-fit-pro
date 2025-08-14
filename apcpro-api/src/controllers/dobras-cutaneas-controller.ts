/**
 * Controller para Avaliação de Dobras Cutâneas
 * Gerencia endpoints para criação, consulta e listagem de avaliações
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { DobrasCutaneasService } from '../services/dobras-cutaneas-service';
import { PROTOCOLOS_INFO, type ProtocoloDisponivel } from '../utils/protocolos-dobras';
import { DobrasCutaneasInput } from '../models/dobras-cutaneas-model';

const dobrasCutaneasService = new DobrasCutaneasService();

// Função utilitária para normalizar o gênero
/**
 * Normaliza o gênero para 'masculino' ou 'feminino'.
 * Aceita qualquer variação, inclusive 'M', 'F', 'masculino', 'feminino', case-insensitive.
 * Nunca retorna 'M' ou 'F'.
 */
function normalizarGenero(genero: string): 'masculino' | 'feminino' {
  if (!genero) return 'masculino';
  const g = genero.trim().toLowerCase();
  if (g === 'f' || g === 'feminino') return 'feminino';
  if (g === 'm' || g === 'masculino') return 'masculino';
  if (g === 'fem' || g.startsWith('fem')) return 'feminino';
  if (g === 'masc' || g.startsWith('masc')) return 'masculino';
  if (g.startsWith('f')) return 'feminino';
  if (g.startsWith('m')) return 'masculino';
  return 'masculino';
}

// Função para normalizar dados pessoais
/**
 * Sempre prioriza o gênero do aluno vindo da API (req.body.aluno.genero).
 * Nunca usa o gênero do payload local, apenas como fallback se não houver aluno.
 */
function normalizarDadosPessoais(dados: any, aluno?: any) {
  let generoFonte = dados.genero;
  if (aluno && aluno.genero) {
    generoFonte = aluno.genero;
  }
  return {
    ...dados,
    genero: normalizarGenero(generoFonte),
    peso: typeof dados.peso === 'string' ? Number(dados.peso.replace(',', '.')) : Number(dados.peso),
    idade: dados.idade !== undefined ? (typeof dados.idade === 'string' ? Number(dados.idade) : dados.idade) : undefined,
    altura: dados.altura !== undefined ? (typeof dados.altura === 'string' ? Number(dados.altura.replace(',', '.')) : Number(dados.altura)) : undefined,
  };
}

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
    // Normaliza ID do protocolo (frontend pode enviar com hífen removido)
    if (typeof input.protocolo === 'string') {
      const p = (input.protocolo as string).toLowerCase();
      // aceita variantes sem hífens
      const mapa: Record<string, ProtocoloDisponivel> = {
        faulkner: 'faulkner',
        'pollock3homens': 'pollock-3-homens',
        'pollock3mulheres': 'pollock-3-mulheres',
        'pollock7': 'pollock-7',
        'pollock9': 'pollock-9',
        'guedes3mulher': 'guedes-3-mulher',
        'guedes3homem': 'guedes-3-homem'
      };
      if (mapa[p]) {
        (input as any).protocolo = mapa[p];
      }
    }
    input.dadosPessoais = normalizarDadosPessoais(input.dadosPessoais, req.body.aluno);
    if (
      isNaN(input.dadosPessoais.peso) ||
      (input.dadosPessoais.idade !== undefined && isNaN(input.dadosPessoais.idade)) ||
      (input.dadosPessoais.altura !== undefined && isNaN(input.dadosPessoais.altura))
    ) {
      return res.status(400).json({ erro: 'Peso, idade e altura devem ser numéricos.' });
    }
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
    // Normaliza ID do protocolo
    if (typeof input.protocolo === 'string') {
      const p = (input.protocolo as string).toLowerCase();
      const mapa: Record<string, ProtocoloDisponivel> = {
        faulkner: 'faulkner',
        'pollock3homens': 'pollock-3-homens',
        'pollock3mulheres': 'pollock-3-mulheres',
        'pollock7': 'pollock-7',
        'pollock9': 'pollock-9',
        'guedes3mulher': 'guedes-3-mulher',
        'guedes3homem': 'guedes-3-homem'
      };
      if (mapa[p]) {
        (input as any).protocolo = mapa[p];
      }
    }
    input.dadosPessoais = normalizarDadosPessoais(input.dadosPessoais, req.body.aluno);
    if (
      isNaN(input.dadosPessoais.peso) ||
      (input.dadosPessoais.idade !== undefined && isNaN(input.dadosPessoais.idade)) ||
      (input.dadosPessoais.altura !== undefined && isNaN(input.dadosPessoais.altura))
    ) {
      return res.status(400).json({ erro: 'Peso, idade e altura devem ser numéricos.' });
    }
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
export const buscarAvaliacaoPorId: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Converta para número se o ID no banco for numérico
    // const avaliacao = await avaliacoesService.buscarPorId(Number(id));
    const avaliacao = await dobrasCutaneasService.buscarAvaliacaoPorId(id);

    if (!avaliacao) {
      res.status(404).json({ message: "Avaliação não encontrada" });
      return;
    }

    res.status(200).json(avaliacao); // não use 'return' aqui
  } catch (err) {
    next(err);
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
    // Resposta amigável ao frontend: lista com id, nome, descricao, dobrasNecessarias, numDobras, etc.
    const protocolos = Object.entries(PROTOCOLOS_INFO).map(([id, info]) => ({
      id,
      nome: info.nome,
      descricao: info.descricao,
      numDobras: info.numDobras,
      dobrasNecessarias: info.pontos.map(p => p)
        .map(p => p
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '')
          .toLowerCase()
          .replace('axilarmedia','axilarmedia')
          .replace('peitoral','torax')
        ),
      requerIdade: info.requerIdade,
      generoEspecifico: !!info.sexoEspecifico,
      tempoMedio: info.numDobras <= 3 ? '3-4 min' : info.numDobras === 4 ? '5-6 min' : info.numDobras === 7 ? '7-10 min' : '10-12 min',
      recomendado: info.indicacao
    }));

    return res.status(200).json({ success: true, message: 'Protocolos disponíveis', data: protocolos });
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
