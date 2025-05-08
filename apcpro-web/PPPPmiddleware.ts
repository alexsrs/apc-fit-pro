import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/dashboard") {
    // Obtém o token de sessão diretamente do cookie
    const sessionToken = request.cookies.get("next-auth.session-token")?.value;

    if (sessionToken) {
      console.log("Token de sessão encontrado:", sessionToken);

      // Obtém o userId do cookie
      let userId = request.cookies.get("next-auth.UserID")?.value;

      if (!userId) {
        console.warn("ID do usuário não encontrado no cookie.");

        // Fallback: Tente buscar o userId decodificando o token ou chamando a API
        try {
          const apiResponse = await fetch(
            `${process.env.APC_PRO_PUBLIC_API_URL}/api/session/${sessionToken}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (apiResponse.ok) {
            const sessionData = await apiResponse.json();
            userId = sessionData.userId; // Supondo que a API retorne o userId
            console.log("ID do usuário obtido da API:", userId);
          } else {
            console.error(
              "Erro ao buscar o ID do usuário pela API:",
              apiResponse.statusText
            );
            return NextResponse.redirect(
              new URL("/setup-profile", request.url)
            );
          }
        } catch (error) {
          console.error(
            "Erro ao fazer requisição à API para buscar o userId:",
            error
          );
          return NextResponse.redirect(new URL("/error", request.url));
        }
      }

      if (userId) {
        console.log("ID do usuário encontrado:", userId);

        try {
          // Faz uma requisição à API para obter o perfil do usuário
          const apiResponse = await fetch(
            `${process.env.APC_PRO_PUBLIC_API_URL}/api/${userId}/profile/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionToken}`,
              },
            }
          );

          if (apiResponse.ok) {
            const userProfile = await apiResponse.json();
            console.log("Perfil do usuário:", userProfile);
            // Lógica adicional, se necessário
          } else {
            console.error(
              "Erro ao buscar o perfil do usuário:",
              apiResponse.statusText
            );
            return NextResponse.redirect(
              new URL("/setup-profile", request.url)
            );
          }
        } catch (error) {
          console.error("Erro ao fazer requisição à API:", error);
          return NextResponse.redirect(new URL("/error", request.url));
        }
      } else {
        console.warn("ID do usuário não encontrado. Redirecionando...");
        return NextResponse.redirect(new URL("/setup-profile", request.url));
      }
    } else {
      console.warn("Token de sessão não encontrado.");
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Configura o middleware para ser aplicado apenas em rotas específicas
export const config = {
  matcher: "/dashboard",
};
