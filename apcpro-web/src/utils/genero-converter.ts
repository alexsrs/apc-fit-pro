/**
 * Utilitário para conversão e normalização de gênero no frontend
 * Compatível com o utilitário do backend genero-converter.ts
 */

/**
 * Tipo para representar os formatos aceitos de gênero no frontend
 */
export type GeneroInput = "masculino" | "feminino" | "M" | "F" | "m" | "f" | string;

/**
 * Normaliza o valor do gênero para 'masculino' ou 'feminino'.
 * Aceita variações como 'M', 'F', 'feminino ', 'Masculino', 'MASCULINO', etc.
 * Retorna undefined se não conseguir identificar.
 * 
 * @param genero Valor de entrada representando gênero
 * @returns "masculino" | "feminino" | undefined
 * 
 * @example
 * ```typescript
 * normalizarGenero("M") // "masculino"
 * normalizarGenero("f") // "feminino"
 * normalizarGenero("MASCULINO") // "masculino"
 * normalizarGenero("fem") // "feminino"
 * normalizarGenero("xyz") // undefined
 * ```
 */
export function normalizarGenero(
  genero?: GeneroInput | null
): "masculino" | "feminino" | undefined {
  if (!genero) return undefined;
  
  const valor = String(genero).trim().toLowerCase();
  
  // Verificações específicas para diferentes formatos
  if (["f", "fem", "feminino", "feminina", "female", "woman"].includes(valor)) {
    return "feminino";
  }
  
  if (["m", "masc", "masculino", "masculina", "male", "man"].includes(valor)) {
    return "masculino";
  }
  
  // Fallback para casos como 'Feminino ', 'FEMININO', etc.
  if (valor.startsWith("f")) return "feminino";
  if (valor.startsWith("m")) return "masculino";
  
  return undefined;
}

/**
 * Converte gênero para formato de letra maiúscula
 * 
 * @param genero Valor de entrada
 * @returns "M" para masculino, "F" para feminino, undefined se inválido
 */
export function generoParaLetra(genero?: GeneroInput | null): "M" | "F" | undefined {
  const generoNormalizado = normalizarGenero(genero);
  if (!generoNormalizado) return undefined;
  
  return generoNormalizado === "masculino" ? "M" : "F";
}

/**
 * Converte gênero para formato número (legado)
 * 
 * @param genero Valor de entrada
 * @returns 1 para masculino, 0 para feminino, undefined se inválido
 */
export function generoParaNumero(genero?: GeneroInput | null): 1 | 0 | undefined {
  const generoNormalizado = normalizarGenero(genero);
  if (!generoNormalizado) return undefined;
  
  return generoNormalizado === "masculino" ? 1 : 0;
}

/**
 * Valida se um valor representa um gênero válido
 * 
 * @param genero Valor para validar
 * @returns true se for um gênero válido
 */
export function isGeneroValido(genero?: GeneroInput | null): boolean {
  return normalizarGenero(genero) !== undefined;
}
