import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function middleware(request: NextRequest) {
  console.log('Middleware executado para:', request.nextUrl.pathname);
  const sessionToken = request.cookies.get('next-auth.session-token')?.value;
  console.log("caralho");
  console.log("caralho");
  console.log("caralho");
  console.log("caralho");
  console.log("caralho");
  console.log("caralho");
  // Verifica se o usuário está autenticado
  if (!sessionToken) {
    console.log('Usuário não autenticado.');
    return NextResponse.redirect(new URL('/login', request.url)); // Redireciona para login
  }

  // Busca a sessão no banco de dados
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true }, 
  });

  if (!session) {
    console.log('Sessão inválida.');
    return NextResponse.redirect(new URL('/login', request.url)); // Redireciona para login
  }

  console.log('Usuário autenticado:', session.user);

  // Verifica se o usuário possui um perfil na API
  const apiUrl = 'http://localhost:3333/api/cma9ohpvg0000v0b4jvgf8v35/profile';
  console.log('URL da API:', apiUrl);

  try {
    const res = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${sessionToken}` }, // Usa o sessionToken como Bearer
    });

    console.log('Status da API:', res.status);

    // Loga a resposta completa da API para depuração
    const responseBody = await res.text();
    console.log('Resposta da API:', responseBody);

    // Se o perfil não existir, redireciona para /setup-profile
    if (res.status === 404) {
      const url = request.nextUrl.clone();
      url.pathname = '/setup-profile';
      console.log('Redirecionando para:', url.pathname);
      return NextResponse.redirect(url);
    }

    // Verifica outros possíveis erros na API
    if (!res.ok) {
      console.error('Erro inesperado na API:', res.status, responseBody);
      return NextResponse.redirect(new URL('/error', request.url));
    }
  } catch (error) {
    console.error('Erro ao chamar a API:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }

  // Se tudo estiver correto, permite o acesso à rota
  return NextResponse.next();
}

// Configuração para aplicar o middleware apenas em rotas específicas
export const config = {
  matcher: ['/'], // Aplica o middleware a todas as rotas
};
