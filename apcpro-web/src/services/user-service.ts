import apiClient from "@/lib/api-client";

export async function fetchUserData(userId: string) {
  const { data } = await apiClient.get(`users/${userId}`);
  return data;
}

export async function buscarProximaAvaliacao(userPerfilId: string) {
  const { data } = await apiClient.get(
    `alunos/${userPerfilId}/proxima-avaliacao`
  );
  return data;
}

export async function buscarEvolucaoFisica(userPerfilId: string) {
  const { data } = await apiClient.get(
    `alunos/${userPerfilId}/evolucao-fisica`
  );
  return data;
}

export async function buscarPerfilUsuario() {
  const resposta = await apiClient.get("usuarios/perfil");
  return resposta.data;
}
