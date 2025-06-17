/**
 * Enum para o gênero do usuário.
 */
export enum Genero {
  Masculino = "masculino",
  Feminino = "feminino",
}

/**
 * Função utilitária para validar o gênero.
 */
export function isGenero(value: any): value is Genero {
  return value === Genero.Masculino || value === Genero.Feminino;
}
