import axios from "axios";
import { getSession } from "next-auth/react";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // URL do backend
});

// Intercepta as requisições para adicionar o token JWT
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession(); // Obtém a sessão do NextAuth
  if (session?.user) {
    config.headers.Authorization = `Bearer ${session.user.id}`; // Adiciona o token JWT no cabeçalho
  }
  return config;
});

export default apiClient;