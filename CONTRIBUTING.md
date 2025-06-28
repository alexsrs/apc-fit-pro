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
