const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export async function fetchUserData(userId: string) {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar dados do usuário");
  }
  return response.json();
}

export async function buscarProximaAvaliacao(userPerfilId: string) {
  const res = await fetch(
    `${API_BASE}/api/alunos/${userPerfilId}/proxima-avaliacao`
  );
  if (!res.ok) throw new Error("Erro ao buscar próxima avaliação");
  return res.json();
}
