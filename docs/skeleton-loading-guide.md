# 💀 Guia Completo do LoadingSkeleton

## 🎯 Variações Implementadas

O componente `LoadingSkeleton` agora oferece 5 variações principais para diferentes contextos:

### 1. **Default** - Texto simples
```tsx
<LoadingSkeleton lines={3} />
```
- Para simulação de parágrafos de texto
- Larguras variáveis para naturalidade
- Uso: Artigos, descrições, conteúdo textual

### 2. **Card** - Cards com imagem
```tsx
<LoadingSkeleton variant="card" lines={3} showImage />
```
- Simula um card completo
- Opcional: imagem no topo
- Título mais prominente + conteúdo
- Uso: Cards de produtos, posts, notícias

### 3. **List** - Listas com avatares
```tsx
<LoadingSkeleton variant="list" lines={4} showAvatar />
```
- Simula listas de usuários/contatos
- Avatar circular + duas linhas de texto
- Uso: Listas de usuários, comentários, mensagens

### 4. **Table** - Estrutura tabular
```tsx
<LoadingSkeleton variant="table" lines={10} />
```
- Simula linhas de tabela
- 4 colunas com larguras diferentes
- Uso: Tabelas de dados, relatórios

### 5. **Profile** - Perfil de usuário
```tsx
<LoadingSkeleton variant="profile" lines={5} />
```
- Avatar grande + nome + informações
- Seção de detalhes adicional
- Uso: Páginas de perfil, detalhes de usuário

## 🎨 Exemplos Práticos

### Dashboard com Múltiplos Skeletons
```tsx
// Loading do dashboard completo
{loading ? (
  <div className="space-y-6">
    {/* Cards de métricas */}
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <LoadingSkeleton variant="card" lines={2} />
        </Card>
      ))}
    </div>
    
    {/* Lista de usuários */}
    <Card>
      <CardContent>
        <LoadingSkeleton variant="list" lines={6} showAvatar />
      </CardContent>
    </Card>
    
    {/* Tabela de dados */}
    <Card>
      <CardContent>
        <LoadingSkeleton variant="table" lines={8} />
      </CardContent>
    </Card>
  </div>
) : (
  <DashboardContent />
)}
```

### Lista de Alunos
```tsx
{loadingAlunos ? (
  <LoadingSkeleton variant="list" lines={5} showAvatar />
) : (
  alunos.map(aluno => (
    <div key={aluno.id} className="flex items-center gap-3">
      <Avatar>{aluno.nome[0]}</Avatar>
      <div>
        <p>{aluno.nome}</p>
        <p className="text-sm text-muted-foreground">{aluno.email}</p>
      </div>
    </div>
  ))
)}
```

### Cards de Avaliações
```tsx
{loadingAvaliacoes ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <LoadingSkeleton key={i} variant="card" lines={3} showImage />
    ))}
  </div>
) : (
  avaliacoes.map(avaliacao => (
    <AvaliacaoCard key={avaliacao.id} avaliacao={avaliacao} />
  ))
)}
```

### Perfil de Usuário
```tsx
{loadingPerfil ? (
  <LoadingSkeleton variant="profile" lines={6} />
) : (
  <div className="flex items-center gap-4">
    <Avatar className="h-16 w-16">
      <AvatarImage src={user.avatar} />
    </Avatar>
    <div>
      <h2 className="text-xl font-bold">{user.nome}</h2>
      <p className="text-muted-foreground">{user.email}</p>
      <p className="text-sm">{user.bio}</p>
    </div>
  </div>
)}
```

### Tabela de Dados
```tsx
{loadingTabela ? (
  <LoadingSkeleton variant="table" lines={15} />
) : (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Nome</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Ações</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {dados.map(item => (
        <TableRow key={item.id}>
          <TableCell>{item.nome}</TableCell>
          <TableCell>{item.email}</TableCell>
          <TableCell>{item.status}</TableCell>
          <TableCell>Ações</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)}
```

## 🔧 Customização Avançada

### Skeleton com Estilo Personalizado
```tsx
<LoadingSkeleton 
  variant="card" 
  lines={4} 
  showImage 
  className="border border-dashed border-gray-300 rounded-lg p-4" 
/>
```

### Skeleton com Diferentes Velocidades
```tsx
<div className="[&_.animate-pulse]:animate-[pulse_1s_ease-in-out_infinite]">
  <LoadingSkeleton variant="list" lines={3} showAvatar />
</div>
```

### Skeleton com Cores Temáticas
```tsx
<div className="[&_.bg-muted]:bg-blue-100">
  <LoadingSkeleton variant="profile" lines={4} />
</div>
```

## 📱 Responsividade

Todos os skeletons são responsivos:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {loading ? (
    Array.from({ length: 6 }).map((_, i) => (
      <LoadingSkeleton 
        key={i} 
        variant="card" 
        lines={3} 
        showImage 
        className="w-full" 
      />
    ))
  ) : (
    content.map(item => <ItemCard key={item.id} item={item} />)
  )}
</div>
```

## 🎯 Melhores Práticas

1. **Escolha a variação certa**: Use a variação que mais se aproxima do conteúdo final
2. **Número de linhas**: Use a mesma quantidade de linhas que o conteúdo real
3. **Consistência**: Mantenha o skeleton visível por pelo menos 300ms
4. **Feedback visual**: Combine com textos descritivos quando apropriado
5. **Performance**: Use skeletons para operações que demoram mais de 200ms

## 🔄 Integração com API

```tsx
const [loading, setLoading] = useState(true);
const [dados, setDados] = useState([]);

useEffect(() => {
  const carregarDados = async () => {
    setLoading(true);
    try {
      const response = await api.get('/dados');
      setDados(response.data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  carregarDados();
}, []);

return (
  <div>
    {loading ? (
      <LoadingSkeleton variant="list" lines={10} showAvatar />
    ) : (
      <ListaComponente dados={dados} />
    )}
  </div>
);
```

---

**✨ Resultado**: Uma experiência de usuário fluida e consistente com skeletons que realmente representam o conteúdo que será carregado!
