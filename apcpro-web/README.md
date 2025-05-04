This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

# Estrutura do Frontend

O frontend é responsável pela interface do usuário, permitindo que os usuários interajam com o sistema. Ele foi desenvolvido utilizando **Next.js**, um framework React que suporta renderização no servidor (SSR) e geração de sites estáticos (SSG).

## Camadas e Estrutura

1. **Páginas (`app/`)**:
   - Diretório principal onde as páginas do sistema são definidas.
   - Cada subdiretório representa uma rota (ex.: `/dashboard`, `/setup-profile`).
   - Arquivo `page.tsx` em cada pasta define o conteúdo da página.

2. **Componentes (`components/`)**:
   - Contém componentes reutilizáveis, como botões, formulários e layouts.
   - Subdiretório `ui/` organiza componentes de interface, como `form.tsx` e `tabs.tsx`.

3. **Bibliotecas (`lib/`)**:
   - Funções utilitárias e abstrações para facilitar a comunicação com a API e outras operações.

4. **Serviços (`services/`)**:
   - Contém funções para interagir com a API backend, como `user-service.ts`.

5. **Estáticos (`public/`)**:
   - Armazena arquivos estáticos, como imagens e ícones.

6. **Configuração (`next.config.ts`)**:
   - Configurações específicas do Next.js, como otimizações e variáveis de ambiente.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
