# 🚀 APC FIT PRO - Próximos Passos e Roadmap

## 📋 Resumo Executivo

O APC FIT PRO possui uma base sólida implementada com **autenticação completa**, **sistema de avaliações físicas avançado**, **dashboards funcionais** e **alertas inteligentes**. Este documento detalha o roadmap estratégico para expandir as funcionalidades e consolidar a plataforma como referência no mercado fitness.

---

## 🎯 Objetivos Estratégicos

### **🚨 URGENTE - 15 de Julho (10 dias)**
- ✅ **Avaliações Presenciais com Dobras Cutâneas** - Para atletas de vôlei
- ✅ **Protocolos Faulkner, Pollock e Guedes** - 3, 4 e 7 pontos
- ✅ **Interface de Avaliação Presencial** - Professor registra dados do aluno
- ✅ **Cálculos Automáticos** - Implementação das fórmulas científicas

### **Curto Prazo (1-3 meses)**
- Completar **Relatórios em PDF** das avaliações
- Adicionar **Testes Físicos e Funcionais**
- Implementar **Biblioteca de Exercícios**

### **Médio Prazo (3-6 meses)**
- Desenvolver **Sistema de Pagamentos**
- Implementar **Controle de Treinos Realizados**
- Adicionar **Inteligência Artificial** para recomendações

### **Longo Prazo (6-12 meses)**
- Lançar **Aplicativo Mobile**
- Implementar **Análise Avançada de Dados**
- Expandir para **Múltiplas Academias**

---

## 🛠️ Roadmap Detalhado por Módulos

### � **MÓDULO PRIORITÁRIO: Avaliações Presenciais com Dobras Cutâneas** *(URGENTE - 15 de Julho)*
> **Prazo:** 10 dias | **Complexidade:** Alta | **Status:** EM DESENVOLVIMENTO

#### 🎯 **Objetivo Específico:**
Permitir que professores realizem avaliações presenciais completas em atletas de vôlei, incluindo medidas de dobras cutâneas com protocolos científicos validados.

#### 📋 **Funcionalidades a Implementar:**

##### **1. Protocolos de Dobras Cutâneas**
- ✅ **Protocolo Faulkner (3 pontos):** Tríceps, Subescapular, Supra-ilíaca
- ✅ **Protocolo Pollock (4 pontos):** Tríceps, Subescapular, Supra-ilíaca, Abdominal
- ✅ **Protocolo Guedes (7 pontos):** Tríceps, Subescapular, Supra-ilíaca, Abdominal, Coxa, Peito, Axilar Média
- ✅ **Cálculos Automáticos:** Percentual de gordura, densidade corporal, massa magra

##### **2. Interface de Avaliação Presencial**
- 📱 **Modal de Dobras Cutâneas:** Interface otimizada para entrada rápida de dados
- 🔄 **Seleção de Protocolo:** Professor escolhe entre Faulkner, Pollock ou Guedes
- 📊 **Resultados Instantâneos:** Cálculos automáticos em tempo real
- 📋 **Validação de Dados:** Campos obrigatórios e ranges válidos
- 💾 **Integração Completa:** Salva junto com avaliação antropométrica existente

##### **3. Fórmulas Científicas (Referência Fineshape/Literatura)**
```typescript
// Exemplo das fórmulas a implementar:
// Faulkner: % Gordura = 0.153 * (soma 3 dobras) + 5.783
// Pollock (Homens): Densidade = 1.112 - 0.00043499 * (soma 4 dobras) + ...
// Guedes: Baseado em equações específicas por sexo e idade
```

#### 🗂️ **Arquivos a Criar/Modificar (Cronograma):**

##### **Semana 1 (8-12 Julho) - Backend + Cálculos**
```
apcpro-api/src/
├── controllers/dobras-cutaneas-controller.ts        # NOVO
├── services/dobras-cutaneas-service.ts              # NOVO
├── utils/protocolos-dobras/                         # NOVO
│   ├── faulkner.ts                                  # Fórmulas Faulkner
│   ├── pollock.ts                                   # Fórmulas Pollock  
│   └── guedes.ts                                    # Fórmulas Guedes
├── models/dobras-cutaneas-model.ts                  # NOVO
└── repositories/avaliacoes-repository.ts            # MODIFICAR

prisma/schema.prisma                                 # MODIFICAR (nova tabela)
```

##### **Semana 2 (12-15 Julho) - Frontend + Integração**
```
apcpro-web/src/
├── components/ModalDobrasCutaneas.tsx               # NOVO
├── components/SeletorProtocolo.tsx                  # NOVO
├── components/ResultadoDobrasCutaneas.tsx           # NOVO
├── utils/dobras-cutaneas-formulas.ts                # NOVO (client-side)
└── components/ModalMedidasCorporais.tsx             # MODIFICAR (integrar)
```

#### ✅ **Critérios de Aceite (15 de Julho):**
- [ ] Professor pode selecionar protocolo (Faulkner, Pollock, Guedes)
- [ ] Interface permite entrada rápida das medidas de dobras
- [ ] Cálculos são realizados automaticamente e salvos
- [ ] Resultados são exibidos junto com outras medidas antropométricas
- [ ] Sistema valida ranges de medidas (3-50mm típico)
- [ ] Integração funciona com fluxo de avaliação existente
- [ ] Dados são persistidos no banco PostgreSQL
- [ ] **TESTE REAL:** Funciona em avaliação de atletas de vôlei

#### 🔧 **Schema do Banco (Extensão da tabela existente):**
```sql
-- Adicionar à tabela Avaliacao existente:
ALTER TABLE "Avaliacao" ADD COLUMN "protocoloDobras" TEXT;
ALTER TABLE "Avaliacao" ADD COLUMN "dobrasCutaneas" JSONB;

-- Estrutura JSON das dobras:
{
  "protocolo": "faulkner|pollock|guedes",
  "medidas": {
    "triceps": 12.5,
    "subescapular": 15.0,
    "suprailiaca": 18.2,
    "abdominal": 22.1,     // Pollock/Guedes
    "coxa": 25.0,          // Guedes
    "peito": 8.5,          // Guedes
    "axilarMedia": 12.0    // Guedes
  },
  "resultados": {
    "somaTotal": 85.3,
    "percentualGordura": 14.2,
    "densidadeCorporal": 1.065,
    "massaGorda": 10.8,
    "massaMagra": 65.2
  }
}
```

---

### �📊 **MÓDULO 1: Testes Físicos e Funcionais** *(Prioridade: ALTA)*
> **Prazo:** 3-4 semanas | **Complexidade:** Média

#### Funcionalidades a Implementar:
- **Biblioteca de Testes:** Catálogo com 15+ testes físicos padronizados
- **Protocolos Automáticos:** Flexibilidade de braço, 1RM, VO2 máx., agilidade
- **Registro de Resultados:** Interface para inserção e histórico de testes
- **Análise Comparativa:** Evolução dos testes ao longo do tempo
- **Classificações Normativas:** Tabelas por idade, sexo e modalidade

#### Arquivos a Criar/Modificar:
```
apcpro-api/src/
├── controllers/testes-controller.ts
├── services/testes-service.ts
├── repositories/testes-repository.ts
└── models/teste-model.ts

apcpro-web/src/
├── components/ModalTestesFisicos.tsx
├── components/BibliotecaTestes.tsx
└── app/dashboard/testes/page.tsx

prisma/schema.prisma (adicionar tabelas)
```

#### Critérios de Aceite:
- [ ] Professor pode cadastrar resultados de testes para alunos
- [ ] Sistema calcula classificações automaticamente
- [ ] Histórico de testes é exibido graficamente
- [ ] Integração com o fluxo de avaliação existente

---

### 🏋️ **MÓDULO 2: Prescrição de Treinos** *(Prioridade: MÉDIA)*
> **Prazo:** 4-6 semanas | **Complexidade:** Alta | **Status:** ADIADO para após dobras cutâneas

#### Funcionalidades a Implementar:
- **Biblioteca de Exercícios:** 200+ exercícios com imagens e instruções
- **Montagem de Treinos:** Interface drag-and-drop para criar treinos
- **Periodização:** Mesociclos, microciclos e progressões automáticas
- **Templates:** Modelos pré-definidos por objetivo e nível
- **Prescrição Individualizada:** Baseada em avaliações e testes

#### Arquivos a Criar/Modificar:
```
apcpro-api/src/
├── controllers/exercicios-controller.ts
├── controllers/treinos-controller.ts
├── services/prescricao-service.ts
├── repositories/exercicios-repository.ts
└── utils/periodizacao-helper.ts

apcpro-web/src/
├── components/BibliotecaExercicios.tsx
├── components/EditorTreino.tsx
├── components/Periodizacao.tsx
└── app/dashboard/treinos/page.tsx
```

#### Critérios de Aceite:
- [ ] Professor pode criar treinos personalizados
- [ ] Sistema sugere exercícios baseado na avaliação
- [ ] Aluno visualiza treino atual no dashboard
- [ ] Progressões são calculadas automaticamente

---

### 📄 **MÓDULO 3: Relatórios em PDF** *(Prioridade: ALTA)*
> **Prazo:** 2-3 semanas | **Complexidade:** Baixa | **Status:** PRIORIZADO após dobras cutâneas

#### Funcionalidades a Implementar:
- **Relatório de Avaliação:** PDF completo com todos os resultados
- **Prescrição de Treino:** Planilha formatada para impressão
- **Evolução do Aluno:** Gráficos e métricas comparativas
- **Templates Personalizáveis:** Marca da academia/professor

#### Arquivos a Criar/Modificar:
```
apcpro-api/src/
├── services/pdf-service.ts
├── utils/pdf-templates/
│   ├── avaliacao-template.html
│   └── treino-template.html
└── controllers/relatorios-controller.ts

Dependências: puppeteer, handlebars
```

#### Critérios de Aceite:
- [ ] Geração de PDF da avaliação completa
- [ ] Download de treino formatado
- [ ] Relatório de evolução com gráficos
- [ ] Templates personalizáveis

---

### 📱 **MÓDULO 4: Controle de Treinos** *(Prioridade: MÉDIA)*
> **Prazo:** 3-4 semanas | **Complexidade:** Média

#### Funcionalidades a Implementar:
- **Registro de Treino:** Interface para marcar exercícios realizados
- **Controle de Carga:** Peso, repetições e séries executadas
- **Feedback do Aluno:** Avaliação subjetiva do treino (RPE)
- **Análise de Aderência:** Percentual de treinos realizados
- **Ajustes Automáticos:** Sugestões baseadas no desempenho

#### Arquivos a Criar/Modificar:
```
apcpro-api/src/
├── controllers/treino-realizado-controller.ts
├── services/controle-treino-service.ts
└── models/treino-realizado-model.ts

apcpro-web/src/
├── components/RegistroTreino.tsx
├── components/AnaliseAderencia.tsx
└── app/dashboard/meu-treino/page.tsx
```

#### Critérios de Aceite:
- [ ] Aluno pode registrar treinos realizados
- [ ] Professor visualiza aderência dos alunos
- [ ] Sistema calcula volume e intensidade
- [ ] Feedback influencia próximas prescrições

---

### 💳 **MÓDULO 5: Sistema de Pagamentos** *(Prioridade: MÉDIA)*
> **Prazo:** 4-5 semanas | **Complexidade:** Alta

#### Funcionalidades a Implementar:
- **Planos de Assinatura:** Freemium, Premium, Academias
- **Integração Stripe:** Pagamentos recorrentes e seguros
- **Gestão de Assinaturas:** Upgrade, downgrade, cancelamento
- **Controle de Acesso:** Limitações por plano
- **Dashboard Financeiro:** Receitas e métricas para professores

#### Arquivos a Criar/Modificar:
```
apcpro-api/src/
├── controllers/pagamentos-controller.ts
├── services/stripe-service.ts
├── middlewares/plano-middleware.ts
└── models/assinatura-model.ts

apcpro-web/src/
├── components/PlanosPagamento.tsx
├── components/CheckoutStripe.tsx
└── app/billing/page.tsx
```

#### Critérios de Aceite:
- [ ] Cobrança automática de assinaturas
- [ ] Controle de funcionalidades por plano
- [ ] Dashboard de receitas para professores
- [ ] Webhooks para sincronização de status

---

### 🤖 **MÓDULO 6: Inteligência Artificial** *(Prioridade: BAIXA)*
> **Prazo:** 6-8 semanas | **Complexidade:** Muito Alta

#### Funcionalidades a Implementar:
- **IA para Prescrição:** Algoritmos para sugestão de treinos
- **Análise Preditiva:** Previsão de resultados e riscos
- **Chatbot Inteligente:** Assistente virtual para dúvidas
- **Reconhecimento de Padrões:** Identificação de tendências

#### Arquivos a Criar/Modificar:
```
apcpro-api/src/
├── services/ia-service.ts
├── utils/machine-learning/
├── controllers/chatbot-controller.ts
└── models/predicao-model.ts

Integrações: OpenAI GPT-4, TensorFlow.js
```

---

## 🏗️ Implementação Técnica

### **Arquitetura Recomendada**

#### 1. **Microserviços Especializados**
```
apc-fit-pro/
├── apcpro-api/          # Core API (mantém atual)
├── apcpro-treinos/      # Microserviço de treinos
├── apcpro-pagamentos/   # Microserviço de billing
└── apcpro-ia/           # Microserviço de IA
```

#### 2. **Banco de Dados**
- **Manter PostgreSQL** para dados transacionais
- **Adicionar Redis** para cache e sessões
- **Considerar MongoDB** para logs e analytics

#### 3. **Infraestrutura**
- **Azure Container Apps** para microserviços
- **Azure Blob Storage** para arquivos (PDFs, imagens)
- **Azure AI Services** para funcionalidades de IA

### **Performance e Escalabilidade**

#### 1. **Otimizações Prioritárias**
- [ ] Implementar cache Redis para consultas frequentes
- [ ] Lazy loading em componentes pesados
- [ ] Paginação nas listas de avaliações/alunos
- [ ] Compressão de imagens e assets

#### 2. **Monitoramento**
- [ ] Application Insights do Azure
- [ ] Logs estruturados com winston
- [ ] Health checks para todos os serviços
- [ ] Métricas de performance em tempo real

---

## 📊 Métricas de Sucesso

### **KPIs Técnicos**
- **Performance:** Tempo de resposta < 200ms
- **Disponibilidade:** 99.9% uptime
- **Cobertura de Testes:** > 80%
- **Bugs em Produção:** < 5 por sprint

### **KPIs de Negócio**
- **Usuários Ativos:** 1000+ professores em 6 meses
- **Avaliações:** 10.000+ avaliações realizadas
- **Receita:** R$ 50.000 MRR em 12 meses
- **Retenção:** 85% após 3 meses

---

## 🚧 Riscos e Mitigações

### **Riscos Técnicos**
| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Escalabilidade do banco | Média | Alto | Implementar read replicas |
| Integração de pagamentos | Baixa | Alto | Testes extensivos com Stripe |
| Performance da IA | Alta | Médio | Usar APIs externas (OpenAI) |

### **Riscos de Negócio**
| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Concorrência | Alta | Alto | Acelerar desenvolvimento |
| Adoção lenta | Média | Alto | Marketing e parcerias |
| Regulamentação | Baixa | Médio | Consultoria jurídica |

---

## 💰 Estimativa de Custos

### **Desenvolvimento (6 meses)**
- **Desenvolvedor Full-Stack:** R$ 120.000 (6 meses)
- **Designer UI/UX:** R$ 30.000 (2 meses)
- **DevOps/Infraestrutura:** R$ 20.000

### **Infraestrutura Mensal**
- **Azure Hosting:** R$ 2.000/mês
- **CloudAMQP:** R$ 200/mês
- **APIs Externas:** R$ 500/mês
- **Monitoramento:** R$ 300/mês

### **Total Estimado:** R$ 170.000 + R$ 3.000/mês

---

## 🎯 Cronograma Executivo ATUALIZADO

### **🚨 SPRINT EMERGENCIAL (8-15 Julho) - Dobras Cutâneas para Vôlei**
- [ ] **Dia 8-9 (Segunda-Terça):** Schema do banco + modelos TypeScript
- [ ] **Dia 10-11 (Quarta-Quinta):** Implementação das fórmulas (Faulkner, Pollock, Guedes)
- [ ] **Dia 12 (Sexta):** Controller e service do backend
- [ ] **Fim de semana:** Testes das fórmulas e validação
- [ ] **Dia 14 (Segunda):** Interface frontend + integração
- [ ] **Dia 15 (Terça):** TESTE REAL com atletas de vôlei

### **Sprint 1-2 (16-29 Julho) - Relatórios PDF**
- [ ] Semana 1: Templates PDF para avaliações com dobras cutâneas
- [ ] Semana 2: Personalização e testes

### **Sprint 3-4 (30 Julho-12 Agosto) - Testes Físicos**
- [ ] Semana 1-2: Desenvolvimento do backend
- [ ] Semana 3-4: Interface e integração

### **Sprint 5-7 (13 Agosto-2 Setembro) - Prescrição de Treinos**
- [ ] Semana 1-2: Biblioteca de exercícios
- [ ] Semana 3-4: Editor de treinos
- [ ] Semana 5-6: Periodização e templates

### **Sprint 8-10 (3-23 Setembro) - Controle de Treinos**
- [ ] Semana 1-3: Registro e feedback
- [ ] Semana 4-6: Análises e ajustes

### **Sprint 11-15 (24 Setembro-2 Dezembro) - Pagamentos e IA**
- [ ] Semana 1-5: Sistema de pagamentos
- [ ] Semana 6-10: Funcionalidades de IA

---

## 🚀 Próximas Ações Imediatas

### **🚨 HOJE (8 de Julho)**
1. [ ] **URGENTE: Extensão do Schema Prisma** - Adicionar campos para dobras cutâneas
2. [ ] **Pesquisa das Fórmulas Exatas** - Validar fórmulas de Faulkner, Pollock e Guedes
3. [ ] **Criar Branch Específica** - `feature/dobras-cutaneas-volei`
4. [ ] **Setup do Ambiente** - Preparar ambiente de desenvolvimento

### **Amanhã (9 de Julho)**
1. [ ] **Implementar Fórmulas** - Criar utils com cálculos científicos
2. [ ] **Modelos TypeScript** - Interfaces para os novos dados
3. [ ] **Migração do Banco** - Aplicar mudanças no schema
4. [ ] **Testes Unitários** - Validar cálculos com dados conhecidos

### **10-11 de Julho (Quarta-Quinta)**
1. [ ] **Backend Controller/Service** - Endpoints para dobras cutâneas
2. [ ] **Integração com Avaliações** - Estender sistema existente
3. [ ] **Validação de Dados** - Ranges e tipos corretos
4. [ ] **Documentação Swagger** - Documentar novos endpoints

### **12-15 de Julho (Sexta-Terça)**
1. [ ] **Interface Frontend** - Modal para entrada de dobras
2. [ ] **Integração com ModalMedidasCorporais** - Fluxo unificado  
3. [ ] **Testes de Integração** - Frontend + Backend
4. [ ] **TESTE REAL** - Validação com atletas de vôlei

### **Referências Técnicas para Alex:**

#### **📚 Fórmulas de Dobras Cutâneas (Fineshape/Literatura):**

```typescript
// FAULKNER (3 pontos) - Tríceps, Subescapular, Supra-ilíaca
export function calcularFaulkner(triceps: number, subescapular: number, suprailiaca: number, sexo: 'M' | 'F'): number {
  const soma = triceps + subescapular + suprailiaca;
  
  if (sexo === 'M') {
    return 0.153 * soma + 5.783; // % Gordura homens
  } else {
    return 0.154 * soma + 5.045; // % Gordura mulheres  
  }
}

// POLLOCK (4 pontos) - Tríceps, Subescapular, Supra-ilíaca, Abdominal
export function calcularPollock(triceps: number, subescapular: number, suprailiaca: number, abdominal: number, sexo: 'M' | 'F', idade: number): number {
  const soma = triceps + subescapular + suprailiaca + abdominal;
  
  if (sexo === 'M') {
    // Fórmula Pollock para homens
    const densidade = 1.112 - (0.00043499 * soma) + (0.00000055 * soma * soma) - (0.00028826 * idade);
    return ((4.95 / densidade) - 4.50) * 100;
  } else {
    // Fórmula Pollock para mulheres
    const densidade = 1.097 - (0.00046971 * soma) + (0.00000056 * soma * soma) - (0.00012828 * idade);
    return ((4.96 / densidade) - 4.51) * 100;
  }
}

// GUEDES (7 pontos) - Protocolo mais completo
export function calcularGuedes(medidas: DobrasCutaneasGuedes, sexo: 'M' | 'F', idade: number): number {
  const { triceps, subescapular, suprailiaca, abdominal, coxa, peito, axilarMedia } = medidas;
  const soma = triceps + subescapular + suprailiaca + abdominal + coxa + peito + axilarMedia;
  
  // Fórmulas específicas do protocolo Guedes (baseadas na literatura brasileira)
  if (sexo === 'M') {
    return 0.11077 * soma - 0.00006 * soma * soma + 0.14354 * idade - 5.92;
  } else {
    return 0.11187 * soma - 0.00058 * soma * soma + 0.11683 * idade - 7.39;
  }
}
```

#### **🗄️ Schema Prisma Sugerido:**
```prisma
// Adicionar à tabela Avaliacao existente:
model Avaliacao {
  // ... campos existentes ...
  
  // Novos campos para dobras cutâneas
  protocoloDobras    String?  // "faulkner" | "pollock" | "guedes"
  dobrasCutaneas     Json?    // Dados das medidas e resultados
  
  @@map("Avaliacao")
}
```

---

## 📞 Considerações Finais

O APC FIT PRO possui uma **base tecnológica sólida** e um **diferencial competitivo claro** no mercado fitness. A implementação seguindo este roadmap posicionará a plataforma como **líder no segmento**, oferecendo uma solução completa baseada no método científico APC.

### **Recomendações Estratégicas:**
1. **Manter o foco na qualidade** - preferir funcionalidades bem implementadas
2. **Priorizar feedback dos usuários** - validar cada módulo com beta testers
3. **Investir em marketing** - paralelo ao desenvolvimento técnico
4. **Preparar para escala** - arquitetura pensada para crescimento

---

**📅 Última atualização:** 8 de Julho de 2025  
**🔄 Revisão:** Diária até 15/07, depois mensal  
**👨‍💻 Responsável:** Alex Sandro R. de Souza  
**🎯 Meta Crítica:** Avaliações de dobras cutâneas funcionais para atletas de vôlei em 15/07

---

> 💡 **FOCO TOTAL:** Todos os esforços estão direcionados para entregar a funcionalidade de dobras cutâneas até 15 de julho. Este é um marco crítico para validação da plataforma com atletas reais e consolidação do método APC no esporte de alto rendimento.
