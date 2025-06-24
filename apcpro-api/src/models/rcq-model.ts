import { Genero } from "./genero-model";

/**
 * Input para avaliação da Relação Cintura-Quadril (RCQ)
 */
export interface RCQInput {
  cintura: number; // em cm
  quadril: number; // em cm
  genero: Genero;
}

/**
 * Resultado da avaliação de RCQ
 */
export interface RCQResultado {
  valor: number;
  classificacao: string;
  referencia: string;
}
