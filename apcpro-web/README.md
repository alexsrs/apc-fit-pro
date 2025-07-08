# APC FIT PRO - Frontend

Este é o frontend do **APC FIT PRO**, uma plataforma completa para avaliação, prescrição e controle de treinos físicos baseada no método APC (Avaliação, Prescrição e Controle).

O frontend foi desenvolvido com [Next.js](https://nextjs.org) e utiliza as mais modernas tecnologias para proporcionar uma experiência de usuário excepcional.

## 🚀 Tecnologias Utilizadas

- **[Next.js 15](https://nextjs.org)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org)** - Tipagem estática para melhor manutenção
- **[Tailwind CSS](https://tailwindcss.com)** - Framework CSS utilitário
- **[Shadcn/ui](https://ui.shadcn.com)** - Componentes UI modernos e acessíveis
- **[NextAuth.js](https://next-auth.js.org)** - Autenticação completa (Google OAuth + credenciais)
- **[Vercel AI SDK](https://sdk.vercel.ai)** - Integração com IA (OpenAI GPT-4)
- **[Lucide React](https://lucide.dev)** - Ícones modernos e consistentes

## 🎯 Funcionalidades Principais

### 🔐 **Sistema de Autenticação**
- Login via Google OAuth e email/senha
- Recuperação de senha por email
- Cadastro diferenciado para Personal Trainers e Alunos
- Proteção de rotas com middleware

### 📊 **Sistema de Avaliações Físicas**
- **Triagem Inteligente APC**: Classificação automática de objetivos
- **Anamnese Estratégica**: Entrevista aprofundada baseada no objetivo
- **Medidas Corporais**: Coleta completa com cálculos automáticos (IMC, %GC, RCQ, CA)
- **Histórico de Evolução**: Comparações automáticas entre avaliações

### 👥 **Gestão de Usuários**
- Dashboard diferenciado para Personal e Aluno
- Perfis completos com upload de foto
- Sistema de convites para novos alunos
- Gerenciamento de dados pessoais

### 📋 **Interface Moderna**
- Design responsivo e acessível
- Modais padronizados com `ModalPadrao`
- Componentes reutilizáveis
- Feedback visual consistente

## 🏗️ Estrutura do Projeto

```
apcpro-web/
├── app/                          # Páginas e rotas (App Router)
│   ├── (auth)/                   # Grupo de rotas de autenticação
│   │   ├── login/               # Página de login
│   │   └── register/            # Página de cadastro
│   ├── dashboard/               # Dashboard principal
│   │   ├── professores/         # Dashboard do Personal Trainer
│   │   └── alunos/             # Dashboard do Aluno
│   ├── convite/                # Página de aceite de convite
│   ├── setup-profile/          # Configuração inicial do perfil
│   ├── api/                    # API Routes do Next.js
│   ├── globals.css             # Estilos globais
│   ├── layout.tsx              # Layout principal
│   └── page.tsx                # Página inicial
│
├── components/                  # Componentes reutilizáveis
│   ├── ui/                     # Componentes base (Shadcn)
│   │   ├── ModalPadrao.tsx     # Modal padrão unificado
│   │   ├── button.tsx          # Botões customizados
│   │   ├── form.tsx            # Componentes de formulário
│   │   ├── card.tsx            # Cards padronizados
│   │   └── ...                 # Outros componentes UI
│   ├── ModalDetalhesAluno.tsx  # Modal de detalhes do aluno
│   ├── ConviteAlunoModal.tsx   # Modal de convite
│   ├── ModalAnamnese.tsx       # Modal de anamnese
│   ├── ModalTriagem.tsx        # Modal de triagem
│   ├── ModalMedidasCorporais.tsx # Modal de medidas corporais
│   ├── ListaAvaliacoes.tsx     # Lista de avaliações
│   ├── ResultadoAvaliacao.tsx  # Exibição de resultados
│   └── ...                     # Outros componentes específicos
│
├── contexts/                   # Contextos React
│   └── AuthContext.tsx         # Contexto de autenticação
│
├── hooks/                      # Custom Hooks
│   ├── useProximaAvaliacao.ts  # Hook para próxima avaliação
│   ├── useEvolucaoFisica.ts    # Hook para evolução física
│   └── ...                     # Outros hooks
│
├── lib/                        # Utilitários e configurações
│   ├── utils.ts                # Funções utilitárias
│   ├── auth.ts                 # Configuração NextAuth
│   └── api-client.ts           # Cliente HTTP para API
│
├── services/                   # Serviços de comunicação com API
│   ├── user-service.ts         # Serviços de usuário
│   ├── ca-service.ts           # Serviços de CA
│   └── ...                     # Outros serviços
│
├── utils/                      # Funções auxiliares
│   ├── normalizar-genero.ts    # Normalização de gênero
│   └── ...                     # Outras utilidades
│
├── public/                     # Arquivos estáticos
│   └── images/                 # Imagens e assets
│
├── prisma/                     # Schema do banco (sincronizado)
│   └── schema.prisma           # Definições do banco
│
├── components.json             # Configuração Shadcn
├── next.config.ts              # Configuração Next.js
├── tailwind.config.js          # Configuração Tailwind
├── tsconfig.json               # Configuração TypeScript
└── package.json                # Dependências e scripts
```

## 🛠️ Comandos Principais

### Desenvolvimento
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Executar em modo desenvolvimento com debug
npm run dev:debug
```

### Build e Deploy
```bash
# Gerar build de produção
npm run build

# Executar build local
npm run start

# Analisar bundle
npm run analyze
```

### Banco de Dados (Prisma)
```bash
# Gerar cliente Prisma
npm run db:generate

# Executar migrações
npm run db:migrate

# Visualizar dados (Prisma Studio)
npm run db:studio

# Reset do banco (apenas desenvolvimento)
npm run db:reset
```

### Qualidade de Código
```bash
# Verificar tipos TypeScript
npm run type-check

# Executar linting
npm run lint

# Formatar código
npm run format
```

## 🎨 Padrões de Desenvolvimento

### Estrutura de Componentes
```tsx
// Exemplo de componente padronizado
import React from "react";
import { ModalPadrao } from "@/components/ui/ModalPadrao";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MeuComponenteProps = {
  open: boolean;
  onClose: () => void;
  dados: MinhaInterface;
};

export function MeuComponente({ open, onClose, dados }: MeuComponenteProps) {
  return (
    <ModalPadrao
      open={open}
      onClose={onClose}
      title="Título do Modal"
      description="Descrição clara do propósito"
      maxWidth="xl"
    >
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconeRelevante className="h-5 w-5 text-blue-600" />
            Seção Principal
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Conteúdo do componente */}
        </CardContent>
      </Card>
    </ModalPadrao>
  );
}
```

### Nomenclatura
- **Componentes**: PascalCase (`ModalDetalhesAluno`)
- **Arquivos**: kebab-case (`modal-detalhes-aluno.tsx`)
- **Variáveis/Funções**: camelCase (`calcularIdade`)
- **Constantes**: SNAKE_CASE (`MAX_UPLOAD_SIZE`)

### Estilização
- Use Tailwind CSS como padrão
- Mantenha consistência com a paleta de cores
- Prefira componentes Shadcn/ui
- Implemente responsividade mobile-first

## 🔧 Configurações Importantes

### Variáveis de Ambiente
Crie um arquivo `.env.local` com as seguintes variáveis:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta_aqui

# Google OAuth
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret

# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# OpenAI (para IA)
OPENAI_API_KEY=sua_chave_openai

# Banco de Dados
DATABASE_URL=postgresql://usuario:senha@localhost:5432/apcfitpro
```

### Configuração do Banco
O frontend utiliza Prisma como ORM para comunicação com PostgreSQL:

```bash
# Primeira configuração
npx prisma generate
npx prisma db push
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outros Provedores
- Configure build command: `npm run build`
- Output directory: `.next`
- Node.js version: 18+

## 📚 Recursos Adicionais

### Documentação das Tecnologias

- **[Next.js Documentation](https://nextjs.org/docs)** - Recursos e API do Next.js
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Documentação do framework CSS
- **[Shadcn/ui](https://ui.shadcn.com)** - Componentes UI e exemplos
- **[NextAuth.js](https://next-auth.js.org)** - Autenticação para Next.js
- **[Prisma](https://www.prisma.io/docs)** - ORM moderno para TypeScript

### Links Úteis
- **[Repositório GitHub](https://github.com/seu-usuario/apc-fit-pro)** - Código fonte
- **[Issues & Features](https://github.com/seu-usuario/apc-fit-pro/issues)** - Reportar bugs e sugerir melhorias
- **[Vercel Dashboard](https://vercel.com/dashboard)** - Gerenciar deploys

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Convenções de Commit
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação/estilo
- `refactor:` - Refatoração de código
- `test:` - Adição de testes
- `chore:` - Tarefas de manutenção

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

Desenvolvido com ❤️ pela equipe APC FIT PRO.

---

**APC FIT PRO** - Transformando a avaliação física através da tecnologia.
