/**
 * Centralizador de protocolos de dobras cutâneas
 * Exporta todas as funções e tipos disponíveis
 */

// Faulkner (4 dobras)
export {
  type MedidasFaulkner,
  type ResultadoFaulkner,
  calcularFaulkner,
  validarMedidasFaulkner
} from './faulkner';

// Pollock (3, 7 e 9 dobras)
export {
  type MedidasPollock3Homens,
  type MedidasPollock3Mulheres,
  type MedidasPollock7,
  type MedidasPollock9,
  type ResultadoPollock,
  calcularPollock3,
  calcularPollock7,
  calcularPollock9,
  validarMedidasPollock3Homens,
  validarMedidasPollock3Mulheres,
  validarMedidasPollock7,
  validarMedidasPollock9
} from './pollock';

// Guedes (3 dobras)
export {
  type MedidasGuedes,
  type ResultadoGuedes,
  calcularGuedes,
  validarMedidasGuedes
} from './guedes';

// Tipos unificados para seleção de protocolo
export type ProtocoloDisponivel = 
  | 'faulkner'           // 4 dobras
  | 'pollock-3-homens'   // 3 dobras (homens)
  | 'pollock-3-mulheres' // 3 dobras (mulheres)
  | 'pollock-7'          // 7 dobras
  | 'pollock-9'          // 9 dobras (atletas)
  | 'guedes';            // 3 dobras

export interface InfoProtocolo {
  nome: string;
  descricao: string;
  numDobras: number;
  pontos: string[];
  indicacao: string;
  requerIdade: boolean;
  sexoEspecifico?: boolean;
}

export const PROTOCOLOS_INFO: Record<ProtocoloDisponivel, InfoProtocolo> = {
  'faulkner': {
    nome: 'Faulkner',
    descricao: 'Protocolo de 4 dobras cutâneas',
    numDobras: 4,
    pontos: ['Tríceps', 'Subescapular', 'Supra-ilíaca', 'Bicipital'],
    indicacao: 'População geral, adultos ativos',
    requerIdade: false,
    sexoEspecifico: false
  },
  'pollock-3-homens': {
    nome: 'Pollock 3 Dobras (Homens)',
    descricao: 'Protocolo simplificado para homens',
    numDobras: 3,
    pontos: ['Peitoral', 'Abdominal', 'Coxa'],
    indicacao: 'Homens, avaliação rápida',
    requerIdade: true,
    sexoEspecifico: true
  },
  'pollock-3-mulheres': {
    nome: 'Pollock 3 Dobras (Mulheres)',
    descricao: 'Protocolo simplificado para mulheres',
    numDobras: 3,
    pontos: ['Tríceps', 'Supra-ilíaca', 'Coxa'],
    indicacao: 'Mulheres, avaliação rápida',
    requerIdade: true,
    sexoEspecifico: true
  },
  'pollock-7': {
    nome: 'Pollock 7 Dobras',
    descricao: 'Protocolo mais preciso para ambos os sexos',
    numDobras: 7,
    pontos: ['Tríceps', 'Subescapular', 'Supra-ilíaca', 'Abdominal', 'Peitoral', 'Axilar Média', 'Coxa'],
    indicacao: 'Maior precisão, população geral',
    requerIdade: true,
    sexoEspecifico: false
  },
  'pollock-9': {
    nome: 'Pollock 9 Dobras (Atletas)',
    descricao: 'Protocolo completo para atletas com registro detalhado',
    numDobras: 9,
    pontos: ['Tríceps', 'Subescapular', 'Supra-ilíaca', 'Abdominal', 'Peitoral', 'Axilar Média', 'Coxa', 'Bíceps*', 'Panturrilha*'],
    indicacao: 'Atletas e esportistas (*não entram na equação)',
    requerIdade: true,
    sexoEspecifico: false
  },
  'guedes': {
    nome: 'Guedes',
    descricao: 'Protocolo específico para brasileiros',
    numDobras: 3,
    pontos: ['Tríceps', 'Subescapular', 'Supra-ilíaca'],
    indicacao: 'População brasileira, crianças e adolescentes',
    requerIdade: false,
    sexoEspecifico: false
  }
};

// Funções utilitárias
export function getProtocoloPorId(id: ProtocoloDisponivel): InfoProtocolo {
  return PROTOCOLOS_INFO[id];
}

export function getProtocolosPorNumDobras(numDobras: number): ProtocoloDisponivel[] {
  return Object.keys(PROTOCOLOS_INFO).filter(
    id => PROTOCOLOS_INFO[id as ProtocoloDisponivel].numDobras === numDobras
  ) as ProtocoloDisponivel[];
}

export function getProtocolosRequeremIdade(): ProtocoloDisponivel[] {
  return Object.keys(PROTOCOLOS_INFO).filter(
    id => PROTOCOLOS_INFO[id as ProtocoloDisponivel].requerIdade
  ) as ProtocoloDisponivel[];
}

export function getProtocolosPorSexo(): { homens: ProtocoloDisponivel[], mulheres: ProtocoloDisponivel[], ambos: ProtocoloDisponivel[] } {
  const todos = Object.keys(PROTOCOLOS_INFO) as ProtocoloDisponivel[];
  
  return {
    homens: todos.filter(id => id === 'pollock-3-homens'),
    mulheres: todos.filter(id => id === 'pollock-3-mulheres'),
    ambos: todos.filter(id => !PROTOCOLOS_INFO[id].sexoEspecifico)
  };
}
