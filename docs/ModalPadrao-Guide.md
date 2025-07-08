# ModalPadrao - Componente de Modal Padronizado

O `ModalPadrao` é um componente reutilizável que padroniza todos os modais do sistema APC FIT PRO, garantindo consistência visual e de comportamento.

## Uso Básico

```tsx
import { ModalPadrao } from "@/components/ui/ModalPadrao";

function MeuModal({ open, onClose }) {
  return (
    <ModalPadrao
      open={open}
      onClose={onClose}
      title="Título do Modal"
      description="Descrição opcional do modal"
    >
      {/* Conteúdo do modal */}
      <div>Meu conteúdo aqui</div>
    </ModalPadrao>
  );
}
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `open` | `boolean` | - | **Obrigatório.** Controla se o modal está aberto |
| `onClose` | `() => void` | - | **Obrigatório.** Função chamada ao fechar o modal |
| `title` | `string` | - | **Obrigatório.** Título do modal |
| `description` | `string` | `undefined` | Descrição opcional do modal |
| `children` | `React.ReactNode` | - | **Obrigatório.** Conteúdo do modal |
| `maxWidth` | `"sm" \| "md" \| "lg" \| "xl" \| "2xl"` | `"lg"` | Largura máxima do modal |
| `className` | `string` | `undefined` | Classes CSS adicionais |
| `showScrollArea` | `boolean` | `true` | Se deve usar ScrollArea automaticamente |

## Tamanhos Disponíveis

- `sm`: 500px - Para modais pequenos e simples
- `md`: 600px - Para formulários médios
- `lg`: 700px - **Padrão** - Para a maioria dos modais
- `xl`: 800px - Para modais com muito conteúdo
- `2xl`: 900px - Para modais extra grandes

## Exemplos de Uso

### Modal Simples sem Scroll

```tsx
<ModalPadrao
  open={open}
  onClose={onClose}
  title="Confirmação"
  description="Tem certeza que deseja realizar esta ação?"
  maxWidth="sm"
  showScrollArea={false}
>
  <div className="flex gap-2">
    <Button variant="outline" onClick={onClose}>
      Cancelar
    </Button>
    <Button onClick={handleConfirm}>
      Confirmar
    </Button>
  </div>
</ModalPadrao>
```

### Modal com Formulário Longo

```tsx
<ModalPadrao
  open={open}
  onClose={onClose}
  title="Formulário de Avaliação"
  description="Preencha todos os campos obrigatórios"
  maxWidth="xl"
>
  <form className="space-y-6">
    {/* Campos do formulário */}
    <div className="space-y-4">
      <Input placeholder="Nome" />
      <Input placeholder="Email" />
      {/* ... mais campos */}
    </div>
    
    <Button type="submit" className="w-full">
      Salvar
    </Button>
  </form>
</ModalPadrao>
```

### Modal com Cards e Layout Complexo

```tsx
<ModalPadrao
  open={open}
  onClose={onClose}
  title="Detalhes do Aluno"
  description="Informações completas do aluno"
  maxWidth="xl"
>
  <Card>
    <CardHeader>
      <CardTitle>Informações Pessoais</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Conteúdo do card */}
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader>
      <CardTitle>Histórico</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Mais conteúdo */}
    </CardContent>
  </Card>
</ModalPadrao>
```

## Padrões de Design

### Estrutura Visual
- **Padding**: O modal já aplica padding consistente (8px nas laterais)
- **Scroll**: ScrollArea é aplicado automaticamente quando `showScrollArea={true}`
- **Título**: Sempre em texto grande e peso bold
- **Descrição**: Texto menor em cor mais suave

### Espaçamento
- O conteúdo interno já tem `space-y-6` aplicado automaticamente
- Use `space-y-4` para elementos relacionados dentro do conteúdo
- Use `gap-2` ou `gap-4` para botões lado a lado

### Cores e Tipografia
- Título: `text-xl font-bold text-gray-900`
- Descrição: `text-base text-gray-600`
- O modal usa as cores do sistema Tailwind de forma consistente

## Modais Atualizados

Os seguintes modais já foram padronizados:

✅ **ModalDetalhesAluno** - Modal para detalhes do aluno  
✅ **ConviteAlunoModal** - Modal para convite de alunos  
✅ **ModalAnamnese** - Modal de anamnese  
✅ **ModalTriagem** - Modal de triagem  
✅ **ListaAvaliacoes** - Modal de detalhes das avaliações  
✅ **ModalMedidasCorporais** - Modal de avaliação física completa  
✅ **ConviteAlunoPage** - Modal de cadastro de aluno via convite  

**Ainda usando Dialog diretamente:**
- `ImcClassificacaoModal` - Usa DialogTrigger (mantido propositalmente)
- `CaClassificacaoModal` - Usa DialogTrigger (mantido propositalmente)  

**Todos os principais modais do sistema agora estão padronizados!** 🎉

## Vantagens do ModalPadrao

1. **Consistência**: Todos os modais têm aparência e comportamento uniformes
2. **Manutenção**: Mudanças no design podem ser feitas em um local central
3. **Reutilização**: Reduz duplicação de código
4. **Acessibilidade**: Implementa práticas de acessibilidade consistentes
5. **Responsividade**: Funciona bem em diferentes tamanhos de tela

## Migração de Modais Antigos

Para migrar um modal existente:

1. Substitua os imports:
```tsx
// Antes
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// Depois
import { ModalPadrao } from "@/components/ui/ModalPadrao";
```

2. Substitua a estrutura JSX:
```tsx
// Antes
<Dialog open={open} onOpenChange={onClose}>
  <DialogContent className="max-w-[800px] w-full p-0">
    <div className="relative flex flex-col">
      <ScrollArea className="px-8 pb-2" style={{ maxHeight: "85vh" }}>
        <DialogHeader className="pt-6 mb-6">
          <DialogTitle>Meu Título</DialogTitle>
          <DialogDescription>Minha descrição</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* conteúdo */}
        </div>
      </ScrollArea>
    </div>
  </DialogContent>
</Dialog>

// Depois
<ModalPadrao
  open={open}
  onClose={onClose}
  title="Meu Título"
  description="Minha descrição"
  maxWidth="xl"
>
  {/* conteúdo */}
</ModalPadrao>
```

3. Ajuste o tamanho se necessário usando a prop `maxWidth`
4. Use `showScrollArea={false}` se o modal for muito simples
