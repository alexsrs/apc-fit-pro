import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verifica se a rota acessada é /dashboard
  if (request.nextUrl.pathname === '/dashboard') {
    // Redireciona para uma página de teste
    return NextResponse.rewrite(new URL('/stup-profile', request.url));
  }

  return NextResponse.next();
}

// Configura o middleware para ser aplicado apenas em rotas específicas
export const config = {
  matcher: '/dashboard',
};