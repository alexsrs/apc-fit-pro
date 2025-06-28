# 🚀 Guia de Contribuição - APC FIT PRO

## 📋 Fluxo de Branches

### **Estrutura de Branches:**

- **`main`** - Branch principal (produção)

  - Código estável e testado
  - Deploy automático (se configurado)
  - Protegida contra push direto

- **`develop`** - Branch de desenvolvimento

  - Base para novas funcionalidades
  - Integração contínua de features
  - Testes antes do merge para main

- **`feature/nome-da-funcionalidade`** - Branches para funcionalidades

  - Uma branch por funcionalidade
  - Nome descritivo (ex: `feature/sistema-relatorios`)
  - Criada a partir de `develop`

- **`hotfix/nome-do-fix`** - Branches para correções urgentes
  - Correções críticas em produção
  - Criada a partir de `main`
  - Merge direto para `main` e `develop`

## 🔄 Fluxo de Trabalho

### **1. Nova Funcionalidade:**

```bash
# Atualizar develop
git checkout develop
git pull origin develop

# Criar nova branch de feature
git checkout -b feature/nome-da-funcionalidade

# Desenvolver e commitar
git add .
git commit -m "feat: descrição da funcionalidade"

# Push da branch
git push origin feature/nome-da-funcionalidade

# Criar Pull Request para develop
```

### **2. Correção de Bug (Hotfix):**

```bash
# Atualizar main
git checkout main
git pull origin main

# Criar branch de hotfix
git checkout -b hotfix/nome-do-fix

# Corrigir e commitar
git add .
git commit -m "fix: descrição da correção"

# Push da branch
git push origin hotfix/nome-do-fix

# Criar Pull Request para main E develop
```

### **3. Release:**

```bash
# Merge develop para main
git checkout main
git pull origin main
git merge develop
git push origin main

# Tag da versão
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

## 📝 Convenções de Commit

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- **`feat:`** - Nova funcionalidade
- **`fix:`** - Correção de bug
- **`docs:`** - Mudanças na documentação
- **`style:`** - Formatação, sem mudança de código
- **`refactor:`** - Refatoração de código
- **`test:`** - Adição ou correção de testes
- **`chore:`** - Tarefas de manutenção

### **Exemplos:**

```bash
feat: implementar componente de avaliação de anamnese
fix: corrigir cálculo de IMC em avaliações
docs: atualizar README com instruções de deploy
refactor: reorganizar estrutura de componentes
test: adicionar testes para serviço de usuários
```

## 🧪 Antes de Fazer Merge

### **Checklist:**

- [ ] Código testado localmente
- [ ] Build sem erros (`npm run build`)
- [ ] Lint sem erros (`npm run lint`)
- [ ] Testes passando (se houver)
- [ ] Documentação atualizada
- [ ] Pull Request revisado

### **Comandos de Verificação:**

```bash
# Frontend
cd apcpro-web
npm run build
npm run lint

# Backend
cd apcpro-api
npm run build
npm run lint
```

## 🎯 Nomenclatura de Branches

### **Features:**

- `feature/sistema-relatorios`
- `feature/notificacoes-push`
- `feature/dashboard-analytics`
- `feature/exportacao-dados`

### **Hotfixes:**

- `hotfix/auth-login-bug`
- `hotfix/calculo-imc-erro`
- `hotfix/performance-query`

### **Improvements:**

- `improvement/ui-responsiva`
- `improvement/performance-api`
- `improvement/ux-navigation`

## 🔧 Configuração do Projeto

### **Pré-requisitos:**

- Node.js 18+
- npm ou yarn
- PostgreSQL (para desenvolvimento local)
- Git configurado

### **Setup Inicial:**

```bash
# Clone do repositório
git clone https://github.com/alexsrs/apc-fit-pro.git
cd apc-fit-pro

# Frontend
cd apcpro-web
npm install

# Backend
cd ../apcpro-api
npm install

# Banco de dados
cd ../apcpro-bd
docker-compose up -d
```

## 📚 Recursos Úteis

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Prisma](https://www.prisma.io/docs)
- [Documentação Tailwind](https://tailwindcss.com/docs)
- [Documentação Shadcn/ui](https://ui.shadcn.com/)

---

**🤖 Desenvolvido pelo tifurico para o APC FIT PRO**

## 🎯 Roadmap e Próximos Passos

### **📋 Backlog de Funcionalidades**

#### **🔥 Alta Prioridade (Sprint Atual)**
- [ ] `feature/melhorias-ux-avaliacoes` - Aprimorar interface das avaliações
  - Melhorar responsividade dos componentes de avaliação
  - Adicionar loading states e feedback visual
  - Otimizar performance na renderização de dados
  
- [ ] `feature/validacao-dados-avaliacoes` - Validação robusta de dados
  - Implementar validação de entrada nos formulários
  - Adicionar tratamento de erros para dados inconsistentes
  - Criar sistema de backup automático de avaliações

#### **⚡ Média Prioridade (Próxima Sprint)**
- [ ] `feature/sistema-relatorios` - Dashboard de relatórios e analytics
  - Gráficos de evolução do aluno
  - Relatórios exportáveis em PDF
  - Comparativos de performance
  
- [ ] `feature/notificacoes-inteligentes` - Sistema de notificações
  - Alertas automáticos para reavaliações
  - Notificações push para professores
  - E-mails de lembrete para alunos

- [ ] `feature/exportacao-dados` - Exportação avançada
  - Export para Excel com múltiplas abas
  - Geração de PDF com gráficos
  - API para integração com sistemas externos

#### **🔮 Baixa Prioridade (Backlog)**
- [ ] `feature/dashboard-analytics` - Analytics avançado
  - Machine Learning para predições
  - Insights automáticos de performance
  - Dashboards personalizáveis

- [ ] `feature/mobile-app` - Aplicativo móvel
  - App React Native
  - Sincronização offline
  - Notificações push nativas

- [ ] `feature/integracao-wearables` - Integração com dispositivos
  - Sincronização com smartwatches
  - Import de dados de atividade física
  - API para dispositivos de bioimpedância

### **🛠️ Melhorias Técnicas**
- [ ] `improvement/performance-frontend` - Otimização do frontend
- [ ] `improvement/api-caching` - Sistema de cache no backend
- [ ] `improvement/testes-automatizados` - Cobertura de testes 80%+
- [ ] `improvement/ci-cd-pipeline` - Pipeline de deploy automático
- [ ] `improvement/docker-containers` - Containerização completa
- [ ] `improvement/documentacao-api` - Swagger/OpenAPI documentation

## 🎛️ Controle e Gestão com GitHub

### **📊 GitHub Issues**
Cada item do roadmap deve ter uma Issue correspondente:

```markdown
# Template de Issue para Feature:
---
title: "feat: [Nome da Funcionalidade]"
labels: ["enhancement", "feature", "sprint-atual"]
assignees: ["@username"]
milestone: "Sprint 5 - Melhorias UX"
---

## 📝 Descrição
Breve descrição da funcionalidade a ser implementada.

## 🎯 Objetivos
- [ ] Objetivo específico 1
- [ ] Objetivo específico 2
- [ ] Objetivo específico 3

## ✅ Critérios de Aceitação
- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3

## 🔧 Tarefas Técnicas
- [ ] Criar componentes
- [ ] Implementar lógica de negócio
- [ ] Adicionar testes
- [ ] Atualizar documentação

## 📱 Screenshots/Mockups
(Adicionar imagens se aplicável)

## 🔗 Issues Relacionadas
- Closes #123
- Related to #456
```

### **🏷️ Sistema de Labels**
Organize suas issues com labels consistentes:

**Por Tipo:**
- `feature` - Nova funcionalidade
- `bug` - Correção de bug  
- `enhancement` - Melhoria
- `documentation` - Documentação
- `refactor` - Refatoração

**Por Prioridade:**
- `priority-high` - Alta prioridade
- `priority-medium` - Média prioridade  
- `priority-low` - Baixa prioridade

**Por Área:**
- `frontend` - Frontend (apcpro-web)
- `backend` - Backend (apcpro-api)
- `database` - Banco de dados
- `devops` - Infraestrutura

**Por Status:**
- `ready-for-dev` - Pronto para desenvolvimento
- `in-progress` - Em desenvolvimento
- `review-needed` - Precisa de revisão
- `blocked` - Bloqueado

### **📅 Milestones (Sprints)**
Organize o trabalho em sprints de 2-3 semanas:

```
🎯 Sprint 5 - Melhorias UX (01/07 - 15/07)
├── feature/melhorias-ux-avaliacoes
├── feature/validacao-dados-avaliacoes
└── improvement/performance-frontend

🎯 Sprint 6 - Relatórios (16/07 - 30/07)  
├── feature/sistema-relatorios
├── feature/exportacao-dados
└── improvement/testes-automatizados

🎯 Sprint 7 - Notificações (01/08 - 15/08)
├── feature/notificacoes-inteligentes
├── feature/dashboard-analytics
└── improvement/ci-cd-pipeline
```

### **📋 GitHub Projects (Kanban)**
Configure um board Kanban com as colunas:

| 📥 Backlog | 🏗️ Ready | 👨‍💻 In Progress | 🔍 Review | ✅ Done |
|------------|----------|-------------------|-----------|---------|
| Issues futuras | Prontas para dev | Em desenvolvimento | Em revisão | Concluídas |

### **🔄 Fluxo de Trabalho Completo**

1. **📝 Planejamento:**
   ```bash
   # Criar issue no GitHub
   # Adicionar ao milestone da sprint
   # Assinalar responsável
   # Mover para "Ready" no Projects
   ```

2. **🚀 Desenvolvimento:**
   ```bash
   # Criar branch a partir da issue
   git checkout develop
   git pull origin develop
   git checkout -b feature/sistema-relatorios
   
   # Mover issue para "In Progress"
   # Fazer commits seguindo convenções
   git commit -m "feat: implementar dashboard básico de relatórios
   
   Refs #123"
   ```

3. **🔍 Revisão:**
   ```bash
   # Push e criar Pull Request
   git push origin feature/sistema-relatorios
   
   # PR deve referenciar a issue: "Closes #123"
   # Mover issue para "Review"
   # Solicitar code review
   ```

4. **✅ Finalização:**
   ```bash
   # Após aprovação, merge para develop
   # Issue automaticamente fechada
   # Mover para "Done" no Projects
   # Deploy automático (se configurado)
   ```

### **📊 Comandos Git para Issues**
Use palavras-chave nos commits para controlar issues:

```bash
# Fechar issue automaticamente
git commit -m "feat: adicionar gráficos de evolução

Closes #123"

# Referenciar issue sem fechar
git commit -m "feat: implementar base do sistema de relatórios

Refs #123"

# Corrigir issue
git commit -m "fix: resolver problema de cálculo de IMC

Fixes #456"
```

### **🎯 Exemplo Prático - Issue #123**

**Issue:** `feat: Sistema de Relatórios de Progresso`

**Branch:** `feature/sistema-relatorios`

**Commits:**
```bash
git commit -m "feat: criar estrutura básica do módulo de relatórios

Refs #123"

git commit -m "feat: implementar gráfico de evolução de peso

Refs #123"

git commit -m "feat: adicionar exportação para PDF

Refs #123"

git commit -m "feat: finalizar sistema de relatórios com testes

Closes #123"
```

**Pull Request:** 
```markdown
## 🎯 Sistema de Relatórios de Progresso

Closes #123

### ✅ Implementado:
- Dashboard com gráficos de evolução
- Exportação para PDF
- Filtros por período
- Testes unitários

### 📱 Screenshots:
[Adicionar imagens]

### 🧪 Como testar:
1. Acessar dashboard de professor
2. Clicar em "Relatórios"
3. Selecionar aluno e período
4. Testar exportação PDF
```

## 🤖 Automação e Integração Contínua

### **🚀 GitHub Actions (Configuração Sugerida)**

Crie os arquivos em `.github/workflows/`:

**`.github/workflows/ci.yml`** - CI/CD Pipeline:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd apcpro-web && npm ci
      - name: Run tests
        run: cd apcpro-web && npm test
      - name: Run lint
        run: cd apcpro-web && npm run lint
      - name: Build
        run: cd apcpro-web && npm run build

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd apcpro-api && npm ci
      - name: Run tests
        run: cd apcpro-api && npm test
      - name: Run lint
        run: cd apcpro-api && npm run lint
      - name: Build
        run: cd apcpro-api && npm run build
```

### **📋 Templates de Issues**

Crie em `.github/ISSUE_TEMPLATE/`:

**`feature_request.md`:**
```markdown
---
name: 🚀 Feature Request
about: Suggest a new feature
title: 'feat: [TÍTULO DA FUNCIONALIDADE]'
labels: ['enhancement', 'feature']
assignees: ''
---

## 📝 Descrição
Uma descrição clara e concisa da funcionalidade desejada.

## 🎯 Problema que resolve
Qual problema esta funcionalidade resolve?

## 💡 Solução proposta
Descreva a solução que você gostaria de ver implementada.

## 🔄 Alternativas consideradas
Descreva alternativas que você considerou.

## 📱 Screenshots/Mockups
Adicione screenshots ou mockups se aplicável.

## ✅ Critérios de Aceitação
- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3
```

**`bug_report.md`:**
```markdown
---
name: 🐛 Bug Report
about: Report a bug
title: 'fix: [TÍTULO DO BUG]'
labels: ['bug']
assignees: ''
---

## 🐛 Descrição do Bug
Uma descrição clara e concisa do bug.

## 🔄 Para Reproduzir
Passos para reproduzir o comportamento:
1. Vá para '...'
2. Clique em '....'
3. Role até '....'
4. Veja o erro

## ✅ Comportamento Esperado
Uma descrição clara do que você esperava que acontecesse.

## 📱 Screenshots
Adicione screenshots para ajudar a explicar o problema.

## 💻 Ambiente
- OS: [ex: Windows 10]
- Browser: [ex: Chrome 91]
- Versão: [ex: 1.0.0]

## 📋 Informações Adicionais
Adicione qualquer outra informação sobre o problema aqui.
```

### **🔗 Integração com Ferramentas Externas**

**Slack/Discord Integration:**
```yaml
# .github/workflows/notify.yml
name: Notify Team
on:
  pull_request:
    types: [opened, closed]
  issues:
    types: [opened, closed]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### **📊 Métricas e Relatórios**

Configure no GitHub Insights:
- **Code frequency** - Commits por semana
- **Punch card** - Atividade por horário
- **Contributors** - Contribuições por desenvolvedor
- **Traffic** - Visualizações do repositório

### **🎯 Comandos Úteis para Gestão**

```bash
# Listar issues abertas
gh issue list --state open

# Criar issue via CLI
gh issue create --title "feat: nova funcionalidade" --body "Descrição"

# Listar PRs pendentes
gh pr list --state open

# Criar PR via CLI  
gh pr create --title "feat: sistema de relatórios" --body "Implementa dashboard"

# Ver status dos checks
gh pr checks

# Mergear PR após aprovação
gh pr merge --squash
```

## 📈 Métricas de Sucesso

### **KPIs do Projeto:**
- **Velocity:** Pontos entregues por sprint
- **Lead Time:** Tempo da issue ao deploy
- **Cycle Time:** Tempo de desenvolvimento
- **Code Coverage:** Cobertura de testes
- **Bug Rate:** Bugs por funcionalidade
- **Customer Satisfaction:** Feedback dos usuários

### **Ferramentas de Monitoramento:**
- GitHub Insights para métricas de código
- SonarQube para qualidade de código
- Sentry para monitoramento de erros
- Google Analytics para métricas de uso

---

**🎯 Próximo Passo:** Criar as primeiras issues seguindo este guia!
