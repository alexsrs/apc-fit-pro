// DEPRECATED: Use genero-converter.ts para novas implementações
// Mantido apenas para compatibilidade com código existente
import { normalizarGenero as normalizarGeneroNovo } from "./genero-converter";

/**
 * @deprecated Use normalizarGenero de ./genero-converter.ts
 * Normaliza o valor do gênero para 'masculino' ou 'feminino'.
 * Aceita variações como 'M', 'F', 'feminino ', 'Masculino', etc.
 * Retorna undefined se não conseguir identificar.
 */
export function normalizarGenero(
  genero?: string | null
): "masculino" | "feminino" | undefined {
  return normalizarGeneroNovo(genero);
}
