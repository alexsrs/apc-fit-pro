# 🧪 Teste do Deploy de Produção - APC FIT PRO

## 📊 Status Atual do Deploy

**Data/Hora:** 28 de junho de 2025, 15:25
**Commit:** Merge develop → main com todas as correções
**Pipeline:** Deploy automático triggerado

---

## 🔍 URLs para Teste

### **🎯 Produção (Main Branch):**
- **API Produção:** https://apcpro-api.azurewebsites.net
- **Health Check:** https://apcpro-api.azurewebsites.net/health  
- **Métricas:** https://apcpro-api.azurewebsites.net/metrics
- **Frontend:** https://apc-fit-pro.vercel.app

### **🚀 Desenvolvimento (Develop Branch):**
- **API Dev:** https://apcpro-api-dev.azurewebsites.net
- **Health Check:** https://apcpro-api-dev.azurewebsites.net/health

---

## ✅ Checklist de Testes

### **1. 🩺 Health Check da API:**
```bash
# Teste manual no navegador:
https://apcpro-api.azurewebsites.net/health

# Resposta esperada:
{
  "status": "ok",
  "timestamp": "2025-06-28T15:25:00.000Z",
  "uptime": 123.45,
  "service": "apcpro-api",
  "version": "1.0.0",
  "environment": "production"
}
```

### **2. 🔐 Teste de Endpoints Básicos:**
```bash
# Endpoints públicos que devem responder:
/health ✅
/

# Endpoints protegidos (devem retornar 401/403):
/users
/metrics
```

### **3. 🌐 Teste do Frontend:**
```bash
# Acessar e verificar:
https://apc-fit-pro.vercel.app

# Funcionalidades críticas:
✅ Login com Google
✅ Dashboard carrega
✅ Sidebar funciona
✅ Avaliações são exibidas
```

### **4. 🔗 Conectividade Frontend ↔ API:**
```bash
# Verificar se o frontend consegue:
✅ Fazer login (auth)
✅ Carregar dados do dashboard
✅ Comunicar com a API
✅ Exibir avaliações corretamente
```

---

## 🚨 Possíveis Problemas e Soluções

### **❌ API não responde:**
```bash
# Verificar logs no Azure:
1. Acessar portal.azure.com
2. Ir para App Services → apcpro-api
3. Logs → Log stream
4. Diagnostics and solve problems
```

### **❌ Erro 500/502:**
```bash
# Possíveis causas:
- Variáveis de ambiente incorretas
- Problema de conexão com banco
- Build falhou
- Dependencies não instaladas
```

### **❌ Frontend não conecta com API:**
```bash
# Verificar:
- CORS configurado corretamente
- URLs de API no frontend
- Autenticação NextAuth
- Environment variables
```

---

## 🔧 Comandos de Diagnóstico

### **📋 Verificar Status do Deploy:**
```bash
# GitHub Actions:
https://github.com/alexsrs/apc-fit-pro/actions

# Azure DevOps:
https://dev.azure.com/[projeto]/apc-fit-pro/_build
```

### **📊 Logs da API (Azure CLI):**
```bash
# Se tiver Azure CLI instalado:
az webapp log tail --name apcpro-api --resource-group apcpro-rg

# Logs de deployment:
az webapp log deployment list --name apcpro-api --resource-group apcpro-rg
```

### **🔄 Restart da Aplicação:**
```bash
# Se necessário, restart manual:
az webapp restart --name apcpro-api --resource-group apcpro-rg
```

---

## 📈 Métricas Esperadas

### **⚡ Performance:**
- **Tempo de resposta:** < 500ms
- **Uptime:** > 99%
- **Memory usage:** < 512MB
- **CPU usage:** < 80%

### **🔒 Segurança:**
- **HTTPS:** Ativo
- **CORS:** Configurado
- **Auth:** Funcionando
- **Env vars:** Protegidas

---

## 🎯 Próximos Passos Após Teste

### **✅ Se tudo funcionar:**
1. Marcar deploy como estável
2. Atualizar documentação
3. Notificar equipe
4. Monitorar por 24h

### **❌ Se houver problemas:**
1. Identificar causa raiz
2. Aplicar correção
3. Novo deploy
4. Re-testar

---

## 📞 Contatos para Suporte

- **Azure Portal:** portal.azure.com
- **GitHub Actions:** github.com/alexsrs/apc-fit-pro/actions
- **Vercel Dashboard:** vercel.com/dashboard

---

**🤖 Criado pelo tifurico para garantir deploy seguro e confiável!**
