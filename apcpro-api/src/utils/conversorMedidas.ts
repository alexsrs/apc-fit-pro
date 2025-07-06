import type { MedidasInput } from "./avaliacaoMedidas";
import { Genero } from "../models/genero-model";
import { converterSexoParaGenero, SexoInput } from "./genero-converter";

interface MedidasJson {
  peso: string | number;
  altura: string | number;
  idade: string | number;
  sexo: SexoInput;
  tronco: {
    cintura: string | number;
    quadril: string | number;
    abdomen?: string | number;
  };
  parteSuperior: {
    pescoco?: string | number;
  };
}

export function converterMedidasJson(json: MedidasJson): MedidasInput {
  return {
    peso: Number(json.peso),
    altura: Number(json.altura),
    idade: Number(json.idade),
    genero: converterSexoParaGenero(json.sexo),
    cintura: Number(json.tronco.cintura),
    quadril: Number(json.tronco.quadril),
    pescoco:
      json.parteSuperior.pescoco !== undefined
        ? Number(json.parteSuperior.pescoco)
        : undefined,
    abdomen:
      json.tronco.abdomen !== undefined
        ? Number(json.tronco.abdomen)
        : undefined,
  };
}
