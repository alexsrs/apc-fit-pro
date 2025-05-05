<div align="center">
  <img src="apcpro-web/public/images/logo-na-capa.png" alt="Logo" height="200">

  <h1>APC FIT PRO</h1>

</div>

# Introdução 
O APC PRO é o aplicativo que une ciência e tecnologia para revolucionar a prescrição de treinos físicos, oferecendo avaliação detalhada, planejamento personalizado e controle preciso de carga em uma única plataforma. Baseado no método “Avaliar, Planejar e Controlar” (APC), ele garante treinos mais eficazes, seguros e adaptados às necessidades individuais de cada aluno. Diferente de outros apps, o APC PRO se destaca pela personalização avançada e integração completa, permitindo ajustes contínuos e otimizando o trabalho de profissionais de educação física, tudo para transformar a experiência de treino e elevar os resultados a outro nível.

<div align="center">
   <img src="https://img.shields.io/badge/API-Express.js-339933?style=for-the-badge&logo=express&logoColor=white" alt="API">
   <img src="https://img.shields.io/badge/Frontend-Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Frontend">
   <img src="https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="Database">
   <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
   <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
</div>


# Diagrama de Arquitetura em Camadas

Aqui está uma proposta de diagrama de arquitetura em camadas para o sistema APC PRO, separando frontend e backend:

<div align="center">
   <img src="docs/assets/architeture-diagram.png" alt="Diagrama de Arquitetura">
</div>

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
- **Estrutura:** Rotas Express organizadas por recursos.
- **Middlewares:** Autenticação, validação, etc.

### 🛠️ 2 - Camada de Controllers:
- **Função:** Recebe requisições HTTP.
- **Validação:** Dados de entrada.
- **Serviços:** Chama serviços apropriados.
- **Respostas:** Retorna respostas formatadas.

### 🧠 3 - Camada de Services:
- **Lógica:** Regras de negócio do APC PRO.
- **Cálculos:** Carga de treino.
- **Planos:** Geração de planos personalizados.
- **Processamento:** Avaliações detalhadas.

### 🔑 4 - NextAuth.js (Backend):
- **Autenticação:** Geração e validação de sessões.
- **Autorização:** Controle de acesso baseado em sessões.
- **Integração:** Provedores OAuth, como Google e outros.
- **Callbacks:** Personalização de comportamento, como redirecionamentos e manipulação de sessões.

### 🗄️ 5 - Data Access Layer:
- **Estrutura:** Repositórios/Models.
- **ORM:** Prisma.
- **Consultas:** SQL personalizadas.
- **Mapeamento:** Objeto-relacional.

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

# Estrutura do Backend

O backend é responsável por gerenciar a lógica de negócios, autenticação e comunicação com o banco de dados. Ele foi desenvolvido utilizando **Node.js**, **Express** e **Prisma**.

## Camadas e Estrutura

Para indexar seu projeto, você pode criar um arquivo README.md ou outro documento que liste a estrutura do projeto, explicando os diretórios e arquivos principais. Aqui está um exemplo de como você pode organizar a indexação do seu projeto:

---

### **Estrutura do Projeto**

#### **Raiz do Projeto**
- **apcpro-api**: Diretório do backend, desenvolvido com Node.js, Express e Prisma.
- **apcpro-web**: Diretório do frontend, desenvolvido com Next.js e Shadcn.
- **`.github/`**: Arquivos de configuração e workflows do GitHub Actions.
- **`README.md`**: Documentação principal do projeto.

---

#### **Backend (apcpro-api)**
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

---

#### **Frontend (apcpro-web)**
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

## Build
Para construir o projeto, siga os passos abaixo:

1. Certifique-se de que todas as dependências estão instaladas no backend e no frontend:
   ```bash
   # Backend
   cd apcpro-api
   npm install

   # Frontend
   cd ../apcpro-web
   npm install
   ```

2. Execute os scripts de build:
   ```bash
   # Backend
   cd apcpro-api
   npm run build

   # Frontend
   cd ../apcpro-web
   npm run build
   ```

3. Após o build, os arquivos gerados estarão disponíveis nos diretórios de saída (`/dist` para o backend e `.next` para o frontend).

## Test
Para executar os testes do projeto:

1. Certifique-se de que as dependências de desenvolvimento estão instaladas:
   ```bash
   # Backend
   cd apcpro-api
   npm install

   # Frontend
   cd ../apcpro-web
   npm install
   ```

2. Execute os testes:
   ```bash
   # Backend
   cd apcpro-api
   npm run test

   # Frontend
   cd ../apcpro-web
   npm run test
   ```

3. Verifique os relatórios de teste gerados para garantir que tudo está funcionando corretamente.

---

# Scripts Disponíveis

- `npm run dist`: Compila os arquivos TypeScript para JavaScript no diretório `dist`.
- `npm run start:dev`: Executa o servidor em modo de desenvolvimento.
- `npm run start:watch`: Executa o servidor com suporte a recarregamento automático.
- `npm run start:dist`: Compila o projeto e executa a versão compilada.

---

# Contribute

Contribuições são bem-vindas! Siga as etapas abaixo para contribuir com o projeto:

1. **Faça um fork do repositório**:
   - Clique no botão "Fork" no repositório para criar uma cópia em sua conta.

2. **Clone o repositório forkado**:
   ```bash
   git clone https://github.com/seu-usuario/APC-PRO.git
   cd APC-PRO
   ```

3. **Crie uma nova branch para sua contribuição**:
   ```bash
   git checkout -b minha-contribuicao
   ```

4. **Faça suas alterações**:
   - Certifique-se de seguir as práticas recomendadas e manter o código limpo e documentado.

5. **Teste suas alterações**:
   - Execute os testes para garantir que suas alterações não quebram o código existente.

6. **Envie suas alterações**:
   ```bash
   git add .
   git commit -m "Descrição das alterações"
   git push origin minha-contribuicao
   ```

7. **Abra um Pull Request**:
   - Vá até o repositório original e clique em "New Pull Request".
   - Descreva suas alterações e envie o Pull Request para revisão.

Agradecemos por contribuir para o APC PRO! 😊

---
<div align="center">
  <p><sub>Feito com 💙 por <a href="https://github.com/alexsrs">Alex Sandro R. de Souza</a></sub></p>
</div>
