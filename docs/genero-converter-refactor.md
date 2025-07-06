# Padronização de Conversão de Gênero/Sexo

## Resumo das Mudanças

Este documento descreve a padronização realizada para a conversão de gênero/sexo em todo o projeto APC FIT PRO, criando utilitários centralizados e consistentes.

## Problema Original

A função `sexoToNumber` estava duplicada e dispersa pelo código, causando:
- Inconsistência na conversão de gênero
- Código duplicado em vários arquivos
- Falta de padrão para diferentes formatos de entrada
- Dificuldade de manutenção

## Solução Implementada

### 1. Backend: `genero-converter.ts`

**Localização:** `apcpro-api/src/utils/genero-converter.ts`

**Funcionalidades:**
- `converterSexoParaGenero()`: Converte diferentes formatos para enum Genero
- `generoParaString()`: Converte enum para string ("masculino"/"feminino")
- `generoParaNumero()`: Converte enum para número (1/0)
- `generoParaLetra()`: Converte enum para letra ("M"/"F")
- `isSexoValido()`: Validação de entrada

**Formatos suportados:**
- Strings: "masculino", "feminino", "M", "F", "m", "f"
- Números: 1 (masculino), 0 (feminino)
- Normalização automática (case-insensitive, trim)

### 2. Frontend: `genero-converter.ts`

**Localização:** `apcpro-web/src/utils/genero-converter.ts`

**Funcionalidades:**
- `normalizarGenero()`: Normaliza diferentes formatos para "masculino"/"feminino"
- `generoParaLetra()`: Converte para formato letra
- `generoParaNumero()`: Converte para formato número
- `isGeneroValido()`: Validação de entrada

**Compatibilidade:**
- Mantém compatibilidade com `normalizar-genero.ts` existente
- Suporte a formatos internacionais: "male", "female", "man", "woman"

## Arquivos Modificados

### Backend
1. **`users-service.ts`**
   - Removida função duplicada `sexoToNumber`
   - Adicionado import do novo utilitário
   - Substituído `isSexo()` por `isSexoValido()`

2. **`conversorMedidas.ts`**
   - Removida função local `converterSexoParaGenero`
   - Adicionado import do utilitário centralizado

3. **`avaliacaoMedidas.ts`**
   - Substituídas conversões manuais por `generoParaString()`
   - Código mais limpo e consistente

### Frontend
1. **`normalizar-genero.ts`**
   - Marcado como deprecated
   - Redirecionado para novo utilitário (compatibilidade mantida)

2. **`genero-converter.ts` (novo)**
   - Utilitário completo para conversões de gênero
   - Compatível com backend

## Benefícios

### ✅ Consistência
- Um único ponto de conversão para todo o projeto
- Comportamento padronizado em todas as partes

### ✅ Manutenibilidade
- Mudanças centralizadas em um só lugar
- Código mais limpo e organizado

### ✅ Robustez
- Validação de entrada
- Tratamento de casos edge
- Valores padrão seguros

### ✅ Compatibilidade
- Backward compatibility mantida
- Suporte a múltiplos formatos de entrada

## Exemplos de Uso

### Backend
```typescript
import { converterSexoParaGenero, generoParaString } from "../utils/genero-converter";

// Converte entrada para enum
const genero = converterSexoParaGenero("M"); // Genero.Masculino
const genero2 = converterSexoParaGenero(1); // Genero.Masculino

// Converte enum para string
const sexoStr = generoParaString(Genero.Masculino); // "masculino"
```

### Frontend
```typescript
import { normalizarGenero, generoParaLetra } from "../utils/genero-converter";

// Normalização
const genero = normalizarGenero("MASCULINO"); // "masculino"
const genero2 = normalizarGenero("f"); // "feminino"

// Conversão para letra
const letra = generoParaLetra("masculino"); // "M"
```

## Testes Realizados

### ✅ Compilação
- Backend: `npm run build` - ✅ Sucesso
- Frontend: `npm run build` - ✅ Sucesso

### ✅ Funcionalidades
- Conversões de gênero funcionando corretamente
- Compatibilidade com código existente mantida
- Validações funcionando adequadamente

## Próximos Passos

1. **Migração Gradual:** Substituir usos diretos da função antiga pelo novo utilitário
2. **Testes Unitários:** Adicionar testes para as funções de conversão
3. **Documentação:** Atualizar documentação técnica do projeto
4. **Linting:** Adicionar regras ESLint para evitar uso de conversões manuais

## Arquivos Criados

- `apcpro-api/src/utils/genero-converter.ts`
- `apcpro-web/src/utils/genero-converter.ts`

## Arquivos Modificados

- `apcpro-api/src/services/users-service.ts`
- `apcpro-api/src/utils/conversorMedidas.ts`
- `apcpro-api/src/utils/avaliacaoMedidas.ts`
- `apcpro-web/src/utils/normalizar-genero.ts`
