/**
 * Normaliza o valor do gênero para 'masculino' ou 'feminino'.
 * Aceita variações como 'M', 'F', 'feminino ', 'Masculino', etc.
 * Retorna undefined se não conseguir identificar.
 */
export function normalizarGenero(
  genero?: string | null
): "masculino" | "feminino" | undefined {
  if (!genero) return undefined;
  const valor = genero.trim().toLowerCase();
  if (["f", "fem", "feminino", "feminina"].includes(valor)) return "feminino";
  if (["m", "masc", "masculino", "masculina"].includes(valor))
    return "masculino";
  // Fallback para casos como 'Feminino ', 'FEMININO', etc.
  if (valor.startsWith("f")) return "feminino";
  if (valor.startsWith("m")) return "masculino";
  return undefined;
}
