import { Genero } from "../models/genero-model";

/**
 * Tipo para representar diferentes formatos de entrada de sexo/gênero
 */
export type SexoInput = "masculino" | "feminino" | 1 | 0 | "M" | "F" | "m" | "f";

/**
 * Função utilitária para validar se um valor é um tipo Sexo válido
 */
export function isSexoValido(value: any): value is SexoInput {
  return (
    value === "masculino" || 
    value === "feminino" || 
    value === 1 || 
    value === 0 ||
    value === "M" ||
    value === "F" ||
    value === "m" ||
    value === "f"
  );
}

/**
 * Converte diferentes formatos de entrada de sexo/gênero para o enum Genero.
 * 
 * @param sexo Valor de entrada representando sexo/gênero
 * @returns Genero.Masculino ou Genero.Feminino
 * 
 * @example
 * ```typescript
 * converterSexoParaGenero("masculino") // Genero.Masculino
 * converterSexoParaGenero(1) // Genero.Masculino  
 * converterSexoParaGenero("M") // Genero.Masculino
 * converterSexoParaGenero("feminino") // Genero.Feminino
 * converterSexoParaGenero(0) // Genero.Feminino
 * converterSexoParaGenero("F") // Genero.Feminino
 * ```
 */
export function converterSexoParaGenero(sexo: SexoInput | string | number): Genero {
  // Normaliza o valor para string e converte para lowercase
  const sexoNormalizado = String(sexo).toLowerCase().trim();
  
  // Verifica se é masculino
  if (
    sexoNormalizado === "masculino" || 
    sexoNormalizado === "1" || 
    sexoNormalizado === "m"
  ) {
    return Genero.Masculino;
  }
  
  // Para todos os outros casos (incluindo feminino, 0, f), retorna feminino como padrão seguro
  return Genero.Feminino;
}

/**
 * Converte do enum Genero para string (formato frontend)
 * 
 * @param genero Enum Genero
 * @returns String "masculino" ou "feminino"
 */
export function generoParaString(genero: Genero): "masculino" | "feminino" {
  return genero === Genero.Masculino ? "masculino" : "feminino";
}

/**
 * Converte do enum Genero para número (formato legado)
 * 
 * @param genero Enum Genero
 * @returns 1 para masculino, 0 para feminino
 */
export function generoParaNumero(genero: Genero): 1 | 0 {
  return genero === Genero.Masculino ? 1 : 0;
}

/**
 * Converte do enum Genero para letra maiúscula
 * 
 * @param genero Enum Genero
 * @returns "M" para masculino, "F" para feminino
 */
export function generoParaLetra(genero: Genero): "M" | "F" {
  return genero === Genero.Masculino ? "M" : "F";
}
