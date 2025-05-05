import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


const apiUrl = process.env.API_URL;

export async function middleware(request: NextRequest) {
  console.log("Middleware iniciado para a URL:", request.url);

  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    console.log("Cabeçalho de cookies não encontrado. Redirecionando para login.");
    return NextResponse.redirect(new URL("/", request.url));
  }

  const cookies = Object.fromEntries(cookieHeader.split("; ").map(c => c.split("=")));
  const token = cookies["token"];
  const userId = cookies["userId"];

  if (!token) {
    console.log("Token não encontrado. Redirecionando para login.");
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!userId) {
    console.log("userId não encontrado nos cookies. Redirecionando para login.");
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const apiResponse = await fetch(`${apiUrl}/api/${userId}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Resposta da API:", apiResponse.status);

    if (apiResponse.status === 404) {
      console.log("Perfil não encontrado. Redirecionando para setup-profile.");
      const url = request.nextUrl.clone();
      url.pathname = "/setup-profile";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error("Erro ao verificar o perfil do usuário:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }

  return NextResponse.next();
}

export const matcher = {
  matcher: ["/:path*", "!/api/:path*"], // Protege todas as rotas, exceto APIs
};