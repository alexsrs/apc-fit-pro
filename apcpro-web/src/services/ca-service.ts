import apiClient from "@/lib/api-client";

export type Genero = "masculino" | "feminino";

export interface CircunferenciaAbdominalInput {
  valor: number;
  genero: Genero;
}

export interface CircunferenciaAbdominalResultado {
  valor: number;
  classificacao: string;
  risco: string;
  referencia: string;
}

export async function avaliarCA(input: CircunferenciaAbdominalInput) {
  const { data } = await apiClient.post("/avaliar-ca", input);
  return data.body as CircunferenciaAbdominalResultado;
}