# 🔄 Guia dos Componentes de Loading

Este guia explica c### 4. LoadingSkeleton
Para simular conteúdo enquanto carrega com múltiplas variações.

```tsx
import { LoadingSkeleton } from '@/components/ui/Loading';

// Skeleton básico (texto)
<LoadingSkeleton lines={3} />

// Skeleton para cards com imagem
<LoadingSkeleton variant="card" lines={3} showImage />

// Skeleton para listas com avatares
<LoadingSkeleton variant="list" lines={4} showAvatar />

// Skeleton para tabelas
<LoadingSkeleton variant="table" lines={5} />

// Skeleton para perfis
<LoadingSkeleton variant="profile" lines={4} />

// Skeleton customizado
<LoadingSkeleton 
  variant="list" 
  lines={3} 
  showAvatar 
  className="p-4 border rounded-lg" 
/>
```novos componentes de loading padronizados na aplicação APC FIT PRO.

## 📦 Componentes Disponíveis

### 1. Loading (Principal)
Componente principal com múltiplas opções de customização.

```tsx
import Loading from '@/components/ui/Loading';

// Uso básico
<Loading />

// Com texto
<Loading text="Carregando dados..." />

// Diferentes tamanhos
<Loading size="sm" />   // Pequeno
<Loading size="md" />   // Médio (padrão)
<Loading size="lg" />   // Grande
<Loading size="xl" />   // Extra grande

// Diferentes cores
<Loading color="blue" />    // Azul (padrão)
<Loading color="green" />   // Verde
<Loading color="red" />     // Vermelho
<Loading color="gray" />    // Cinza
<Loading color="yellow" />  // Amarelo
<Loading color="purple" />  // Roxo

// Modo tela cheia
<Loading mode="fullscreen" text="Inicializando aplicação..." />
```

### 2. LoadingInline
Para uso inline dentro de textos ou componentes pequenos.

```tsx
import { LoadingInline } from '@/components/ui/Loading';

<span className="flex items-center gap-2">
  Processando <LoadingInline size="sm" />
</span>
```

### 3. LoadingButton
Para botões com estado de carregamento.

```tsx
import { LoadingButton } from '@/components/ui/Loading';

// Em botões
<Button disabled={loading}>
  {loading ? <LoadingButton text="Salvando..." /> : "Salvar"}
</Button>
```

### 4. LoadingSkeleton
Para simular conteúdo enquanto carrega.

```tsx
import { LoadingSkeleton } from '@/components/ui/Loading';

{loading ? (
  <LoadingSkeleton lines={3} />
) : (
  <div>Conteúdo carregado</div>
)}
```

## 🎯 Casos de Uso Comuns

### Cards com Loading
```tsx
if (loading) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Título do Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Loading text="Carregando dados..." />
      </CardContent>
    </Card>
  );
}
```

### Páginas Completas
```tsx
if (loading) {
  return <Loading mode="fullscreen" text="Carregando dashboard..." />;
}
```

### Formulários
```tsx
<Button type="submit" disabled={submitting}>
  {submitting ? (
    <LoadingButton text="Salvando..." size="sm" />
  ) : (
    "Salvar"
  )}
</Button>
```

### Listas com Skeleton
```tsx
{loading ? (
  <LoadingSkeleton variant="list" lines={5} showAvatar />
) : (
  <div>Lista de usuários</div>
)}
```

### Cards com Skeleton
```tsx
{loading ? (
  <Card>
    <LoadingSkeleton variant="card" lines={3} showImage />
  </Card>
) : (
  <Card>Conteúdo do card</Card>
)}
```

### Tabelas com Skeleton
```tsx
{loading ? (
  <LoadingSkeleton variant="table" lines={10} />
) : (
  <Table>...</Table>
)}
```

### Perfis com Skeleton
```tsx
{loading ? (
  <LoadingSkeleton variant="profile" lines={5} />
) : (
  <div>Dados do perfil</div>
)}
```

### Dashboard com Múltiplos Skeletons
```tsx
{loading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i}>
        <LoadingSkeleton variant="card" lines={2} showImage />
      </Card>
    ))}
  </div>
) : (
  <div>Dashboard content</div>
)}
```

### Estados Inline
```tsx
<div className="flex items-center gap-2">
  <span>Sincronizando</span>
  <LoadingInline color="green" />
</div>
```

## 🔄 Migração do Loading Antigo

### Antes:
```tsx
// Loading antigo com progress bar
<Loading />

// Spinner customizado
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
```

### Depois:
```tsx
// Novo loading padronizado
<Loading text="Carregando..." />

// Spinner inline
<LoadingInline />
```

## 🎨 Customização

### Classes CSS Personalizadas
```tsx
<Loading 
  className="my-custom-spacing" 
  text="Processando dados complexos..."
  size="lg"
  color="purple"
/>
```

### Cores Personalizadas
Se precisar de cores específicas, você pode usar classes CSS:

```tsx
<div className="[&_.loading-spinner]:border-orange-500">
  <Loading />
</div>
```

## 📋 Checklist de Substituição

Use este checklist para substituir os loadings antigos:

- [ ] `dashboard-layout.tsx` - Loading da autenticação
- [ ] `DobrasCutaneas.tsx` - Estados de carregamento
- [ ] `ModalAvaliacaoCompleta.tsx` - Loading de dados
- [ ] `tabs-profile.tsx` - Loading de professores
- [ ] `team-switcher.tsx` - Loading de grupos
- [ ] Todos os componentes com `useState(false)` para loading
- [ ] Todos os spinners customizados inline

## 🚀 Benefícios

1. **Consistência**: Mesmo visual em toda aplicação
2. **Flexibilidade**: Múltiplos tamanhos e cores
3. **Acessibilidade**: Textos descritivos
4. **Performance**: Componentes leves
5. **Manutenibilidade**: Um lugar para mudanças globais

## 💡 Dicas

1. Sempre use texto descritivo quando possível
2. Escolha o tamanho apropriado para o contexto
3. Use `LoadingSkeleton` para melhor UX em listas
4. Prefira `LoadingInline` para indicadores pequenos
5. Use cores semânticas (verde=sucesso, vermelho=erro)
