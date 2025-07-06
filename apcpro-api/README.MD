
# APC FIT PRO - Backend API

Este é o backend do **APC FIT PRO**, uma API RESTful robusta para gerenciamento de avaliações físicas, prescrição e controle de treinos baseada no método APC (Avaliação, Prescrição e Controle).

A API foi desenvolvida com [Node.js](https://nodejs.org) e utiliza as melhores práticas de desenvolvimento para garantir performance, segurança e escalabilidade.

## 🚀 Tecnologias Utilizadas

- **[Node.js 20+](https://nodejs.org)** - Ambiente de execução JavaScript
- **[TypeScript](https://www.typescriptlang.org)** - Tipagem estática para JavaScript
- **[Express.js](https://expressjs.com)** - Framework web minimalista e flexível
- **[Prisma](https://www.prisma.io)** - ORM moderno com type-safety
- **[PostgreSQL](https://www.postgresql.org)** - Banco de dados relacional avançado
- **[JWT](https://jwt.io)** - Autenticação e autorização segura
- **[Bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Hash de senhas criptográfico
- **[Joi](https://joi.dev)** - Validação de dados robusta
- **[Swagger](https://swagger.io)** - Documentação automática da API

## 🎯 Funcionalidades Principais

### 🔐 **Sistema de Autenticação**
- Autenticação JWT com refresh tokens
- Hash seguro de senhas com bcrypt
- Middleware de autorização por roles
- Validação e sanitização de dados

### 📊 **Sistema de Avaliações Físicas**
- **API de Triagem**: Classificação automática de objetivos com algoritmo APC
- **API de Anamnese**: Processamento de dados estratégicos de saúde
- **API de Medidas Corporais**: Cálculos automáticos de IMC, %GC, RCQ, CA
- **API de Resultados**: Processamento e análise de dados antropométricos

### 👥 **Gestão de Usuários**
- CRUD completo de usuários (Personal e Alunos)
- Sistema de perfis diferenciados
- Gestão de convites e relacionamentos
- Upload e processamento de imagens

### 📈 **Analytics e Relatórios**
- Processamento de evolução física
- Geração de relatórios em PDF
- Métricas de performance
- Logs de auditoria

## 🏗️ Estrutura do Projeto

```
apcpro-api/
├── src/
│   ├── controllers/             # Controladores HTTP
│   │   ├── auth-controller.ts   # Autenticação e autorização
│   │   ├── users-controller.ts  # Gestão de usuários
│   │   ├── avaliacao-controller.ts # Avaliações físicas
│   │   ├── avaliarCA-controller.ts # Circunferência Abdominal
│   │   └── ...                  # Outros controladores
│   │
│   ├── services/                # Lógica de negócio
│   │   ├── auth-service.ts      # Serviços de autenticação
│   │   ├── users-service.ts     # Serviços de usuários
│   │   ├── avaliacao-service.ts # Serviços de avaliação
│   │   ├── ca-service.ts        # Serviços de CA
│   │   ├── rcq-service.ts       # Serviços de RCQ
│   │   └── ...                  # Outros serviços
│   │
│   ├── repositories/            # Camada de dados (Prisma)
│   │   ├── users-repository.ts  # Repositório de usuários
│   │   ├── avaliacoes-repository.ts # Repositório de avaliações
│   │   └── ...                  # Outros repositórios
│   │
│   ├── middlewares/             # Middlewares Express
│   │   ├── auth-middleware.ts   # Autenticação JWT
│   │   ├── validation-middleware.ts # Validação de dados
│   │   ├── error-middleware.ts  # Tratamento de erros
│   │   └── cors-middleware.ts   # Configuração CORS
│   │
│   ├── models/                  # Tipos e Interfaces
│   │   ├── user-model.ts        # Modelos de usuário
│   │   ├── avaliacao-model.ts   # Modelos de avaliação
│   │   ├── ca-model.ts          # Modelos de CA
│   │   ├── rcq-model.ts         # Modelos de RCQ
│   │   ├── genero-model.ts      # Enum de gênero
│   │   └── ...                  # Outros modelos
│   │
│   ├── utils/                   # Funções utilitárias
│   │   ├── avaliacaoMedidas.ts  # Cálculos antropométricos
│   │   ├── avaliacaoProcessor.ts # Processamento de avaliações
│   │   ├── conversorMedidas.ts  # Conversão de medidas
│   │   ├── jwt-utils.ts         # Utilitários JWT
│   │   ├── hash-utils.ts        # Utilitários de hash
│   │   └── ...                  # Outras utilidades
│   │
│   ├── validators/              # Schemas de validação
│   │   ├── auth-validators.ts   # Validação de autenticação
│   │   ├── user-validators.ts   # Validação de usuários
│   │   └── ...                  # Outros validadores
│   │
│   ├── app.ts                   # Configuração do Express
│   ├── server.ts                # Entry point da aplicação
│   ├── routes.ts                # Definição de rotas
│   ├── prisma.ts                # Cliente Prisma
│   └── swagger.ts               # Configuração Swagger
│
├── prisma/                      # Schema e migrações
│   ├── schema.prisma            # Definições do banco
│   └── migrations/              # Migrações do banco
│
├── docs/                        # Documentação
│   └── architeture.tldr         # Diagrama de arquitetura
│
├── Dockerfile                   # Container Docker
├── tsconfig.json                # Configuração TypeScript
├── package.json                 # Dependências e scripts
└── web.config                   # Configuração Azure
```

## 🛠️ Comandos Principais

### Desenvolvimento
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run start:dev

# Executar com watch (auto-reload)
npm run start:watch

# Verificar tipos TypeScript
npm run type-check
```

### Build e Deploy
```bash
# Compilar TypeScript
npm run dist

# Executar build compilado
npm run start:dist

# Build para produção
npm run build

# Executar em produção
npm start
```

### Banco de Dados (Prisma)
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev

# Deploy migrações (produção)
npx prisma migrate deploy

# Visualizar dados (Prisma Studio)
npx prisma studio

# Reset do banco (apenas desenvolvimento)
npx prisma migrate reset
```

### Testes e Qualidade
```bash
# Executar testes
npm test

# Executar testes em watch
npm run test:watch

# Cobertura de testes
npm run test:coverage

# Linting
npm run lint

# Formatação de código
npm run format
```

## 🎨 Padrões de Desenvolvimento

### Estrutura de Controlador
```typescript
// Exemplo de controlador padronizado
import { Request, Response, NextFunction } from "express";
import { UsuarioService } from "../services/usuario-service";
import { ok, badRequest, notFound } from "../utils/response-helper";

export class UsuarioController {
  private usuarioService: UsuarioService;

  constructor() {
    this.usuarioService = new UsuarioService();
  }

  async criarUsuario(req: Request, res: Response, next: NextFunction) {
    try {
      const dadosUsuario = req.body;
      const novoUsuario = await this.usuarioService.criar(dadosUsuario);
      return res.status(201).json(ok(novoUsuario));
    } catch (error) {
      next(error);
    }
  }

  async obterUsuario(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const usuario = await this.usuarioService.obterPorId(id);
      
      if (!usuario) {
        return res.status(404).json(notFound("Usuário não encontrado"));
      }
      
      return res.json(ok(usuario));
    } catch (error) {
      next(error);
    }
  }
}
```

### Estrutura de Serviço
```typescript
// Exemplo de serviço padronizado
import { PrismaClient } from "@prisma/client";
import { UsuarioModel, CriarUsuarioInput } from "../models/usuario-model";
import { HashService } from "./hash-service";

export class UsuarioService {
  private prisma: PrismaClient;
  private hashService: HashService;

  constructor() {
    this.prisma = new PrismaClient();
    this.hashService = new HashService();
  }

  async criar(dados: CriarUsuarioInput): Promise<UsuarioModel> {
    // Hash da senha
    const senhaHash = await this.hashService.hash(dados.senha);
    
    // Criar usuário no banco
    const novoUsuario = await this.prisma.user.create({
      data: {
        ...dados,
        senha: senhaHash,
      },
    });

    // Remover senha do retorno
    const { senha, ...usuarioSemSenha } = novoUsuario;
    return usuarioSemSenha as UsuarioModel;
  }

  async obterPorId(id: string): Promise<UsuarioModel | null> {
    const usuario = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        // ... outros campos (exceto senha)
      },
    });

    return usuario;
  }
}
```

### Nomenclatura
- **Classes**: PascalCase (`UsuarioService`)
- **Arquivos**: kebab-case (`usuario-service.ts`)
- **Variáveis/Funções**: camelCase (`criarUsuario`)
- **Constantes**: SNAKE_CASE (`MAX_UPLOAD_SIZE`)
- **Interfaces**: PascalCase com sufixo (`UsuarioModel`, `CriarUsuarioInput`)

## 🔧 Configurações Importantes

### Variáveis de Ambiente
Crie um arquivo `.env` com as seguintes variáveis:

```env
# Porta do servidor
PORT=8000

# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/apcfitpro"

# JWT
JWT_SECRET=sua_chave_jwt_super_secreta_aqui
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=sua_chave_refresh_jwt_aqui
JWT_REFRESH_EXPIRES_IN=7d

# Bcrypt
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=http://localhost:3000

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Email (se implementado)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app

# API Externa (se necessário)
OPENAI_API_KEY=sua_chave_openai
```

### Configuração do Banco
A API utiliza PostgreSQL com Prisma ORM:

```bash
# Primeira configuração
npx prisma migrate dev --name init
npx prisma generate
```

## 📊 Endpoints Principais

### Autenticação
```
POST   /auth/login           # Login de usuário
POST   /auth/register        # Cadastro de usuário
POST   /auth/refresh         # Renovar token
POST   /auth/logout          # Logout
POST   /auth/forgot-password # Esqueci minha senha
POST   /auth/reset-password  # Redefinir senha
```

### Usuários
```
GET    /users               # Listar usuários
GET    /users/:id           # Obter usuário por ID
POST   /users               # Criar usuário
PUT    /users/:id           # Atualizar usuário
DELETE /users/:id           # Deletar usuário
POST   /users/:id/avatar    # Upload de avatar
```

### Avaliações
```
GET    /avaliacoes          # Listar avaliações
GET    /avaliacoes/:id      # Obter avaliação por ID
POST   /avaliacoes          # Criar avaliação
PUT    /avaliacoes/:id      # Atualizar avaliação
DELETE /avaliacoes/:id      # Deletar avaliação
POST   /avaliacoes/medidas  # Calcular medidas corporais
```

### Avaliações Específicas
```
POST   /avaliar-ca          # Avaliar Circunferência Abdominal
POST   /avaliar-rcq         # Avaliar Relação Cintura-Quadril
POST   /avaliar-imc         # Avaliar Índice de Massa Corporal
POST   /processar-medidas   # Processar todas as medidas
```

## 🚀 Deploy

### Docker
```bash
# Build da imagem
docker build -t apc-fit-pro-api .

# Executar container
docker run -p 8000:8000 apc-fit-pro-api
```

### Azure App Service
1. Configure as variáveis de ambiente no portal Azure
2. Use o arquivo `web.config` incluído
3. Deploy automático via GitHub Actions

### Outros Provedores
- Configure as variáveis de ambiente
- Execute `npm run build`
- Inicie com `npm start`
- Node.js version: 20+

## 📚 Recursos Adicionais

### Documentação das Tecnologias
- **[Node.js Documentation](https://nodejs.org/docs)** - Documentação oficial do Node.js
- **[Express.js Guide](https://expressjs.com/guide)** - Guia completo do Express
- **[Prisma Documentation](https://www.prisma.io/docs)** - Documentação do Prisma ORM
- **[TypeScript Handbook](https://www.typescriptlang.org/docs)** - Manual do TypeScript
- **[PostgreSQL Documentation](https://www.postgresql.org/docs)** - Documentação do PostgreSQL

### API Documentation
- **Swagger UI**: Acesse `/api-docs` quando o servidor estiver rodando
- **Postman Collection**: Disponível na pasta `/docs`

### Links Úteis
- **[Repositório GitHub](https://github.com/seu-usuario/apc-fit-pro)** - Código fonte
- **[Issues & Features](https://github.com/seu-usuario/apc-fit-pro/issues)** - Reportar bugs
- **[Azure Portal](https://portal.azure.com)** - Gerenciar recursos Azure

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Convenções de Commit
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação/estilo
- `refactor:` - Refatoração de código
- `test:` - Adição de testes
- `chore:` - Tarefas de manutenção
- `perf:` - Melhorias de performance

### Padrões de Código
- Use TypeScript strict mode
- Implemente testes para novas funcionalidades
- Mantenha coverage acima de 80%
- Documente APIs com comentários JSDoc
- Siga os padrões ESLint configurados

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

Desenvolvido com ❤️ pela equipe APC FIT PRO.

---

**APC FIT PRO** - Transformando a avaliação física através da tecnologia.
