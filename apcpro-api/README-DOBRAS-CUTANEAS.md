# Sistema de Avaliação de Dobras Cutâneas - APC FIT PRO

## 📋 Visão Geral

O sistema de dobras cutâneas do APC FIT PRO implementa os principais protocolos científicos para avaliação da composição corporal através da medição de dobras cutâneas. O sistema é totalmente independente e permite cálculos precisos baseados em fórmulas validadas científicamente.

## 🔬 Protocolos Implementados

### 1. Faulkner (4 dobras)
- **Dobras**: Tríceps, Subescapular, Supra-ilíaca, Bicipital
- **Gênero**: Ambos (M/F)
- **Idade**: Não requerida
- **Tempo médio**: 5 minutos

### 2. Pollock 3 dobras
- **Homens**: Peitoral, Abdominal, Coxa
- **Mulheres**: Tríceps, Supra-ilíaca, Coxa
- **Idade**: 18-61 anos (obrigatória)
- **Tempo médio**: 3 minutos

### 3. Pollock 7 dobras
- **Dobras**: Tríceps, Subescapular, Supra-ilíaca, Abdominal, Peitoral, Axilar Média, Coxa
- **Gênero**: Ambos (M/F)
- **Idade**: 18-61 anos (obrigatória)
- **Tempo médio**: 8 minutos

### 4. Pollock 9 dobras (Atletas)
- **Dobras**: 7 dobras padrão + Bíceps + Panturrilha
- **Gênero**: Ambos (M/F)
- **Idade**: Não obrigatória
- **Tempo médio**: 12 minutos
- **Observação**: Bíceps e panturrilha são medidas mas não entram na equação

### 5. Guedes (População Brasileira)
- **Dobras**: Tríceps, Subescapular, Supra-ilíaca, Abdominal, Coxa, Peitoral, Axilar Média
- **Gênero**: Ambos (M/F)
- **Idade**: Obrigatória
- **Tempo médio**: 4 minutos

## 🏗️ Arquitetura do Sistema

```
src/
├── utils/protocolos-dobras/
│   ├── faulkner.ts          # Protocolo Faulkner
│   ├── pollock.ts           # Protocolos Pollock (3, 7, 9)
│   ├── guedes.ts            # Protocolo Guedes
│   ├── index.ts             # Centralizador de exports
│   ├── faulkner.test.js     # Testes Faulkner
│   └── pollock.test.js      # Testes Pollock
├── models/
│   └── dobras-cutaneas-model.ts  # Interfaces TypeScript
├── services/
│   └── dobras-cutaneas-service.ts  # Lógica de negócio
└── controllers/
    └── dobras-cutaneas-controller.ts  # Endpoints API
```

## 📊 Banco de Dados

O sistema utiliza o campo `resultado` (JSON) da tabela `Avaliacao` existente:

```sql
-- Estrutura utilizada
CREATE TABLE Avaliacao (
  id VARCHAR PRIMARY KEY,
  userPerfilId VARCHAR NOT NULL,
  tipo VARCHAR NOT NULL,  -- 'dobras-cutaneas'
  status VARCHAR NOT NULL, -- 'PENDENTE', 'CONCLUIDA', 'CANCELADA'
  resultado JSON,          -- Dados da avaliação
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

## 🛠️ API Endpoints

### Listar Protocolos
```http
GET /api/dobras-cutaneas/protocolos
```

### Calcular (sem salvar)
```http
POST /api/dobras-cutaneas/calcular
Content-Type: application/json

{
  "userPerfilId": "user123",
  "protocolo": "faulkner",
  "dadosPessoais": {
    "genero": "M",
    "peso": 80
  },
  "medidas": {
    "triceps": 12,
    "subescapular": 15,
    "suprailiaca": 18,
    "bicipital": 8
  }
}
```

### Criar Avaliação (salvar)
```http
POST /api/dobras-cutaneas
Authorization: Bearer <token>
Content-Type: application/json

{
  "userPerfilId": "user123",
  "protocolo": "pollock-7",
  "dadosPessoais": {
    "genero": "F",
    "idade": 25,
    "peso": 60
  },
  "medidas": {
    "triceps": 14,
    "subescapular": 10,
    "suprailiaca": 16,
    "abdominal": 12,
    "peitoral": 8,
    "axilarMedia": 11,
    "coxa": 18
  },
  "observacoes": "Avaliação inicial"
}
```

### Buscar por Usuário
```http
GET /api/dobras-cutaneas/usuario/:userPerfilId
Authorization: Bearer <token>
```

### Buscar por ID
```http
GET /api/dobras-cutaneas/:id
Authorization: Bearer <token>
```

## 🧪 Testando o Sistema

### 1. Testar Fórmulas
```bash
cd src/utils/protocolos-dobras
node faulkner.test.js
node pollock.test.js
```

### 2. Testar Service (Integração)
```bash
# Na raiz da API
node teste-dobras-cutaneas.js
```

### 3. Build e Verificação
```bash
npm run build
```

## 📋 Validações Implementadas

### Medidas de Dobras
- **Range**: 3-50mm (valores fisiológicos normais)
- **Validação**: Automática para todos os protocolos

### Idade
- **Pollock**: 18-61 anos (obrigatória)
- **Guedes**: Obrigatória (sem limite específico)
- **Faulkner**: Não requerida

### Gênero
- **Formato**: 'M' ou 'F'
- **Pollock 3**: Específico por gênero
- **Outros**: Ambos os gêneros

## 📊 Exemplos de Resposta

### Resposta de Cálculo
```json
{
  "success": true,
  "message": "Cálculo realizado com sucesso",
  "data": {
    "protocolo": "faulkner",
    "dadosPessoais": {
      "genero": "M",
      "peso": 80
    },
    "medidas": {
      "triceps": 12,
      "subescapular": 15,
      "suprailiaca": 18,
      "bicipital": 8
    },
    "resultados": {
      "somaTotal": 53,
      "percentualGordura": 12.8,
      "massaGorda": 10.2,
      "massaMagra": 69.8,
      "classificacao": "Ótimo"
    },
    "metadata": {
      "dataAvaliacao": "2025-07-06T15:30:00.000Z",
      "validadeFormula": "Faulkner"
    }
  }
}
```

## 🔧 Configuração de Desenvolvimento

### Dependências
- TypeScript
- Express
- Prisma
- Node.js

### Scripts Úteis
```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Testes
npm test

# Prisma
npx prisma studio
npx prisma migrate dev
```

## 📚 Referências Científicas

1. **Faulkner, J.A.** (1968). Physiology of swimming and diving.
2. **Pollock, M.L. & Jackson, A.S.** (1984). Research progress in validation of clinical methods of assessing body composition.
3. **Guedes, D.P. & Guedes, J.E.R.P.** (1998). Manual prático para avaliação em educação física.
4. **Siri, W.E.** (1961). Body composition from fluid spaces and density.

## 🚀 Próximas Implementações

- [ ] Interface frontend para seleção dinâmica de protocolo
- [ ] Gráficos de evolução histórica
- [ ] Geração de relatórios PDF
- [ ] Comparação entre protocolos
- [ ] Integração com dashboard principal

---

**Desenvolvido para APC FIT PRO**  
Sistema de avaliação, prescrição e controle de treinos físicos
