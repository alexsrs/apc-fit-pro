/**
 * Tipos compartilhados para o sistema de dobras cutâneas
 */

export interface DadosPessoais {
  genero: 'M' | 'F';
  idade?: number;
  peso: number;
}

export interface Medidas {
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
}

export interface ResultadoCalculo {
  somaTotal: number;
  somaEquacao?: number;
  percentualGordura: number;
  massaGorda: number;
  massaMagra: number;
  classificacao: string;
  densidadeCorporal?: number;
}

export interface MetadataAvaliacao {
  dataAvaliacao: string;
  validadeFormula: string;
  observacoes?: string;
}

export interface AvaliacaoCompleta {
  protocolo: string;
  dadosPessoais: DadosPessoais;
  medidas: Medidas;
  resultados: ResultadoCalculo;
  metadata: MetadataAvaliacao;
  aluno?: {
    id: string;
    name?: string;
    dataNascimento?: string;
    peso?: number;
    altura?: number;
    genero?: string;
    image?: string;
  };
}

export interface ProtocoloInfo {
  id: string;
  nome: string;
  descricao: string;
  numDobras: number;
  dobrasNecessarias: string[];
  requerIdade: boolean;
  generoEspecifico: boolean;
  tempoMedio: string;
  recomendado: string;
}
