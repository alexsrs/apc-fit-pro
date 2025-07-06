<div align="center">
  <img src="apcpro-web/public/images/logo-na-capa.png" alt="Logo" height="200">

  <h1>APC FIT PRO</h1>
  
  <p><strong>Plataforma Completa para Avaliação, Prescrição e Controle de Treinos Físicos</strong></p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
</div>

## 📑 Índice

- [Introdução](#introdução)
- [Visão Geral do Projeto](#visão-geral-do-projeto)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Tecnologias](#tecnologias)
- [Início Rápido](#início-rápido)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Comandos Disponíveis](#comandos-disponíveis)
- [Funcionalidades Implementadas](#-funcionalidades-implementadas)
- [Deploy](#deploy)
- [Troubleshooting](#troubleshooting)
- [Links Úteis](#links-úteis)
- [Contribuindo](#contribuindo)

---

# Introdução

O **APC FIT PRO** é uma plataforma completa para prescrição, avaliação e controle de treinos físicos, unindo ciência e tecnologia para revolucionar a experiência de profissionais de educação física e alunos. Baseado no método **"Avaliar, Planejar e Controlar" (APC)**, oferece avaliação detalhada, planejamento personalizado e controle preciso de carga em uma única solução.

## 🎯 Principais Características

- **Personalização Avançada:** Algoritmos inteligentes para prescrição individualizada
- **Integração Professor-Aluno:** Fluxo colaborativo e comunicação em tempo real
- **Método APC:** Fundamentado em evidências científicas
- **Interface Moderna:** Design responsivo e acessível
- **Escalabilidade:** Arquitetura preparada para crescimento

---

# Visão Geral do Projeto

- **Objetivo:** Oferecer avaliações detalhadas, planejamento personalizado e controle preciso de treinos, tudo em um só lugar, com base no método APC.
- **Diferencial:** Personalização avançada, integração entre profissionais e alunos, e ajustes contínuos para otimizar resultados.
- **Público-Alvo:** Profissionais de Educação Física e seus alunos
- **Modalidade:** Plataforma Web Progressive (PWA)er">
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

## ☁️ Microserviço de Mensageria (CloudAMQP/RabbitMQ)

- **Função:** Responsável pela comunicação assíncrona entre serviços do sistema, utilizando filas para processar eventos, tarefas e integrações de forma desacoplada.
- **Integração:** O backend (`apcpro-api`) publica e consome mensagens via CloudAMQP, permitindo escalabilidade e maior resiliência no processamento de dados.
- **Tecnologia:** [CloudAMQP](https://www.cloudamqp.com/) (RabbitMQ gerenciado na nuvem).

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
- **CloudAMQP:** Instância gerenciada de RabbitMQ utilizada para mensageria entre serviços (configuração via variáveis de ambiente).
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

A plataforma utiliza tecnologias modernas e robustas para garantir performance, escalabilidade e manutenibilidade:

## 🎨 Frontend
- **[Next.js 14](https://nextjs.org/)** - Framework React com App Router, SSR e SSG
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para maior confiabilidade
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário para estilização rápida
- **[Shadcn/ui](https://ui.shadcn.com/)** - Componentes UI acessíveis e reutilizáveis
- **[NextAuth.js](https://next-auth.js.org/)** - Autenticação segura e escalável

## 🔧 Backend
- **[Node.js](https://nodejs.org/)** - Runtime JavaScript para servidor
- **[Express.js](https://expressjs.com/)** - Framework web minimalista e flexível
- **[Prisma ORM](https://www.prisma.io/)** - ORM moderno com tipagem automática
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional robusto
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática no backend

## ☁️ Infraestrutura
- **[CloudAMQP](https://www.cloudamqp.com/)** - Mensageria RabbitMQ gerenciada
- **[Azure](https://azure.microsoft.com/)** - Plataforma de deploy e hospedagem
- **[Vercel](https://vercel.com/)** - Deploy do frontend (alternativa)

---

# Início Rápido

## 📋 Pré-requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**
- **PostgreSQL** 14+
- **Git**

## 🚀 Instalação

### 1. Clone o repositório

```powershell
# Navegue até o diretório desejado
cd C:\Projetos

# Clone o repositório
git clone https://alexsrs@dev.azure.com/alexsrs/APC%20PRO/_git/APC%20PRO apc-fit-pro

# Acesse o diretório
cd apc-fit-pro
```

### 2. Configure o Backend

```powershell
# Acesse o diretório da API
cd apcpro-api

# Instale as dependências
npm install

# Configure as variáveis de ambiente
copy .env.example .env
# Edite o arquivo .env com suas configurações

# Execute as migrações do banco
npx prisma migrate dev

# Inicie o servidor de desenvolvimento
npm run start:dev
```

### 3. Configure o Frontend

```powershell
# Em outro terminal, acesse o diretório web
cd apcpro-web

# Instale as dependências
npm install

# Configure as variáveis de ambiente
copy .env.local.example .env.local
# Edite o arquivo .env.local com suas configurações

# Inicie o servidor de desenvolvimento
npm run dev
```

### 4. Acesse a aplicação

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001
- **Swagger:** http://localhost:3001/api-docs

## 🔧 Configuração do Banco de Dados

### PostgreSQL Local

```powershell
# Instalar PostgreSQL (Windows)
winget install PostgreSQL.PostgreSQL

# Criar banco de dados
createdb apc_fit_pro_dev

# String de conexão no .env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/apc_fit_pro_dev"
```

### Docker (Alternativa)

```powershell
# Usar o compose fornecido
cd apcpro-bd
docker-compose up -d
```

---

# Comandos Disponíveis

## 🔙 Backend (apcpro-api)

```powershell
# Desenvolvimento
npm run start:dev          # Inicia em modo desenvolvimento
npm run start:watch        # Inicia com reload automático
npm run build              # Compila o projeto
npm run start:dist         # Executa a versão compilada

# Banco de Dados
npx prisma migrate dev      # Aplica migrações em desenvolvimento
npx prisma migrate deploy   # Aplica migrações em produção
npx prisma generate         # Gera o cliente Prisma
npx prisma studio          # Interface visual do banco

# Testes e Qualidade
npm run test               # Executa testes
npm run test:watch         # Testes em modo watch
npm run lint               # Verifica código com ESLint
npm run format             # Formata código com Prettier
```

## 🎨 Frontend (apcpro-web)

```powershell
# Desenvolvimento
npm run dev                # Inicia servidor de desenvolvimento
npm run build              # Compila para produção
npm run start              # Inicia servidor de produção
npm run preview            # Preview da build

# Testes e Qualidade
npm run test               # Executa testes
npm run test:ui            # Interface de testes
npm run lint               # Verifica código
npm run type-check         # Verifica tipagem TypeScript

# Componentes
npx shadcn-ui add [component]  # Adiciona componente Shadcn
```

---

# ✅ Funcionalidades Implementadas

O APC FIT PRO já possui as seguintes funcionalidades plenamente desenvolvidas e testadas:

## 🔐 Autenticação e Gestão de Usuários

- ✅ **Autenticação NextAuth.js:** Login via Google OAuth e email/senha
- ✅ **Gestão de Perfis:** Criação e edição de perfis para professores e alunos
- ✅ **Configuração Inicial:** Setup Profile com escolha de papel (professor/aluno)
- ✅ **Relacionamentos:** Vinculação professor-aluno com convites por link
- ✅ **Middleware de Autenticação:** Proteção de rotas e validação JWT

## 📊 Sistema de Avaliações Físicas Completo

### 1. Triagem Inteligente APC
- ✅ **Questionário Automatizado:** Identificação do objetivo principal (Controle de Doença, Saúde/Bem-estar, Estética/Hipertrofia, Alta Performance)
- ✅ **Classificação Automática:** Algoritmo de classificação baseado nas respostas
- ✅ **Validação de Avaliação:** Sistema para verificar se aluno possui avaliação válida
- ✅ **Interface Modal:** Modal específico para alunos com fluxo guiado

### 2. Anamnese Estratégica Completa
- ✅ **Entrevista Aprofundada:** Perguntas segmentadas por objetivo identificado
- ✅ **Histórico Médico:** Coleta de informações sobre lesões, limitações e condições de saúde
- ✅ **Preferências e Logística:** Análise de disponibilidade, preferências e comprometimento
- ✅ **Integração com Triagem:** Abertura automática após triagem (exceto para Alto Rendimento)
- ✅ **Formulário Validado:** Validação completa com feedback em tempo real

### 3. Avaliação de Alto Rendimento
- ✅ **Protocolo Específico:** Avaliação diferenciada para atletas e esportistas
- ✅ **Métricas Avançadas:** Coleta de dados específicos para alta performance
- ✅ **Integração Automática:** Seleção baseada no resultado da triagem

### 4. Medidas Corporais e Antropometria
- ✅ **Coleta Completa:** Peso, altura, circunferências (pescoço, cintura, quadril, membros)
- ✅ **Cálculos Automáticos:** IMC, RCQ, Circunferência Abdominal com classificações
- ✅ **Interface Organizada:** Divisão por regiões corporais (tronco, membros)
- ✅ **Validação em Tempo Real:** Feedback imediato com classificações

### 5. Dobras Cutâneas e Composição Corporal
- ✅ **Múltiplos Protocolos:** Jackson & Pollock (3 e 7 dobras), Guedes, Petroski, Faulkner
- ✅ **Cálculos Automáticos:** Densidade corporal, percentual de gordura, massa gorda/magra
- ✅ **Classificações por Gênero/Idade:** Referências específicas para cada protocolo
- ✅ **Interface Moderna:** Componente avançado com validação e feedback
- ✅ **API Robusta:** Endpoints específicos para cada protocolo com documentação completa

### 6. Sistema de Status e Aprovações
- ✅ **Controle de Status:** Pendente, Aprovada, Reprovada, Vencida
- ✅ **Gestão de Validade:** Definição de prazo pelo professor (padrão 90 dias)
- ✅ **Aprovação por Professor:** Interface para aprovação/reprovação com motivos
- ✅ **Verificação Automática:** Detecção de avaliações vencidas
- ✅ **Badges Visuais:** Indicadores coloridos para cada status

## 📈 Controle e Acompanhamento

- ✅ **Histórico de Avaliações:** Lista completa com status e validade
- ✅ **Próxima Avaliação:** Cálculo automático da data de reavaliação
- ✅ **Evolução Física:** Comparação entre avaliações com indicadores visuais
- ✅ **Métricas de Progresso:** Análise de peso, massa magra e gordura corporal
- ✅ **Detalhamento Completo:** Modal com visualização detalhada dos resultados
- ✅ **Avaliações Pendentes:** Painel específico para professores gerenciarem aprovações

## 🔔 Sistema de Alertas Inteligentes

- ✅ **Mensageria CloudAMQP:** Integração com RabbitMQ para notificações assíncronas
- ✅ **Alertas Automáticos:** Notificações geradas após cadastro de avaliações
- ✅ **Alertas por Usuário:** Sistema persistente para professores e alunos
- ✅ **API de Alertas:** Endpoints para consumo e gestão de notificações

## 👥 Dashboards Específicos

### Dashboard do Professor
- ✅ **Gestão de Alunos:** Lista, busca e visualização de alunos vinculados
- ✅ **Métricas do Professor:** Total de alunos, novos cadastros, alunos ativos
- ✅ **Convite de Alunos:** Sistema de convite via link com professorId
- ✅ **Nova Avaliação:** Modal completo para criar avaliações para alunos
- ✅ **Avaliações Pendentes:** Painel específico para aprovar/reprovar avaliações
- ✅ **Detalhes do Aluno:** Modal com histórico completo e informações detalhadas
- ✅ **Alertas Inteligentes:** Notificações específicas para o professor

### Dashboard do Aluno
- ✅ **Métricas Pessoais:** Treinos realizados, próxima avaliação, evolução física
- ✅ **Abertura Automática:** Modal de avaliação abre automaticamente se necessário
- ✅ **Fluxo Guiado:** Etapas sequenciais de avaliação com validação
- ✅ **Histórico Completo:** Lista de avaliações com status e validade
- ✅ **Ações Rápidas:** Acesso direto para diferentes tipos de avaliação
- ✅ **Alertas Personalizados:** Notificações relevantes para o aluno

## 🛠️ Infraestrutura e API

- ✅ **API RESTful Completa:** 35+ endpoints documentados com Swagger
- ✅ **Documentação Swagger:** Interface interativa para testes da API
- ✅ **Health Check:** Monitoramento de status da aplicação
- ✅ **Métricas do Sistema:** Endpoints para monitoramento de performance
- ✅ **CORS Configurado:** Suporte para requisições cross-origin
- ✅ **Deploy Azure:** Configuração completa para produção no Azure
- ✅ **Banco PostgreSQL:** Schema Prisma com 30+ migrações aplicadas

## 🎨 Interface e Experiência

- ✅ **Design Responsivo:** Interface adaptável para desktop, tablet e mobile
- ✅ **Componentes Shadcn:** UI moderna e acessível com sistema de design consistente
- ✅ **Sidebar Dinâmica:** Navegação adaptada por perfil (professor/aluno)
- ✅ **Modais Padronizados:** Sistema de modais reutilizáveis com ModalPadrao
- ✅ **Loading States:** Indicadores de carregamento em todas as operações
- ✅ **Tratamento de Erros:** Validação e feedback em tempo real
- ✅ **Progress Indicators:** Barras de progresso para fluxos multi-etapas
- ✅ **Sistema de Badges:** Indicadores visuais para status e classificações

## 🔧 Qualidade e Manutenibilidade

- ✅ **Código Limpo:** Zero warnings de lint após refatoração completa
- ✅ **TypeScript Strict:** Tipagem estática em 100% do código
- ✅ **Componentes Reutilizáveis:** Biblioteca de componentes padronizados
- ✅ **Utilitários Centralizados:** Conversores e helpers sem duplicação
- ✅ **Documentação Técnica:** Guides e documentação para todos os componentes
- ✅ **Testes de Build:** Build automatizado sem erros de compilação

---

# 🔄 Fluxo Implementado da Avaliação Física

1. **Aluno Entra no Sistema** → Verifica se possui avaliação válida
2. **Sem Avaliação Válida** → Abre automaticamente a Triagem
3. **Triagem Concluída** → Classifica objetivo e decide próximo passo
4. **Objetivo Não-Esportivo** → Abre automaticamente a Anamnese
5. **Anamnese Concluída** → Aluno pode acessar Medidas Corporais
6. **Medidas Corporais** → Cálculos automáticos e classificações
7. **Histórico Completo** → Todas as avaliações ficam disponíveis
8. **Evolução Física** → Comparações automáticas entre avaliações
9. **Alertas Gerados** → Professor recebe notificações via mensageria

> Todo o fluxo é automatizado, seguro e baseado em evidências científicas, promovendo avaliações detalhadas e prescrições individualizadas.

---

# Deploy

## 🚀 Deploy em Produção

### Azure (Recomendado)

```powershell
# Configurar Azure CLI
az login

# Deploy do backend
cd apcpro-api
az webapp create --name apc-fit-pro-api --resource-group apc-fit-pro-rg
az webapp deployment source config --name apc-fit-pro-api --resource-group apc-fit-pro-rg --repo-url https://github.com/seu-usuario/apc-fit-pro

# Deploy do frontend
cd ../apcpro-web
npm run build
az storage blob upload-batch --source ./out --destination '$web' --account-name apcfitprostorage
```

### Vercel (Frontend)

```powershell
# Instalar Vercel CLI
npm install -g vercel

# Deploy do frontend
cd apcpro-web
vercel --prod
```

### Railway (Backend)

```powershell
# Conectar ao Railway
railway login
railway link

# Deploy
railway up
```

## 📋 Checklist de Deploy

- [ ] Configurar variáveis de ambiente
- [ ] Executar migrações do banco
- [ ] Configurar domínio personalizado
- [ ] Configurar SSL/TLS
- [ ] Configurar monitoramento
- [ ] Testar todas as funcionalidades
- [ ] Configurar backup do banco de dados

---

# Troubleshooting

## 🔧 Problemas Comuns

### Erro de Conexão com Banco de Dados

```powershell
# Verificar se PostgreSQL está rodando
Get-Service postgresql*

# Testar conexão
psql -h localhost -U postgres -d apc_fit_pro_dev
```

### Erro nas Migrações do Prisma

```powershell
# Resetar migrações (apenas desenvolvimento)
npx prisma migrate reset

# Forçar aplicação das migrações
npx prisma db push
```

### Erro de Módulos não Encontrados

```powershell
# Limpar cache e reinstalar
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Erro de Porta já em Uso

```powershell
# Verificar processos na porta 3000
netstat -ano | findstr :3000

# Finalizar processo (substitua PID)
taskkill /F /PID [PID]
```

### Erro de Permissões

```powershell
# Executar como administrador
# ou ajustar permissões de pasta
icacls "C:\Projetos\apc-fit-pro" /grant Users:F /T
```

## 🆘 Suporte

Se você encontrar problemas não listados aqui:

1. **Verifique os logs** da aplicação
2. **Consulte a documentação** das tecnologias utilizadas
3. **Abra uma issue** no repositório com detalhes do erro
4. **Entre em contato** com a equipe de desenvolvimento

---

# Links Úteis

## 📚 Documentação

- **[Documentação do Projeto](./docs/README.md)** - Documentação técnica completa
- **[API Swagger](http://localhost:3001/api-docs)** - Documentação interativa da API
- **[Guia de Contribuição](./CONTRIBUTING.md)** - Como contribuir com o projeto

## 🛠️ Ferramentas de Desenvolvimento

- **[Prisma Studio](https://www.prisma.io/studio)** - Interface visual do banco de dados
- **[Next.js DevTools](https://nextjs.org/docs/debugging)** - Ferramentas de debug
- **[VS Code Extensions](https://code.visualstudio.com/docs/editor/extension-marketplace)** - Extensões recomendadas

## 🔗 Tecnologias Utilizadas

- **[Next.js Documentation](https://nextjs.org/docs)** - Documentação oficial do Next.js
- **[Prisma Documentation](https://www.prisma.io/docs)** - Documentação oficial do Prisma
- **[Tailwind CSS Documentation](https://tailwindcss.com/docs)** - Documentação oficial do Tailwind
- **[Shadcn/ui Documentation](https://ui.shadcn.com/)** - Documentação dos componentes

## 🚀 Deploy e Hospedagem

- **[Azure Documentation](https://docs.microsoft.com/azure)** - Documentação do Azure
- **[Vercel Documentation](https://vercel.com/docs)** - Documentação do Vercel
- **[Railway Documentation](https://docs.railway.app/)** - Documentação do Railway

---

# Contribuindo

Contribuições são muito bem-vindas! Este projeto segue as melhores práticas de desenvolvimento colaborativo.

## 🤝 Como Contribuir

### 1. Preparação do Ambiente

```powershell
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/seu-usuario/apc-fit-pro.git
cd apc-fit-pro

# Adicione o repositório original como upstream
git remote add upstream https://github.com/alexsrs/apc-fit-pro.git
```

### 2. Fluxo de Desenvolvimento

```powershell
# Crie uma branch para sua feature
git checkout -b feature/nova-funcionalidade

# Faça suas alterações
# Commit com mensagem descritiva
git commit -m "feat: adiciona nova funcionalidade X"

# Push para seu fork
git push origin feature/nova-funcionalidade

# Abra um Pull Request
```

### 3. Padrões de Commit

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Alterações na documentação
- `style:` - Alterações de formatação
- `refactor:` - Refatoração de código
- `test:` - Adição ou correção de testes
- `chore:` - Tarefas de manutenção

### 4. Diretrizes

- ✅ **Código limpo** e bem documentado
- ✅ **Testes** para novas funcionalidades
- ✅ **TypeScript** com tipagem adequada
- ✅ **Responsividade** para interfaces
- ✅ **Acessibilidade** seguindo padrões WCAG

### 5. Processo de Review

1. **Automated Tests** - Todos os testes devem passar
2. **Code Review** - Pelo menos uma aprovação necessária
3. **Documentation** - Atualizar docs se necessário
4. **Manual Testing** - Testar funcionalidades impactadas

## 🎯 Áreas para Contribuição

- 🐛 **Bug Reports** - Reporte problemas encontrados
- 💡 **Feature Requests** - Sugira novas funcionalidades
- 📝 **Documentation** - Melhore a documentação
- 🧪 **Tests** - Adicione ou melhore testes
- 🎨 **UI/UX** - Melhorias na interface
- 🔧 **Performance** - Otimizações de performance

Agradecemos por contribuir para o APC FIT PRO! �

---

<div align="center">
  <p><strong>Feito com 💙 por <a href="https://github.com/alexsrs">Alex Sandro R. de Souza</a></strong></p>
  <p><sub>APC FIT PRO - Transformando a Educação Física com Tecnologia</sub></p>
</div>
