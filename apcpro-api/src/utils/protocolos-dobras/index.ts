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
  type MedidasGuedesMulher,
  type MedidasGuedesHomem,
  type ResultadoGuedes,
  calcularGuedesMulher,
  calcularGuedesHomem,
  validarMedidasGuedesMulher,
  validarMedidasGuedesHomem
} from './guedes';

// Tipos unificados para seleção de protocolo
export type ProtocoloDisponivel = 
  | 'faulkner'           // 4 dobras
  | 'pollock-3-homens'   // 3 dobras (homens)
  | 'pollock-3-mulheres' // 3 dobras (mulheres)
  | 'pollock-7'          // 7 dobras
  | 'pollock-9'          // 9 dobras (atletas)
  | 'guedes-3-mulher'    // 3 dobras (mulher)
  | 'guedes-3-homem';    // 3 dobras (homem)

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
    pontos: ['Subescapular', 'Tríceps', 'Abdominal', 'Supra-ilíaca'],
    indicacao: 'População geral, adultos ativos',
    requerIdade: false,
    sexoEspecifico: false
  },
  'pollock-3-homens': {
    nome: 'Pollock 3 Dobras (Homens)',
    descricao: 'Protocolo simplificado para homens',
    numDobras: 3,
    pontos: ['Tórax', 'Abdominal', 'Coxa'],
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
    pontos: ['Tórax', 'Axilar Média', 'Subescapular', 'Tríceps', 'Abdominal', 'Supra-ilíaca', 'Coxa'],
    indicacao: 'Maior precisão, população geral',
    requerIdade: true,
    sexoEspecifico: false
  },
  'pollock-9': {
    nome: 'Pollock 9 Dobras (Atletas)',
    descricao: 'Protocolo extenso para atletas profissionais',
    numDobras: 9,
    pontos: ['Tórax', 'Axilar Média', 'Subescapular', 'Tríceps', 'Abdominal', 'Supra-ilíaca', 'Coxa', 'Bíceps', 'Panturrilha'],
    indicacao: 'Atletas profissionais, máxima precisão',
    requerIdade: true,
    sexoEspecifico: false
  },
  'guedes-3-mulher': {
    nome: 'Guedes 3 Dobras (Mulher)',
    descricao: 'Protocolo Guedes para mulheres',
    numDobras: 3,
    pontos: ['Subescapular', 'Supra-ilíaca', 'Coxa'],
    indicacao: 'Mulheres, população brasileira',
    requerIdade: true,
    sexoEspecifico: true
  },
  'guedes-3-homem': {
    nome: 'Guedes 3 Dobras (Homem)',
    descricao: 'Protocolo Guedes para homens',
    numDobras: 3,
    pontos: ['Tríceps', 'Abdominal', 'Supra-ilíaca'],
    indicacao: 'Homens, população brasileira',
    requerIdade: true,
    sexoEspecifico: true
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
