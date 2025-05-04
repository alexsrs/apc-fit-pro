
  <h1 align="center"><strong>APC FIT Pro - Backend</strong></h1>
  <p align="center">
    🚀 Backend desenvolvido com Node.js, TypeScript, Express e Prisma para o gerenciamento de lógica de negócios e comunicação com o banco de dados.
  </p>


![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg?style=for-the-badge&logo=nodedotjs)
![Express](https://img.shields.io/badge/Express.js-4.x-lightgrey.svg?style=for-the-badge&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg?style=for-the-badge&logo=prisma)

---

# 🚀 Tecnologias

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

- **[TypeScript](https://www.typescriptlang.org/):** Superset para desenvolvimento JavaScript em escala.
- **[Node.js](https://nodejs.org/):** Ambiente de execução JavaScript no lado do servidor.
- **[Express](https://expressjs.com/):** Framework minimalista para criação de APIs.
- **[Prisma](https://www.prisma.io/):** ORM moderno para interagir com o banco de dados.

---

# 📂 Estrutura do Backend

O backend é responsável por gerenciar a lógica de negócios, autenticação e comunicação com o banco de dados. Ele foi desenvolvido utilizando **Node.js**, **Express** e **Prisma**.

## Camadas e Estrutura

1. **Rotas (`routes.ts`)**:
   - Define os endpoints da API.
   - Cada rota é associada a um controlador específico.

2. **Controladores (`controllers/`)**:
   - Gerenciam as requisições recebidas pelas rotas.
   - Exemplo: `users-controller.ts` processa requisições relacionadas a usuários.

3. **Serviços (`services/`)**:
   - Contêm a lógica de negócios.
   - Exemplo: `auth-service.ts` gerencia autenticação e geração de tokens.

4. **Repositórios (`repositories/`)**:
   - Abstraem o acesso ao banco de dados utilizando o Prisma.
   - Exemplo: `users-repository.ts` contém consultas relacionadas a usuários.

5. **Middlewares (`middlewares/`)**:
   - Interceptam requisições para validação, autenticação ou outras verificações.
   - Exemplo: `auth-middleware.ts` verifica se o usuário está autenticado.

6. **Modelos (`models/`)**:
   - Definem as interfaces e tipos utilizados no sistema.

7. **Prisma (`prisma/`)**:
   - Contém o esquema do banco de dados (`schema.prisma`) e migrações.

8. **Utilitários (`utils/`)**:
   - Funções auxiliares para operações comuns, como formatação de dados ou manipulação de erros.

---

# ⚡ Scripts Disponíveis

- `npm run dist`: Compila os arquivos TypeScript para JavaScript no diretório `dist`.
- `npm run start:dev`: Executa o servidor em modo de desenvolvimento.
- `npm run start:watch`: Executa o servidor com suporte a recarregamento automático.
- `npm run start:dist`: Compila o projeto e executa a versão compilada.

---

# 👨‍💻 Como Usar

Este projeto foi desenvolvido com base em um boilerplate Node.js para acelerar o desenvolvimento. Para clonar e executar esta aplicação, você precisará do [Git](https://git-scm.com), [Node.js v20+](https://nodejs.org/en/) e [NPM v10+](https://nodejs.org/en/) instalados no seu computador. A partir do terminal:

```bash
# Clone este repositório
git clone https://github.com/felipeAguiarCode/node-blue-boilerplate

# Acesse o diretório do projeto
cd node-blue-boilerplate

# Instale as dependências
npm install

# Inicie o servidor em modo de desenvolvimento
npm run start:dev
```

---

# ✨ Créditos


---

<div align="center">
  <p><sub>Feito com 💙 por <a href="https://github.com/alexsrs">Alex Sandro R. de Souza</a></sub></p>
</div>
