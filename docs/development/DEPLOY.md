# 🚀 Guia de Deploy - APC FIT PRO

## 📋 Visão Geral dos Ambientes

### **🌐 Frontend (Vercel)**

- **Status**: ✅ Automático
- **Branch**: `main` → Produção | `develop` → Preview
- **URL Produção**: https://apc-fit-pro.vercel.app
- **Configuração**: Automática via GitHub integration

### **🗄️ Database (Manual)**

- **Status**: 🔄 Manual
- **Provider**: PostgreSQL
- **Ambiente**: Produção/Desenvolvimento separados
- **Migrations**: Manual via Prisma

### **⚙️ API (Azure App Service)**

- **Status**: 🚀 CI/CD Configurado
- **Produção**: `apcpro-api` (branch main)
- **Desenvolvimento**: `apcpro-api-dev` (branch develop)
- **Pipeline**: Azure DevOps + GitHub Actions

---

## 🔄 Fluxo de Deploy da API

### **1. Deploy Automático (Recomendado)**

#### **Via Azure DevOps Pipeline:**

```bash
# O pipeline é executado automaticamente em:
# - Push para main (produção)
# - Push para develop (desenvolvimento)
# - Pull requests (apenas build e teste)
```

#### **Via GitHub Actions:**

```bash
# Workflow executado em:
# - Push para main/develop
# - Pull requests para validação
```

### **2. Deploy Manual (Backup)**

#### **Preparar para deploy:**

```bash
cd apcpro-api

# Instalar dependências
npm ci

# Gerar cliente Prisma
npm run prisma:generate

# Build da aplicação
npm run build

# Testar localmente
npm start
```

#### **Deploy direto para Azure:**

```bash
# Usando Azure CLI
az webapp deployment source config-zip \
  --resource-group apcpro-rg \
  --name apcpro-api \
  --src ./dist.zip
```

---

## 🛠️ Configuração dos Ambientes

### **🔧 Variáveis de Ambiente Necessárias**

#### **Azure App Service - Produção:**

```bash
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://apc-fit-pro.vercel.app
JWT_SECRET=...
```

#### **Azure App Service - Desenvolvimento:**

```bash
NODE_ENV=development
PORT=8080
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://apc-fit-pro-dev.vercel.app
JWT_SECRET=...
```

### **🔐 Secrets no GitHub (para GitHub Actions):**

```bash
AZURE_WEBAPP_PUBLISH_PROFILE_PROD=<perfil_publicacao_prod>
AZURE_WEBAPP_PUBLISH_PROFILE_DEV=<perfil_publicacao_dev>
```

### **🔐 Secrets no Azure DevOps:**

```bash
azureSubscription=<service_connection_id>
```

---

## 📊 Monitoramento e Logs

### **🩺 Health Checks:**

- **Produção**: https://apcpro-api.azurewebsites.net/health
- **Desenvolvimento**: https://apcpro-api-dev.azurewebsites.net/health

### **📊 Métricas:**

- **Endpoint**: `/metrics` (requer autenticação)
- **Azure Monitor**: Integrado automaticamente
- **Application Insights**: Configurado no Azure

### **📋 Logs:**

```bash
# Visualizar logs no Azure
az webapp log tail --name apcpro-api --resource-group apcpro-rg

# Logs de deployment
az webapp log deployment list --name apcpro-api --resource-group apcpro-rg
```

---

## 🔄 Processo de Release

### **1. Desenvolvimento → Produção:**

```bash
# 1. Desenvolver em feature branch
git checkout -b feature/nova-funcionalidade
# ... desenvolvimento ...
git push origin feature/nova-funcionalidade

# 2. Pull Request para develop
# → Deploy automático para apcpro-api-dev

# 3. Testes em desenvolvimento
# → Validar funcionalidades

# 4. Pull Request develop → main
# → Deploy automático para apcpro-api (produção)

# 5. Tag de release automática
# → Criada pelo pipeline
```

### **2. Hotfix (Correção Urgente):**

```bash
# 1. Branch a partir de main
git checkout main
git pull origin main
git checkout -b hotfix/correcao-critica

# 2. Correção e commit
git add .
git commit -m "fix: correção crítica de segurança"
git push origin hotfix/correcao-critica

# 3. Pull Request direto para main
# → Deploy imediato para produção

# 4. Merge de volta para develop
# → Manter sincronização
```

---

## 🐳 Deploy com Docker (Opcional)

### **Build da imagem:**

```bash
cd apcpro-api

# Build da imagem
docker build -t apcpro-api:latest .

# Testar localmente
docker run -p 8080:8080 \
  -e DATABASE_URL="postgresql://..." \
  -e NODE_ENV="production" \
  apcpro-api:latest
```

### **Deploy para Azure Container Instances:**

```bash
# Push para Azure Container Registry
az acr build --registry apcpro --image apcpro-api:latest .

# Deploy para Container Instance
az container create \
  --resource-group apcpro-rg \
  --name apcpro-api-container \
  --image apcpro.azurecr.io/apcpro-api:latest \
  --dns-name-label apcpro-api \
  --ports 8080
```

---

## 🔍 Troubleshooting

### **❌ Deploy Falha:**

1. **Verificar logs do pipeline**
2. **Checar variáveis de ambiente**
3. **Validar build local**
4. **Verificar conexão com banco**

### **⚠️ Aplicação não responde:**

1. **Verificar health check**: `/health`
2. **Checar logs da aplicação**
3. **Validar variáveis de ambiente**
4. **Reiniciar App Service**

### **🐛 Problemas de Banco:**

1. **Verificar connection string**
2. **Validar migrations aplicadas**
3. **Checar permissões de usuário**
4. **Testar conexão manual**

---

## 📚 Recursos Úteis

- [Azure App Service Docs](https://docs.microsoft.com/azure/app-service/)
- [Azure DevOps Pipelines](https://docs.microsoft.com/azure/devops/pipelines/)
- [GitHub Actions Azure Deploy](https://github.com/Azure/webapps-deploy)
- [Prisma Deploy Docs](https://www.prisma.io/docs/guides/deployment)

---

**🤖 Configurado pelo tifurico para máxima automação e confiabilidade!**
