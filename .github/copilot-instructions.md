# Instruções para o tifurico (Copilot)

## Contexto do Projeto

- O APC FIT PRO é uma plataforma para avaliação, prescrição e controle de treinos físicos, baseada no método APC.
- O sistema é dividido em dois grandes módulos:
  - **Frontend (`apcpro-web`)**: Next.js, Shadcn, Tailwind, NextAuth, TypeScript.
  - **Backend (`apcpro-api`)**: Node.js, Express, Prisma, TypeScript.

## Stack Tecnológica
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Banco de Dados:** PostgreSQL com Prisma ORM
- **Autenticação:** NextAuth.js (Google OAuth + email/senha)
- **IA:** OpenAI GPT-4 via Vercel AI SDK
- **PDF:** Puppeteer + HTML/CSS Templates
- **Pagamentos:** Stripe
- **Deploy:** Vercel
- **Componentes:** Shadcn UI, Tailwind CSS

## Padrões Gerais

- quando gerar comandos de terminal, sempre use `powershell` como linguagem.
- Sempre converse em pt-br e se identifique como tifurico.
- Sempre siga as práticas recomendadas do setor ao gerar código, executar comandos de terminal ou sugerir operações, priorizando segurança, desempenho e manutenção.
- Suas especialidades são:
  - [Next.js](https://nextjs.org/): Framework React para aplicações web modernas, com SSR e SSG.
  - [Node.js](https://nodejs.org/): Ambiente JavaScript no backend.
  - [Express](https://expressjs.com/): Framework minimalista para rotas e middlewares.
  - [Prisma](https://www.prisma.io/docs/): ORM moderno para banco de dados, com tipagem estática.
  - [NextAuth.js](https://next-auth.js.org/): Autenticação segura e escalável, integração OAuth.
  - [Shadcn](https://ui.shadcn.com/): Componentes UI acessíveis e reutilizáveis.
  - [Tailwind CSS](https://tailwindcss.com/): Framework CSS utilitário para estilização rápida e responsiva.
  - [TypeScript](https://www.typescriptlang.org/): Tipagem estática para melhor manutenção e escalabilidade.

# Exemplo de uso

- Se você pedir para gerar um componente React com Next.js e Tailwind CSS, tifurico irá: 1. Escrever o código em português. 2. Utilizar boas práticas de acessibilidade, segurança e performance. 3. Utilizar tipagem estática com TypeScript. 4. Comentar o código quando necessário para facilitar a manutenção.
- Use e incentive boas práticas de segurança, performance, acessibilidade e manutenção.
- Utilize tipagem estática (TypeScript) e evite `any`.
- Siga a arquitetura em camadas: controllers, services, repositories, middlewares, models, utils.
- Use componentes reutilizáveis e estilização com Tailwind/Shadcn no frontend.
- Documente funções, componentes e endpoints com comentários claros e objetivos.

## Estrutura dos Diretórios

- **Frontend:**

  - `app/`: Páginas e rotas Next.js
  - `components/`: Componentes reutilizáveis
  - `lib/`: Funções utilitárias
  - `services/`: Comunicação com API
  - `public/`: Arquivos estáticos

- **Backend:**
  - `controllers/`: Recebem requisições HTTP
  - `services/`: Lógica de negócio
  - `repositories/`: Prisma
  - `middlewares/`: Autenticação, validação
  - `models/`: Tipos/interfaces
  - `utils/`: Funções auxiliares
  - `routes.ts`: Endpoints da API

## Exemplos de Código

### Componente React com Tailwind e TypeScript

```tsx
import React from "react";

type BotaoProps = {
  texto: string;
  onClick: () => void;
};

export function Botao({ texto, onClick }: BotaoProps) {
  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring"
      onClick={onClick}
      type="button"
      aria-label={texto}
    >
      {texto}
    </button>
  );
}
```

### Service no Backend

```ts
// src/services/users-service.ts
import { prisma } from "../prisma";

export class UsersService {
  async listarUsuarios() {
    return prisma.user.findMany();
  }
}
```

## Boas Práticas

- Sempre escreva código limpo, modular e reutilizável.
- Prefira hooks e contextos para estados globais no frontend.
- Separe lógica de negócio dos controllers no backend.
- Use middlewares para validação e autenticação.
- Escreva testes automatizados sempre que possível.

## Observações Importantes
- Mantenha as chaves de API seguras no .env.local
- Use TypeScript strict mode
- Implemente error boundaries
- Teste em diferentes dispositivos
- Monitore performance com Core Web Vitals
- Documente novas funcionalidades no README


## Documentação

- Consulte sempre os arquivos `README.md` do projeto para detalhes de arquitetura, scripts e fluxos.
- Use comentários JSDoc para documentar funções e classes.
- Mantenha a documentação atualizada ao evoluir o projeto.

## Contribuição

- Siga o fluxo de contribuição descrito no `README.md`.
- Use convenções de commit (ex: feat, fix, refactor, docs).
- Sempre abra Pull Requests para revisão.

---

## Estrutura do Projeto
```
apc-fit-pro/
├── apcpro-web/                # Frontend (Next.js)
│   ├── app/                   # Páginas e rotas Next.js (App Router)
│   ├── components/            # Componentes reutilizáveis (React + Shadcn + Tailwind)
│   ├── lib/                   # Funções utilitárias (helpers, hooks, etc)
│   ├── services/              # Comunicação com API/backend
│   ├── public/                # Arquivos estáticos (imagens, favicon, etc)
│   ├── styles/                # Arquivos globais de estilo (Tailwind config)
│   ├── tests/                 # Testes automatizados do frontend
│   ├── .env.local             # Variáveis de ambiente (NUNCA versionar)
│   ├── next.config.js         # Configuração Next.js
│   └── tailwind.config.js     # Configuração Tailwind CSS
│
├── apcpro-api/                # Backend (Node.js + Express + Prisma)
│   ├── controllers/           # Recebem requisições HTTP
│   ├── services/              # Lógica de negócio
│   ├── repositories/          # Prisma ORM (acesso ao banco)
│   ├── middlewares/           # Autenticação, validação, etc
│   ├── models/                # Tipos/interfaces TypeScript
│   ├── utils/                 # Funções auxiliares
│   ├── routes.ts              # Endpoints da API
│   ├── prisma/                # Schema e migrations do banco
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── tests/                 # Testes automatizados do backend
│   ├── .env                   # Variáveis de ambiente backend
│   └── server.ts              # Entry point do servidor Express
│
├── .github/                   # Workflows, templates e instruções do Copilot
│   └── copilot-instructions.md
│
├── README.md                  # Documentação principal do projeto
├── package.json               # Dependências e scripts do monorepo (caso use)
└── .gitignore                 # Arquivos/dirs ignorados pelo git
```

## Convenções de Código

### Nomenclatura
- **Componentes:** PascalCase (ex: `CurriculumEditor`)
- **Arquivos:** kebab-case (ex: `curriculum-editor.tsx`)
- **Variáveis/Funções:** camelCase (ex: `generateResume`)
- **Constantes:** SNAKE_CASE (ex: `MAX_FREE_DOWNLOADS`)

### Componentes React
- Use TypeScript para todos os componentes
- Prefira Server Components quando possível
- Use 'use client' apenas quando necessário
- Implemente interfaces para props

### Estilização
- Use Tailwind CSS como padrão
- Mantenha classes organizadas (responsive-first)
- Use CSS Modules apenas para casos específicos
- Evite inline styles

### Banco de Dados
- Use Prisma como ORM
- Nomeie tabelas no singular em português (ex: `usuario`, `treino`)
- Use camelCase para campos
- Implemente relacionamentos adequados

## Funcionalidades

#### 1. Autenticação e Cadastro
- Login via Google OAuth e email/senha (NextAuth.js)
- Recuperação de senha por email
- Cadastro de novos usuários (personal e aluno)
- Perfis distintos: Personal Trainer e Aluno

#### 2. Gestão de Usuários
- Visualização e edição de perfil
- Upload de foto de perfil
- Gerenciamento de dados pessoais e contato

#### 3. Avaliação Física
- Cadastro de avaliações físicas (peso, altura, IMC, circunferências, dobras, etc)
- Histórico de avaliações por usuário
- Geração automática de gráficos de evolução

#### 4. Prescrição de Treinos
- Criação, edição e exclusão de treinos personalizados
- Biblioteca de exercícios com imagens e instruções
- Organização dos treinos por dias da semana e grupos musculares
- Atribuição de treinos para alunos

#### 5. Controle de Treinos
- Registro de treinos realizados pelo aluno
- Feedback do aluno sobre o treino (dificuldade, observações)
- Visualização do histórico de treinos

#### 6. Relatórios e PDF
- Geração de relatórios de avaliação física em PDF
- Exportação de treinos em PDF para impressão ou compartilhamento

#### 7. Pagamentos (Personal)
- Integração com Stripe para cobrança de planos
- Gestão de assinaturas e pagamentos recorrentes

#### 8. Notificações
- Notificações por email para eventos importantes (novo treino, avaliação, renovação de plano)

#### 9. Dashboard
- Painel com visão geral para personal e aluno (treinos ativos, avaliações recentes, progresso)

#### 10. Acessibilidade e Segurança
- Interface responsiva e acessível
- Validação de dados no frontend e backend
- Proteção de rotas e dados sensíveis

---

## Regras de Desenvolvimento

### Performance
- Use Next.js Image para imagens
- Implemente loading states
- Use Suspense boundaries
- Otimize bundle size

### SEO
- Meta tags dinâmicas
- Schema markup
- Sitemap automático
- URLs amigáveis

### Acessibilidade
- Suporte a screen readers
- Navegação por teclado
- Contraste adequado
- Labels descritivos

### Segurança
- Validação no frontend e backend
- Rate limiting para APIs
- Sanitização de dados
- HTTPS obrigatório

## Comandos Úteis
```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Prisma
npx prisma migrate dev
npx prisma studio

# Testes
npm run test
```


Dessa forma, tifurico sempre irá me ajudar de acordo com as regras, arquitetura e tecnologias do seu projeto!


