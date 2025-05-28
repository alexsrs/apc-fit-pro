"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bem vindo</h1>
                <p className="text-muted-foreground text-balance">
                  Faça o login usando sua conta APC PRO
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu-nome@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Esqueci minha senha?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Ou continue com
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={() =>
                    signIn("google", { callbackUrl: "/dashboard" })
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    width="24px"
                    height="24px"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.63 1.23 9.1 3.25l6.8-6.8C35.45 2.3 30.03 0 24 0 14.73 0 6.9 5.74 3.1 14.06l7.9 6.13C13.1 13.03 18.1 9.5 24 9.5z"
                    />
                    <path
                      fill="#34A853"
                      d="M46.5 24c0-1.5-.13-2.95-.38-4.35H24v8.3h12.7c-.55 2.95-2.2 5.45-4.7 7.15l7.9 6.13C43.7 37.1 46.5 30.95 46.5 24z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M10.9 28.2c-.7-2.1-1.1-4.3-1.1-6.7s.4-4.6 1.1-6.7L3 9.4C1.1 13.2 0 18.4 0 24s1.1 10.8 3 14.6l7.9-6.4z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M24 48c6.5 0 12-2.15 16.1-5.85l-7.9-6.15c-2.2 1.5-5 2.4-8.2 2.4-5.9 0-10.9-3.5-13-8.5l-7.9 6.15C6.9 42.25 14.7 48 24 48z"
                    />
                  </svg>
                  <span>Login com Google</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Eu não tenho uma conta?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/images/logo-na-capa.png"
              alt="Descrição da imagem"
              width={1000}
              height={600}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Ao clicar em continuar, você concorda com nossos{" "}
        <a href="#">Termos de Serviço</a> e{" "}
        <a href="#">Política de Privacidade</a>.
      </div>
    </div>
  );
}
