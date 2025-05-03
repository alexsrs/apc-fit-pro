

export async function fetchUserData(userId: string) {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar dados do usuário");
  }
  return response.json();
}
