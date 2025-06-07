export async function fetchUserData(userId: string) {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar dados do usuário");
  }
  return response.json();
}

export async function buscarProximaAvaliacao(userPerfilId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/alunos/${userPerfilId}/proxima-avaliacao`
  );
  if (!res.ok) throw new Error("Erro ao buscar próxima avaliação");
  return res.json();
}

export async function buscarEvolucaoFisica(userPerfilId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/alunos/${userPerfilId}/evolucao-fisica`
  );
  if (!res.ok) throw new Error("Erro ao buscar evolução física");
  return res.json();
}
