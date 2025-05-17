<div align="center">
  <img src="apcpro-web/public/images/logo-na-capa.png" alt="Logo" height="200">

  <h1>APC FIT PRO</h1>
</div>

# Introdução

O APC FIT PRO é uma plataforma completa para prescrição, avaliação e controle de treinos físicos, unindo ciência e tecnologia para revolucionar a experiência de profissionais de educação física e alunos. Baseado no método “Avaliar, Planejar e Controlar” (APC), oferece avaliação detalhada, planejamento personalizado e controle preciso de carga em uma única solução. O grande diferencial está na personalização avançada, integração entre profissionais e alunos, e ajustes contínuos para otimizar resultados.

---

# Visão Geral do Projeto

- **Objetivo:** Oferecer avaliações detalhadas, planejamento personalizado e controle preciso de treinos, tudo em um só lugar, com base no método APC.
- **Diferencial:** Personalização avançada, integração entre profissionais e alunos, e ajustes contínuos para otimizar resultados.

---

# Diagrama de Arquitetura em Camadas

<div align="center">
   <img src="docs/assets/architeture-diagram.png" alt="Diagrama de Arquitetura">
</div>

---

# Arquitetura do Sistema

O sistema é dividido em duas grandes partes: **Frontend** e **Backend**.

## 🌐 Frontend (`apcpro-web`)

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Componentes UI:** [Shadcn](https://ui.shadcn.com/) e [Tailwind CSS](https://tailwindcss.com/)
- **Autenticação:** [NextAuth.js](https://next-auth.js.org/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estrutura:**
  - `app/`: Páginas e rotas do sistema (ex: `/dashboard`, `/setup-profile`)
  - `components/`: Componentes reutilizáveis e de interface
  - `lib/`: Funções utilitárias e integração com API
  - `services/`: Comunicação com o backend
  - `public/`: Arquivos estáticos (imagens, ícones, etc.)

## 🖥️ Backend (`apcpro-api`)

- **Framework:** [Express](https://expressjs.com/) (Node.js)
- **ORM:** [Prisma](https://www.prisma.io/docs/) (acesso ao banco de dados)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estrutura:**
  - `controllers/`: Recebem requisições HTTP e retornam respostas
  - `services/`: Lógica de negócio (ex: criação de perfis, regras de treino)
  - `repositories/`: Acesso ao banco de dados via Prisma
  - `middlewares/`: Autenticação, validação, etc.
  - `models/`: Tipos e interfaces do sistema
  - `routes.ts`: Define os endpoints da API

## 🔒 Autenticação

- Utiliza o **NextAuth.js** tanto no frontend quanto no backend para autenticação segura, gerenciamento de sessões e integração com provedores OAuth (ex: Google).

## 📅 Banco de Dados - PostgreSQL

- **Armazenamento Persistente:** Tabelas para usuários, treinos, avaliações, etc.
- **Relacionamentos:** Relacionamentos entre entidades.

---

# Fluxo Típico do Sistema

1. Usuário interage com a interface Next.js.
2. Frontend faz requisição à API Node.js.
3. API valida autenticação via Auth.js.
4. Controller processa requisição e chama o Service apropriado.
5. Service aplica regras de negócio e usa a Data Access Layer.
6. Data Access Layer interage com o banco de dados **PostgreSQL**.
7. Resposta retorna pelas camadas até o frontend.
8. Next.js atualiza a interface com os dados recebidos.

---

# Estrutura do Projeto

## Raiz do Projeto

- **apcpro-api**: Diretório do backend, desenvolvido com Node.js, Express e Prisma.
- **apcpro-web**: Diretório do frontend, desenvolvido com Next.js e Shadcn.
- **`.github/`**: Arquivos de configuração e workflows do GitHub Actions.
- **`README.md`**: Documentação principal do projeto.

## Backend (apcpro-api)

- **`src/`**: Código-fonte principal do backend.
  - **`controllers/`**: Controladores para gerenciar requisições.
  - **`services/`**: Lógica de negócios.
  - **`repositories/`**: Acesso ao banco de dados com Prisma.
  - **`middlewares/`**: Middlewares para autenticação e validação.
  - **`models/`**: Interfaces e tipos do sistema.
  - **`utils/`**: Funções utilitárias.
  - **`routes.ts`**: Definição das rotas da API.
- **`prisma/`**: Configuração do Prisma.
  - **`schema.prisma`**: Esquema do banco de dados.
  - **`migrations/`**: Migrações do banco de dados.
- **`.env`**: Variáveis de ambiente.
- **`package.json`**: Dependências e scripts do backend.

## Frontend (apcpro-web)

- **`src/`**: Código-fonte principal do frontend.
  - **`app/`**: Estrutura de páginas do Next.js.
    - **`dashboard/`**: Página principal do dashboard.
    - **`setup-profile/`**: Página de configuração de perfil.
  - **`components/`**: Componentes reutilizáveis.
    - **`ui/`**: Componentes de interface (ex.: botões, formulários).
  - **`lib/`**: Funções utilitárias e abstrações.
  - **`services/`**: Comunicação com a API backend.
- **`public/`**: Arquivos estáticos (imagens, ícones, etc.).
- **`.env`**: Variáveis de ambiente.
- **`package.json`**: Dependências e scripts do frontend.

---

# Tecnologias

> **💡 Dica:** Consulte a documentação oficial de cada tecnologia para aproveitar ao máximo suas funcionalidades e entender como elas contribuem para a robustez e escalabilidade do sistema.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) ![NextAuth.js](https://img.shields.io/badge/NextAuth.js-35495E?style=for-the-badge&logo=auth0&logoColor=white)

- [Next.js](https://nextjs.org/) - Framework React para construção de aplicações web modernas, com suporte a SSR e SSG.
- [Node.js](https://nodejs.org/) - Ambiente de execução JavaScript no lado do servidor.
- [Express](https://expressjs.com/) - Framework minimalista para Node.js.
- [Prisma](https://www.prisma.io/docs/) - ORM moderno e flexível para banco de dados.
- [NextAuth.js](https://next-auth.js.org/) - Biblioteca para autenticação segura e escalável.
- [Shadcn](https://ui.shadcn.com/) - Componentes UI acessíveis e reutilizáveis.
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário para estilização rápida e responsiva.
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática para melhor manutenção e escalabilidade.

---

# Getting Started

## 1. Clone o repositório

```bash
# Navegue até o diretório onde deseja clonar o repositório
cd /caminho/para/seu/diretorio

# Clone o repositório do projeto
git clone https://alexsrs@dev.azure.com/alexsrs/APC%20PRO/_git/APC%20PRO

# Acesse o diretório do projeto
cd APC\ PRO
```

## 2. Instale as dependências

```bash
# Backend
cd apcpro-api
npm install
npm run start:dev

# Frontend
cd ../apcpro-web
npm install
npm run dev
```

## 3. Configure as variáveis de ambiente

```bash
# Backend
copy /apcpro-api/.env.example /apcpro-api/.env

# Frontend
copy /apcpro-web/.example.env.local /apcpro-web/.env.local
```

---

# Build e Testes

## Build

```bash
# Backend
cd apcpro-api
npm run build

# Frontend
cd ../apcpro-web
npm run build
```

## Testes

```bash
# Backend
cd apcpro-api
npm run test

# Frontend
cd ../apcpro-web
npm run test
```

---

# Scripts Disponíveis

- `npm run dist`: Compila os arquivos TypeScript para JavaScript no diretório `dist`.
- `npm run start:dev`: Executa o servidor em modo de desenvolvimento.
- `npm run start:watch`: Executa o servidor com suporte a recarregamento automático.
- `npm run start:dist`: Compila o projeto e executa a versão compilada.

---

# Contribuindo

Contribuições são bem-vindas! Siga as etapas abaixo para contribuir com o projeto:

1. **Faça um fork do repositório**.
2. **Clone o repositório forkado**.
3. **Crie uma nova branch para sua contribuição**.
4. **Faça suas alterações** seguindo as melhores práticas.
5. **Teste suas alterações**.
6. **Envie suas alterações**.
7. **Abra um Pull Request**.

Agradecemos por contribuir para o APC FIT PRO! 😊

---

<div align="center">
  <p><sub>Feito com 💙 por <a href="https://github.com/alexsrs">Alex Sandro R. de Souza</a></sub></p>
</div>
