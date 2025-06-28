# 🔐 Configuração de Credenciais Azure para GitHub Actions

## 📋 Problema Identificado

```
Error: No credentials found. Add an Azure login action before this action.
```

**Causa:** O GitHub Actions não tem credenciais para acessar o Azure e fazer o deploy.

---

## ✅ Solução: Configurar Service Principal no Azure

### **Passo 1: Criar Service Principal no Azure**

Execute estes comandos no Azure CLI (terminal local ou Azure Cloud Shell):

```bash
# 1. Login no Azure
az login

# 2. Definir variáveis
SUBSCRIPTION_ID=$(az account show --query id --output tsv)
RESOURCE_GROUP="apcpro-rg"  # Ajuste se necessário
APP_NAME="apcpro-github-actions"

# 3. Criar Service Principal
az ad sp create-for-rbac \
  --name "$APP_NAME" \
  --role contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP \
  --sdk-auth

# 4. Copiar o JSON retornado (será usado no próximo passo)
```

### **Passo 2: Output Esperado**

O comando acima retornará um JSON similar a este:

```json
{
  "clientId": "12345678-1234-1234-1234-123456789012",
  "clientSecret": "abcdefgh-1234-5678-9012-abcdefghijkl",
  "subscriptionId": "87654321-4321-4321-4321-210987654321",
  "tenantId": "11111111-2222-3333-4444-555555555555",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

**⚠️ IMPORTANTE:** Copie TODO este JSON - será usado como secret no GitHub.

---

## 🔧 Configurar Secret no GitHub

### **Passo 3: Adicionar Secret no GitHub**

1. **Acesse:** https://github.com/alexsrs/apc-fit-pro/settings/secrets/actions

2. **Clique em:** "New repository secret"

3. **Configurar:**
   - **Name:** `AZURE_CREDENTIALS`
   - **Value:** Cole TODO o JSON do Passo 2

4. **Salvar:** Clique em "Add secret"

---

## 🚀 Testar o Deploy

### **Passo 4: Fazer um Commit para Triggerar Deploy**

```bash
# No seu terminal:
cd d:\apc-fit-pro

# Fazer uma pequena mudança
echo "# Deploy test $(date)" >> TESTE-DEPLOY.md

# Commit e push
git add .
git commit -m "fix: configurar credenciais Azure para GitHub Actions

- Atualizar workflow para usar azure/login@v1
- Adicionar Azure Login step antes do deploy
- Usar AZURE_CREDENTIALS secret para autenticação"

git push origin main
```

### **Passo 5: Acompanhar Deploy**

1. **GitHub Actions:** https://github.com/alexsrs/apc-fit-pro/actions
2. **Aguardar:** Deploy automático executar
3. **Verificar:** Logs do pipeline

---

## 🔍 Verificação Pós-Deploy

### **Teste da API:**
```bash
# Health check:
curl https://apcpro-api.azurewebsites.net/health

# Resposta esperada:
{
  "status": "ok",
  "service": "apcpro-api",
  "environment": "production"
}
```

---

## ❌ Troubleshooting

### **Se o Service Principal falhar:**

```bash
# Verificar permissões:
az role assignment list --assignee <CLIENT_ID>

# Adicionar permissões se necessário:
az role assignment create \
  --assignee <CLIENT_ID> \
  --role "Website Contributor" \
  --scope /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>
```

### **Se o secret não funcionar:**

1. **Verificar** se o JSON está completo
2. **Recriar** o Service Principal
3. **Atualizar** o secret no GitHub

---

## 🔒 IMPORTANTE: Configuração Segura das Credenciais

### ⚠️ CREDENCIAIS FORAM CRIADAS COM SUCESSO!

O Service Principal foi criado e você deve ter visto o JSON retornado no terminal anterior.

**🚨 SEGURANÇA CRÍTICA:**
- **NUNCA** commite credenciais no repositório
- **NUNCA** compartilhe o client secret
- **SEMPRE** use GitHub Secrets para armazenar credenciais

### 📋 Próximos Passos SEGUROS

#### 1. Copiar Credenciais do Terminal
Copie o JSON completo que foi exibido no terminal quando criamos o Service Principal.

#### 2. Configurar Secret no GitHub
1. Acesse: https://github.com/alexsrs/apc-fit-pro/settings/secrets/actions
2. Clique em "New repository secret"
3. Nome: `AZURE_CREDENTIALS`
4. Valor: **Cole o JSON completo do terminal**

#### 3. Verificar Proteção do .gitignore
✅ Arquivos de credenciais estão protegidos no `.gitignore`

#### 4. Testar Deploy Seguro
```powershell
# Sem arquivos de credenciais!
git add .
git commit -m "docs: finalizar configuração deploy Azure (sem credenciais)"
git push origin main
```

## 🛡️ Boas Práticas de Segurança

- ✅ Credenciais removidas do filesystem local
- ✅ .gitignore protegendo arquivos sensíveis
- ✅ Credenciais apenas no GitHub Secrets
- ✅ Service Principal com permissões mínimas

## 🔧 Monitoramento

Após configurar o secret:
1. GitHub Actions: https://github.com/alexsrs/apc-fit-pro/actions
2. API Health: https://apcpro-api.azurewebsites.net/health
3. Logs do Azure: Portal Azure → App Services → Logs

---

## 📋 Checklist Final

- [ ] Service Principal criado no Azure
- [ ] JSON copiado corretamente
- [ ] Secret `AZURE_CREDENTIALS` adicionado no GitHub
- [ ] Workflow atualizado com `azure/login@v1`
- [ ] Commit feito para triggerar deploy
- [ ] Pipeline executando sem erros
- [ ] API respondendo em produção

---

**🚀 Após seguir estes passos, o deploy automático deve funcionar perfeitamente!**
