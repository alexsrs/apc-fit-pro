/**
 * Modelos TypeScript para Dobras Cutâneas
 * Define interfaces e tipos para o sistema de avaliação
 */

import { ProtocoloDisponivel } from '../utils/protocolos-dobras';

// Tipos base
export type GeneroType = 'masculino' | 'feminino';
export type StatusAvaliacao = 'pendente' | 'aprovada' | 'reprovada' | 'cancelada';

// Interface para dados de entrada
export interface DobrasCutaneasInput {
  userPerfilId: string;
  protocolo: ProtocoloDisponivel;
  dadosPessoais: {
    genero: GeneroType;
    idade?: number; // Opcional - nem todos protocolos precisam
    peso: number;
    altura?: number; // Opcional para protocolos que exigem altura
  };
  medidas: {
    // Dobras comuns
    triceps?: number;
    subescapular?: number;
    suprailiaca?: number;
    
    // Dobras específicas por protocolo
    bicipital?: number;     // Faulkner
    peitoral?: number;      // Pollock e Guedes (como 'peito')
    abdominal?: number;     // Pollock e Guedes
    axilarMedia?: number;   // Pollock e Guedes
    coxa?: number;          // Pollock e Guedes
    biceps?: number;        // Pollock 9 dobras (atletas)
    panturrilha?: number;   // Pollock 9 dobras (atletas)
  };
  observacoes?: string;
}

// Interface para resultados calculados
export interface ResultadosDobrasCutaneas {
  somaTotal: number;
  somaEquacao?: number;  // Para Pollock 9 dobras (distingue soma total vs soma da equação)
  percentualGordura: number;
  massaGorda: number;
  massaMagra: number;
  classificacao: string;
  densidadeCorporal?: number; // Apenas Pollock
}

// Interface para avaliação completa (JSON que vai no banco)
export interface AvaliacaoDobrasCutaneas {
  protocolo: ProtocoloDisponivel;
  dadosPessoais: {
    genero: GeneroType;
    idade?: number;
    peso: number;
    altura?: number;
  };
  medidas: {
    triceps?: number;
    subescapular?: number;
    suprailiaca?: number;
    bicipital?: number;
    peitoral?: number;
    abdominal?: number;
    axilarMedia?: number;
    coxa?: number;
    biceps?: number;
    panturrilha?: number;
  };
  resultados: ResultadosDobrasCutaneas;
  metadata: {
    dataAvaliacao: string;
    validadeFormula: string;
    observacoes?: string;
    calculadoPor?: string; // ID do professor
  };
}

// Interface para resposta da API
export interface DobrasCutaneasResponse {
  id: string;
  userPerfilId: string;
  tipo: 'dobras-cutaneas';
  status: StatusAvaliacao;
  data: string;
  resultado: AvaliacaoDobrasCutaneas;
  createdAt: string;
  updatedAt: string;
}

// Interface para listagem de avaliações
export interface AvaliacaoResumo {
  id: string;
  tipo: string;
  protocolo?: string;
  data: string;
  status: StatusAvaliacao;
  percentualGordura?: number;
  classificacao?: string;
}

// Tipos para validação
export interface ValidacaoMedidas {
  valida: boolean;
  erros: string[];
}

// Interface para estatísticas
export interface EstatisticasDobrasCutaneas {
  totalAvaliacoes: number;
  protocoloMaisUsado: ProtocoloDisponivel;
  mediaPercentualGordura: number;
  distribuicaoClassificacoes: Record<string, number>;
}

// Constantes
export const RANGES_DOBRAS = {
  MIN: 3,
  MAX: 50,
  UNIDADE: 'mm'
} as const;

export const PROTOCOLOS_RESUMO = {
  'faulkner': {
    nome: 'Faulkner',
    pontos: 4,
    tempoMedio: '5 min',
    recomendado: 'População geral'
  },
  'pollock-3-homens': {
    nome: 'Pollock 3 (H)',
    pontos: 3,
    tempoMedio: '3 min',
    recomendado: 'Avaliação rápida - homens'
  },
  'pollock-3-mulheres': {
    nome: 'Pollock 3 (M)',
    pontos: 3,
    tempoMedio: '3 min',
    recomendado: 'Avaliação rápida - mulheres'
  },
  'pollock-7': {
    nome: 'Pollock 7',
    pontos: 7,
    tempoMedio: '8 min',
    recomendado: 'Padrão científico'
  },
  // 'pollock-9': { // Removido do padrão
  //   nome: 'Pollock 9',
  //   pontos: 9,
  //   tempoMedio: '12 min',
  //   recomendado: 'Atletas e esportistas'
  // },
  'guedes': {
    nome: 'Guedes',
    pontos: 3,
    tempoMedio: '4 min',
    recomendado: 'População brasileira'
  }
} as const;
