# 📝 CHANGELOG - APC FIT PRO

Todas as mudanças notáveis do projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.2.0] - 2025-07-06

### 🆕 Adicionado

#### Sistema de Avaliação Física Completa
- **ModalAvaliacaoAluno**: Novo modal específico para alunos com fluxo guiado multi-etapas
- **ModalAvaliacaoCompleta**: Modal avançado para professores criarem avaliações para alunos
- **AvaliacoesPendentes**: Componente para professores gerenciarem aprovações de avaliações
- **DobrasCutaneasModernas**: Interface moderna para coleta de dobras cutâneas
- **ModalPadrao**: Componente modal padronizado e reutilizável

#### Novos Protocolos de Dobras Cutâneas
- **Jackson & Pollock 3 dobras**: Para homens e mulheres
- **Jackson & Pollock 7 dobras**: Protocolo mais detalhado
- **Guedes**: Protocolo específico para população brasileira
- **Petroski**: Validado para brasileiros adultos
- **Faulkner**: Protocolo internacional amplamente usado

#### Sistema de Status e Aprovações
- **Controle de Status**: Pendente, Aprovada, Reprovada, Vencida
- **Gestão de Validade**: Professores podem definir prazo de validade (padrão 90 dias)
- **Verificação Automática**: Sistema detecta e marca avaliações vencidas
- **Badges Visuais**: Indicadores coloridos para cada status

#### Utilitários Centralizados
- **genero-converter.ts**: Utilitário para conversão consistente de gênero/sexo
- **idade.ts**: Funções para cálculo de idade e validação de datas
- **Protocolos de dobras**: Implementação completa de todos os cálculos

#### Backend APIs
- **Endpoints de dobras cutâneas**: APIs específicas para cada protocolo
- **Aprovação de avaliações**: Endpoints para aprovar/reprovar com validade
- **Documentação Swagger**: Atualizada com todos os novos endpoints

### 🔄 Modificado

#### Componentes Existentes
- **ListaAvaliacoes**: Atualizada para mostrar status, validade e badges
- **ResultadoAvaliacao**: Melhorada com exibição consistente de dados
- **Dashboard do Professor**: Integrado com novas funcionalidades
- **Dashboard do Aluno**: Abertura automática de modal quando necessário

#### Fluxos de Usuário
- **Triagem**: Integrada com seleção automática do tipo de avaliação
- **Anamnese**: Conectada ao fluxo completo de avaliação
- **Medidas Corporais**: Reorganizada com melhor UX

#### Backend Services
- **users-service**: Padronizado para usar conversor de gênero centralizado
- **avaliacao-service**: Adicionados métodos de aprovação e controle de validade
- **Validações**: Melhoradas em todos os endpoints

### 🐛 Corrigido

#### Warnings de Lint
- **ListTodo não utilizado**: Removido import desnecessário em `professores/page.tsx`
- **useEffect dependencies**: Corrigido em `AvaliacoesPendentes.tsx` com useCallback
- **Variáveis não utilizadas**: Removidas `idade` e `dataNascimento` de `ModalAvaliacaoCompleta.tsx`
- **Import não utilizado**: Removido `calcularIdadeOpcional` de `alunos/page.tsx`

#### Duplicação de Código
- **Conversões de gênero**: Unificadas em utilitário centralizado
- **Funções repetidas**: Eliminadas `sexoToNumber` e similares
- **Imports redundantes**: Limpeza geral de imports não utilizados

#### Bugs de Interface
- **Modal não fechando**: Corrigidos estados de abertura/fechamento
- **Dados duplicados**: Eliminada repetição de informações nos modais
- **Estados inconsistentes**: Sincronização entre componentes pai e filho

### 🗑️ Removido

#### Código Legacy
- **Funções duplicadas**: `sexoToNumber`, `converterSexoParaGenero` locais
- **Imports não utilizados**: Limpeza geral em todos os arquivos
- **Comentários obsoletos**: Remoção de TODOs antigos e comentários desnecessários

#### Componentes Descontinuados
- **Modais antigos**: Versões antigas substituídas pelos novos componentes
- **Utilitários obsoletos**: Funções substituídas pelos novos utilitários centralizados

### 🔒 Segurança

#### Validações Aprimoradas
- **Dados de entrada**: Validação rigorosa em todos os formulários
- **Sanitização**: Limpeza de dados antes do armazenamento
- **Autorizações**: Verificação de permissões para aprovação de avaliações

#### Auditoria
- **Logs de aprovação**: Registro de todas as ações de professores
- **Rastreabilidade**: Histórico completo de mudanças de status
- **Dados sensíveis**: Proteção adicional para informações médicas

### 📚 Documentação

#### Novos Documentos
- **FEATURE-AVALIACAO-FISICA-COMPLETA.md**: Documentação completa da feature
- **genero-converter-refactor.md**: Detalhes da refatoração de gênero
- **ModalPadrao-Guide.md**: Guia de uso do modal padronizado
- **PROXIMOS-PASSOS.md**: Roadmap detalhado do projeto

#### Atualizações
- **README.md**: Seção de funcionalidades completamente atualizada
- **API Documentation**: Swagger atualizado com novos endpoints
- **Component Documentation**: JSDoc adicionado em todos os componentes

---

## [1.1.5] - 2025-06-15

### 🔄 Modificado
- Correções menores de interface
- Otimizações de performance
- Atualizações de dependências

### 🐛 Corrigido
- Bugs menores de navegação
- Problemas de responsividade em dispositivos móveis

---

## [1.1.0] - 2025-05-20

### 🆕 Adicionado
- Sistema de alertas inteligentes
- Integração com CloudAMQP
- Dashboard específico para professores e alunos

### 🔄 Modificado
- Interface do sistema de convites
- Melhorias na sidebar de navegação

---

## [1.0.0] - 2025-04-25

### 🆕 Adicionado
- Versão inicial do APC FIT PRO
- Sistema de autenticação com NextAuth.js
- CRUD básico de usuários
- Sistema de triagem e anamnese
- Avaliação básica de medidas corporais
- Deploy inicial no Azure

### 🔒 Segurança
- Implementação de autenticação JWT
- Proteção de rotas sensíveis
- Validação de dados de entrada

---

## Notas de Versionamento

### Major (X.0.0)
- Mudanças que quebram compatibilidade
- Reestruturações arquiteturais significativas
- Mudanças na API que requerem atualizações obrigatórias

### Minor (0.X.0)
- Novas funcionalidades mantendo compatibilidade
- Melhorias significativas de interface
- Novos endpoints de API

### Patch (0.0.X)
- Correções de bugs
- Pequenas melhorias de performance
- Atualizações de documentação

---

**Mantenedores:** Equipe APC FIT PRO  
**Última Atualização:** 6 de julho de 2025
