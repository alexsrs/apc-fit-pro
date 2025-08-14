# 🔧 FIX: Bug de Status das Avaliações - Professor vs Aluno

## 🎯 Problema Identificado

**Bug reportado:** Avaliações criadas por professores apareciam como **"pendentes"** mesmo tendo sido concluídas pelo próprio professor, quando deveriam ser automaticamente **"aprovadas"**.

### **Regras de Negócio Corretas:**
- ✅ **Professor cria avaliação** → Status: `aprovada` (válida imediatamente)
- ✅ **Aluno cria avaliação** → Status: `pendente` (precisa validação do professor)

## 🔍 Causa Raiz do Bug

### **Problema 1: Backend não sabia quem estava criando**
```typescript
// ANTES: users-service.ts
status: validadeAte ? 'aprovada' : (dados.status || 'pendente')
// ❌ Só aprovava se tivesse validade específica
```

### **Problema 2: Frontend fazia dupla validação**
```typescript
// ANTES: ModalAvaliacaoCompleta.tsx  
// 1. Salvava como 'pendente' no backend
// 2. Depois fazia chamada para aprovar manualmente
if (profile?.role === "professor") {
  await aprovarUltimaAvaliacao('triagem'); // ❌ Gambiarra
}
```

## ✅ Soluções Implementadas

### **1. Backend - users-controller.ts**
```typescript
// ✅ DEPOIS: Passa informações do usuário logado
export async function cadastrarAvaliacaoAluno(req, res, next) {
  const userPerfilId = req.params.userPerfilId;
  const dados = req.body;
  
  // Buscar informações do usuário logado para determinar se é professor
  const usuarioLogado = req.user; // ✅ Vem do middleware de auth
  
  const avaliacao = await usersService.cadastrarAvaliacaoAluno(
    userPerfilId,
    dados,
    usuarioLogado // ✅ Passa contexto do usuário
  );
}
```

### **2. Backend - users-service.ts**
```typescript
// ✅ DEPOIS: Verifica se quem cria é professor
async cadastrarAvaliacaoAluno(userPerfilId: string, dados: any, usuarioLogado?: any) {
  // Verificar se quem está criando é um professor
  let isProfessor = false;
  if (usuarioLogado?.id) {
    const perfilUsuarioLogado = await this.userRepository.getUserProfileByUserId(usuarioLogado.id);
    isProfessor = perfilUsuarioLogado?.role === 'professor';
  }

  // Determinar status da avaliação baseado em quem está criando
  let statusAvaliacao = 'pendente'; // Padrão para alunos
  
  if (isProfessor) {
    // ✅ Se é professor criando, a avaliação já é válida automaticamente
    statusAvaliacao = 'aprovada';
  } else if (validadeAte) {
    // Se especificou validade (era lógica antiga), aprova automaticamente
    statusAvaliacao = 'aprovada';
  } else if (dados.status) {
    // Usa status explícito se fornecido
    statusAvaliacao = dados.status;
  }

  const avaliacaoParaSalvar = {
    ...dados,
    resultado,
    objetivoClassificado,
    validadeAte,
    status: statusAvaliacao // ✅ Status correto baseado no criador
  };
}
```

### **3. Frontend - ModalAvaliacaoCompleta.tsx**
```typescript
// ✅ DEPOIS: Remove aprovação manual duplicada
const handleTriagemSuccess = async () => {
  setModalTriagemOpen(false);
  
  // Backend agora já salva avaliações de professores como 'aprovada' automaticamente
  
  buscarAvaliacoesExistentes(); // Recarrega dados
  proximaEtapa(); // Avança automaticamente
};

// ❌ REMOVIDO: aprovarUltimaAvaliacao() 
// Função não é mais necessária - backend já salva com status correto
```

## 🎯 Fluxo Corrigido

### **Professor cria avaliação:**
1. **Frontend:** Professor preenche formulário
2. **Backend:** `req.user` identifica que é professor  
3. **Backend:** Salva avaliação com `status: 'aprovada'`
4. **Frontend:** Avaliação aparece como válida imediatamente ✅

### **Aluno cria avaliação:**
1. **Frontend:** Aluno preenche formulário
2. **Backend:** `req.user` identifica que é aluno
3. **Backend:** Salva avaliação com `status: 'pendente'`
4. **Frontend:** Avaliação fica pendente de aprovação do professor ✅
5. **Professor:** Pode aprovar/reprovar posteriormente

## 📊 Impacto da Correção

### **✅ Benefícios:**
- **Eliminação do bug** de status incorreto
- **Simplificação do código** - remove dupla validação
- **Lógica clara** - backend determina status baseado no criador
- **Melhoria na UX** - professores veem resultados imediatos

### **🔄 Compatibilidade:**
- **Mantém funcionalidade existente** para alunos
- **Não quebra aprovações manuais** existentes  
- **Preserva sistema de validade** customizada

## 🧪 Como Testar

### **Teste 1: Professor cria avaliação**
1. Login como professor
2. Abrir avaliação de um aluno
3. Preencher triagem/anamnese/medidas
4. **Esperado:** Status aparece como "aprovada" imediatamente

### **Teste 2: Aluno cria avaliação** 
1. Login como aluno
2. Preencher avaliação própria
3. **Esperado:** Status aparece como "pendente"
4. Professor deve conseguir aprovar/reprovar

---

## 📋 Arquivos Modificados

### **Backend:**
- `src/controllers/users-controller.ts` ✅
- `src/services/users-service.ts` ✅

### **Frontend:**
- `src/components/ModalAvaliacaoCompleta.tsx` ✅

### **Repositório:**
- Usa método existente `getUserProfileByUserId()` ✅

---

**🎯 Status:** ✅ **Bug corrigido**  
**📅 Data:** 09/08/2025  
**🔧 Impacto:** Melhoria na experiência de professores e lógica de negócio mais clara
