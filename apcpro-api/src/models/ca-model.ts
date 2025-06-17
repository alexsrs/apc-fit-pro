import { Genero } from "./genero-model";

/**
 * Input para avaliação de Circunferência Abdominal (CA)
 */
export interface CircunferenciaAbdominalInput {
  valor: number; // em cm
  genero: Genero;
}

/**
 * Resultado da avaliação de CA
 */
export interface CircunferenciaAbdominalResultado {
  valor: number;
  classificacao: string;
  risco: string;
  referencia: string;
}

/**
 * Tabela de referência CA (OMS/NIH/NCEP-ATP III)
 */
export const tabelaCA = [
  {
    genero: Genero.Masculino,
    baixo: "< 94 cm",
    moderado: "94–101 cm",
    alto: "≥ 102 cm",
  },
  {
    genero: Genero.Feminino,
    baixo: "< 80 cm",
    moderado: "80–87 cm",
    alto: "≥ 88 cm",
  },
];

export const referenciaCA = "OMS/NIH/NCEP-ATP III";
