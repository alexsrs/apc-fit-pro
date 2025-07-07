# 📊 Guia de Skeletons para Dashboard

## Visão Geral

Os skeletons são essenciais para melhorar a experiência do usuário em dashboards, proporcionando feedback visual imediato durante o carregamento de dados. Este guia detalha como aplicar skeletons específicos para cada seção do dashboard.

## 🎯 Implementação no Dashboard de Professores

### 1. Cards de Métricas (KPIs)

```tsx
{/* Cards de métricas com skeleton loading */}
<div className="grid gap-4 md:grid-cols-4 mt-2">
  {loadingMetricas ? (
    <>
      <LoadingSkeleton variant="card" />
      <LoadingSkeleton variant="card" />
      <LoadingSkeleton variant="card" />
      <LoadingSkeleton variant="card" />
    </>
  ) : (
    // ... cards de métricas reais
  )}
</div>
```

**Por que usar:**
- Mantém o layout visível
- Indica que dados importantes estão carregando
- Melhora a percepção de performance

### 2. Seção de Alertas Inteligentes

```tsx
<CardContent>
  {loadingAlertas ? (
    <div className="space-y-3">
      <LoadingSkeleton variant="list" />
      <LoadingSkeleton variant="list" />
      <LoadingSkeleton variant="list" />
    </div>
  ) : (
    <AlertasPersistenteProfessor />
  )}
</CardContent>
```

**Por que usar:**
- Simula lista de alertas
- Espaçamento consistente
- Feedback visual para dados críticos

### 3. Lista de Alunos (Cards de Perfil)

```tsx
<TabsContent value="ativos">
  {loadingAlunos ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      <LoadingSkeleton variant="profile" showAvatar />
      <LoadingSkeleton variant="profile" showAvatar />
      <LoadingSkeleton variant="profile" showAvatar />
      <LoadingSkeleton variant="profile" showAvatar />
      <LoadingSkeleton variant="profile" showAvatar />
      <LoadingSkeleton variant="profile" showAvatar />
    </div>
  ) : (
    // ... grid real de alunos
  )}
</TabsContent>
```

**Por que usar:**
- Simula exatamente o layout dos cards de alunos
- Inclui placeholder para avatar
- Mantém grid responsivo

## 🚀 Estados de Loading Independentes

Uma das principais melhorias implementadas foi usar **estados de loading independentes** para cada seção:

```tsx
const [loadingMetricas, setLoadingMetricas] = useState(true);
const [loadingAlertas, setLoadingAlertas] = useState(true);
const [loadingAlunos, setLoadingAlunos] = useState(true);

// Simular carregamentos com diferentes velocidades
useEffect(() => {
  // Métricas (mais rápido - 800ms)
  setTimeout(() => setLoadingMetricas(false), 800);
  
  // Alertas (médio - 1200ms)
  setTimeout(() => setLoadingAlertas(false), 1200);
  
  // Alunos (pode ser mais lento devido ao volume de dados)
  Promise.all([
    apiClient.get(`/api/users/${profile.userId}/alunos`),
    apiClient.get(`/api/users/${profile.userId}/grupos`)
  ]).finally(() => setLoadingAlunos(false));
}, []);
```

### Vantagens dos Estados Independentes:

1. **Performance Percebida:** Dados rápidos aparecem primeiro
2. **UX Melhorada:** Usuário vê progresso gradual
3. **Feedback Específico:** Cada seção tem seu próprio estado
4. **Flexibilidade:** Pode ajustar timing por seção

## 📱 Responsividade dos Skeletons

Os skeletons mantêm a responsividade do layout original:

```tsx
{/* Grid responsivo para alunos */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
  <LoadingSkeleton variant="profile" showAvatar />
  {/* ... mais skeletons */}
</div>

{/* Grid responsivo para métricas */}
<div className="grid gap-4 md:grid-cols-4 mt-2">
  <LoadingSkeleton variant="card" />
  {/* ... mais skeletons */}
</div>
```

## 🎨 Variantes de Skeleton Disponíveis

### Para Dashboard:

| Variante | Uso Recomendado | Props Extras |
|----------|-----------------|--------------|
| `card` | Métricas, KPIs, Cards de estatísticas | - |
| `list` | Alertas, notificações, listas simples | `lines={3}` |
| `profile` | Cards de alunos, perfis | `showAvatar={true}` |

### Exemplos Específicos:

```tsx
{/* Métricas */}
<LoadingSkeleton variant="card" />

{/* Alertas/Notificações */}
<LoadingSkeleton variant="list" lines={3} />

{/* Perfis de Alunos */}
<LoadingSkeleton variant="profile" showAvatar />

{/* Tabelas (se necessário) */}
<LoadingSkeleton variant="table" lines={5} />
```

## 🔧 Implementação Prática

### Antes (Loading Simples):
```tsx
{loading ? <Loading /> : <ComponenteReal />}
```

### Depois (Skeleton Específico):
```tsx
{loading ? (
  <LoadingSkeleton variant="profile" showAvatar />
) : (
  <ComponenteReal />
)}
```

## 📊 Exemplo Completo

Criamos um exemplo interativo em `/dashboard/exemplo-skeletons` que mostra:

- Todos os skeletons aplicados
- Estados independentes
- Toggle para alternar entre loading e dados
- Documentação visual

## 🎯 Próximos Passos

1. **Aplicar em outros dashboards** (alunos, relatórios)
2. **Testar performance** em dispositivos móveis
3. **Adicionar animações** sutis (opcional)
4. **Documentar padrões** para novos componentes

## 💡 Dicas de UX

1. **Timing Realista:** Use tempos de loading próximos ao real
2. **Quantidade Apropriada:** Mostre quantidade similar de itens reais
3. **Consistência:** Use mesma variante para elementos similares
4. **Feedback Progressivo:** Carregue seções em ordem de importância

---

**Resultado:** Dashboard com experiência de loading profissional, responsiva e com feedback visual adequado para cada tipo de conteúdo! 🚀
