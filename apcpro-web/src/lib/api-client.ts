import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // URL do backend
});

// Intercepta as requisições para adicionar o token JWT
apiClient.interceptors.request.use(async (config) => {
  let token: string | null = null;
  if (typeof window !== "undefined") {
    const res = await fetch("/api/auth/jwt");
    if (res.ok) {
      const data = await res.json();
      token = data.jwt;
    }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Corrige: NÃO adicione /api se já existir (evita /api/api/...)
  // Só prefixa se NÃO começar com barra (ex: "users/...")
  if (
    config.url &&
    !config.url.startsWith("/") &&
    !config.url.startsWith("http")
  ) {
    config.url = `/api/${config.url}`;
  }
  return config;
});

export default apiClient;
