# 🚀 Criando as Primeiras Issues - APC FIT PRO

Este guia mostra como criar as issues iniciais baseadas no roadmap definido.

## 📋 Issues Prioritárias

### 1. Sistema de Relatórios (Prioridade Alta)

```bash
gh issue create \
  --title "feat: Implementar dashboard de relatórios de progresso dos alunos" \
  --body "## 🎯 Objetivo
Criar um sistema completo de relatórios que permita aos professores acompanhar o progresso dos alunos através de gráficos e métricas.

## 📋 Critérios de Aceitação
- [ ] Como professor, posso visualizar gráficos de evolução das medidas corporais
- [ ] O sistema deve mostrar comparativos entre avaliações
- [ ] A interface precisa ser responsiva e intuitiva
- [ ] Posso exportar relatórios em formato PDF
- [ ] Os dados devem ser filtráveis por período e tipo de avaliação

## 🔧 Tarefas Técnicas
- [ ] Criar componente \`RelatoriosPage\`
- [ ] Implementar gráficos com Chart.js ou Recharts
- [ ] Criar API endpoints para dados de relatórios
- [ ] Implementar sistema de exportação PDF
- [ ] Adicionar filtros e seletores de período
- [ ] Criar testes unitários
- [ ] Atualizar documentação

## 📐 Estimativa
**Pontos de História:** 8
**Tempo Estimado:** 4-5 dias

## 🏷️ Dependências
- Nenhuma dependência crítica
- Pode ser desenvolvido em paralelo com outras features

## 📱 Mockups/Referências
- Dashboard deve seguir o design system atual
- Inspiração: Google Analytics, Tableau
- Cores: Manter paleta do APC FIT PRO" \
  --label "enhancement,priority:high,type:feature,area:frontend,size:l" \
  --milestone "Sprint 1 - Q1 2025"
```

### 2. Melhorias UX nas Avaliações

```bash
gh issue create \
  --title "feat: Otimizar UX dos componentes de avaliação" \
  --body "## 🎯 Objetivo
Melhorar a experiência do usuário nos componentes de avaliação já implementados, focando em performance e usabilidade.

## 📋 Critérios de Aceitação
- [ ] Como usuário, vejo loading states durante carregamento de dados
- [ ] A interface deve ser totalmente responsiva em mobile
- [ ] Os componentes devem carregar em menos de 2 segundos
- [ ] Animações suaves entre transições
- [ ] Feedback visual para ações do usuário

## 🔧 Tarefas Técnicas
- [ ] Adicionar Skeleton Loading nos componentes
- [ ] Otimizar queries do Prisma
- [ ] Implementar lazy loading para componentes pesados
- [ ] Melhorar CSS responsivo (mobile-first)
- [ ] Adicionar animações com Framer Motion
- [ ] Implementar error boundaries
- [ ] Adicionar testes de performance

## 📐 Estimativa
**Pontos de História:** 5
**Tempo Estimado:** 2-3 dias

## 🏷️ Dependências
- Depende dos componentes já implementados (AnamneseInfo, TriagemInfo, etc.)

## 🎨 Design References
- Material Design Loading States
- Chakra UI Skeleton
- Ant Design Spin" \
  --label "enhancement,priority:high,type:improvement,area:frontend,size:m" \
  --milestone "Sprint 1 - Q1 2025"
```

### 3. Sistema de Notificações

```bash
gh issue create \
  --title "feat: Implementar sistema de notificações inteligentes" \
  --body "## 🎯 Objetivo
Criar um sistema de notificações que alerte professores sobre reavaliações pendentes, novos alunos e outros eventos importantes.

## 📋 Critérios de Aceitação
- [ ] Como professor, recebo notificações de reavaliações pendentes
- [ ] O sistema me alerta sobre novos alunos cadastrados
- [ ] Posso configurar preferências de notificação
- [ ] Notificações aparecem em tempo real no dashboard
- [ ] Histórico de notificações acessível

## 🔧 Tarefas Técnicas
- [ ] Criar componente \`NotificationCenter\`
- [ ] Implementar WebSocket para notificações em tempo real
- [ ] Criar API para gerenciar notificações
- [ ] Implementar sistema de preferências
- [ ] Adicionar badges de notificação na sidebar
- [ ] Criar jobs automáticos para alertas
- [ ] Implementar persistência no banco

## 📐 Estimativa
**Pontos de História:** 13
**Tempo Estimado:** 5-6 dias

## 🏷️ Dependências
- Pode precisar de configuração adicional do WebSocket
- Depende da estrutura de usuários existente" \
  --label "enhancement,priority:medium,type:feature,area:fullstack,size:xl" \
  --milestone "Sprint 2 - Q2 2025"
```

## 🏷️ Criando Labels Necessárias

```bash
# Prioridades
gh label create "priority:critical" --color "d73a4a" --description "Correções urgentes"
gh label create "priority:high" --color "f85149" --description "Funcionalidades importantes"
gh label create "priority:medium" --color "fb8500" --description "Melhorias desejáveis"
gh label create "priority:low" --color "228b22" --description "Nice to have"

# Tipos
gh label create "type:feature" --color "0052cc" --description "Nova funcionalidade"
gh label create "type:improvement" --color "5319e7" --description "Melhoria existente"
gh label create "type:bug" --color "d73a4a" --description "Correção de bug"
gh label create "type:docs" --color "02d7ff" --description "Documentação"

# Áreas
gh label create "area:frontend" --color "c5def5" --description "Frontend (Next.js)"
gh label create "area:backend" --color "f6c6a0" --description "Backend (Node.js)"
gh label create "area:database" --color "d4c5f9" --description "Banco de dados"
gh label create "area:fullstack" --color "ffeb3b" --description "Frontend + Backend"

# Tamanhos
gh label create "size:xs" --color "e8f5e8" --description "1-2 horas"
gh label create "size:s" --color "d4f0d4" --description "3-8 horas"
gh label create "size:m" --color "a7d9a7" --description "1-2 dias"
gh label create "size:l" --color "7cc77c" --description "3-5 dias"
gh label create "size:xl" --color "4a934a" --description "1+ semana"
```

## 📊 Criando Milestone

```bash
gh api repos/alexsrs/apc-fit-pro/milestones \
  --method POST \
  --field title="Sprint 1 - Q1 2025" \
  --field description="Foco em relatórios e melhorias de UX" \
  --field due_on="2025-07-15T00:00:00Z"
```

## 🎯 Próximos Passos

1. **Execute os comandos acima** para criar as issues iniciais
2. **Configure o GitHub Project** para visualização Kanban
3. **Defina responsáveis** para cada issue
4. **Comece pela issue de maior prioridade**
5. **Crie a branch** seguindo a convenção: `feature/sistema-relatorios`

## 📝 Template Rápido para Novas Issues

```bash
# Template básico
gh issue create \
  --title "feat: [TÍTULO DA FUNCIONALIDADE]" \
  --body "$(cat issue-template.md)" \
  --label "enhancement,priority:medium,type:feature" \
  --assignee @me
```

---

**🚀 Agora você tem um roadmap estruturado e controlado via GitHub!**
