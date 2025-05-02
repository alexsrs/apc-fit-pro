# Introdução 
O APC PRO é o aplicativo que une ciência e tecnologia para revolucionar a prescrição de treinos físicos, oferecendo avaliação detalhada, planejamento personalizado e controle preciso de carga em uma única plataforma. Baseado no método “Avaliar, Planejar e Controlar” (APC), ele garante treinos mais eficazes, seguros e adaptados às necessidades individuais de cada aluno. Diferente de outros apps, o APC PRO se destaca pela personalização avançada e integração completa, permitindo ajustes contínuos e otimizando o trabalho de profissionais de educação física, tudo para transformar a experiência de treino e elevar os resultados a outro nível.

---

# Diagrama de Arquitetura em Camadas

Aqui está uma proposta de diagrama de arquitetura em camadas para o sistema APC PRO, separando frontend e backend:

![Diagrama de Arquitetura](docs/assets/architeture-diagram.png)

---

# Componentes Detalhados 🚀

## 🌐 Frontend (Next.js App)

### 🎨 1 - Camada de Apresentação:
- **Componentes:** Shadcn
- **Framework:** Páginas Next.js
- **Integração:** Chamadas à API backend

### 🔒 2 - NextAuth.js (Frontend):
- **Interface:** Autenticação de usuários
- **Segurança:** Gerenciamento de sessões e tokens JWT
- **Fluxos:** Redirecionamento de login/logout
- **Provedores:** Integração com provedores OAuth, como Google e GitHub

---

## 🖥️ Backend (Node.js/Express)

### 🌐 1 - API REST:
- **Estrutura:** Rotas Express organizadas por recursos
- **Middlewares:** Autenticação, validação, etc.

### 🛠️ 2 - Camada de Controllers:
- **Função:** Recebe requisições HTTP
- **Validação:** Dados de entrada
- **Serviços:** Chama serviços apropriados
- **Respostas:** Retorna respostas formatadas

### 🧠 3 - Camada de Services:
- **Lógica:** Regras de negócio do APC PRO
- **Cálculos:** Carga de treino
- **Planos:** Geração de planos personalizados
- **Processamento:** Avaliações detalhadas

### 🔑 4 - NextAuth.js (Backend):
- **Autenticação:** Geração e validação de sessões
- **Autorização:** Controle de acesso baseado em sessões
- **Integração:** Provedores OAuth, como Google e outros
- **Callbacks:** Personalização de comportamento, como redirecionamentos e manipulação de sessões

### 🗄️ 5 - Data Access Layer:
- **Estrutura:** Repositórios/Models
- **ORM:** Prisma
- **Consultas:** SQL personalizadas
- **Mapeamento:** Objeto-relacional

---

## 📅 Banco de Dados - MySQL
- **Armazenamento Persistente:** Tabelas para usuários, treinos, avaliações, etc.
- **Relacionamentos:** Relacionamentos entre entidades.

---

# Fluxo Típico do Sistema

1. Usuário interage com a interface Next.js.
2. Frontend faz requisição à API Node.js.
3. API valida autenticação via Auth.js.
4. Controller processa requisição e chama o Service apropriado.
5. Service aplica regras de negócio e usa a Data Access Layer.
6. Data Access Layer interage com o banco de dados MySQL.
7. Resposta retorna pelas camadas até o frontend.
8. Next.js atualiza a interface com os dados recebidos.

---

# Tecnologias:

> **💡 Dica:** Além das tecnologias mencionadas, este projeto utiliza as seguintes ferramentas e bibliotecas para aprimorar sua funcionalidade:
> 
> Certifique-se de consultar a documentação oficial de cada tecnologia para aproveitar ao máximo suas funcionalidades e entender como elas contribuem para a robustez e escalabilidade do sistema.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) ![NextAuth.js](https://img.shields.io/badge/NextAuth.js-35495E?style=for-the-badge&logo=auth0&logoColor=white)

- [Next.js](https://nextjs.org/) - Framework React para construção de aplicações web modernas, com suporte a renderização no servidor (SSR) e geração de sites estáticos (SSG).
- [Node.js](https://nodejs.org/) - Ambiente de execução JavaScript no lado do servidor, utilizado para construir a API backend do sistema.
- [Express](https://expressjs.com/) - Framework minimalista para Node.js, utilizado para criar e gerenciar rotas e middlewares de forma eficiente.
- [Prisma](https://www.prisma.io/docs/) - ORM moderno e flexível para interagir com o banco de dados, garantindo consultas otimizadas e tipagem estática.
- [NextAuth.js](https://next-auth.js.org/) - Biblioteca para implementar fluxos de login/logout, gerenciamento de tokens e integração com provedores OAuth. Autenticação segura e escalável, utilizando práticas recomendadas para proteção de dados sensíveis.
- [Shadcn](https://ui.shadcn.com/) - Biblioteca de componentes UI acessíveis e reutilizáveis, projetada para criar interfaces modernas e consistentes com facilidade.
---

# Getting Started
TODO: Guie os usuários para configurar o código em seus próprios sistemas. Nesta seção, você pode abordar:
1. Clone o repositório.

```bash
# Navegue até o diretório onde deseja clonar o repositório
cd /caminho/para/seu/diretorio

# Clone o repositório do projeto
git clone https://alexsrs@dev.azure.com/alexsrs/APC%20PRO/_git/APC%20PRO

# Acesse o diretório do projeto
cd APC\ PRO
```
2. Dependências de software.

```bash
# Acesse o diretório do backend
cd apcpro-api   

# Instale as dependências do backend
npm install

# Inicie o servidor de desenvolvimento backend
npm run start:dev

# Retorne ao diretório do projeto
cd ..

# Acesse o diretório do frontend
cd apcpro-web

# Instale as dependências do frontend
npm install 

# Inicie o servidor de desenvolvimento frontend
npm run dev
```

3. Configurar variáveis de ambiente.
```bash
# Retorne ao diretório do projeto
cd ..

# Cria o arquivo de variáveis do backend
copy /apcpro-api/.env.example /apcpro-api/.env

# Cria o arquivo de variáveis do frontend
copy /apcpro-web/.example.env.local /apcpro-api/.env.local

```

4. Referências da API.

---

# Build and Test
TODO: Descreva e mostre como construir o código e executar os testes.

---

# Contribute
TODO: Explique como outros usuários e desenvolvedores podem contribuir para melhorar o código.