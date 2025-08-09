# 🎯 Sistema de Classificação e Interpretação Avançada

## 📊 Baseado na Análise FineShape

### **1. Classificações Multidimensionais**

#### **A. Classificação por Idade e Gênero**
```typescript
interface ClassificacaoDetalhada {
  percentualGordura: {
    valor: number;
    classificacao: string;
    faixaIdade: string;
    genero: 'masculino' | 'feminino';
    percentil: number; // Posição na população
  };
  massaMuscular: {
    valor: number;
    classificacao: 'baixa' | 'adequada' | 'alta' | 'muito_alta';
    percentil: number;
  };
  distribuicaoGordura: {
    android: number; // Gordura abdominal
    ginoide: number;  // Gordura quadris/coxas
    relacaoAndroidGinoide: number;
    classificacao: string;
  };
}
```

#### **Tabelas de Classificação por Idade**
```typescript
const CLASSIFICACAO_GORDURA_MASCULINO = {
  '18-25': {
    'muito_baixo': 0,
    'baixo': 6,
    'adequado': 11,
    'moderado': 16,
    'alto': 21,
    'muito_alto': 25
  },
  '26-35': {
    'muito_baixo': 0,
    'baixo': 8,
    'adequado': 13,
    'moderado': 18,
    'alto': 23,
    'muito_alto': 27
  },
  '36-45': {
    'muito_baixo': 0,
    'baixo': 10,
    'adequado': 15,
    'moderado': 20,
    'alto': 25,
    'muito_alto': 29
  },
  // ... outras faixas etárias
};

const CLASSIFICACAO_GORDURA_FEMININO = {
  '18-25': {
    'muito_baixo': 0,
    'baixo': 13,
    'adequado': 17,
    'moderado': 22,
    'alto': 27,
    'muito_alto': 32
  },
  // ... outras faixas etárias
};
```

### **2. Análise de Distribuição Corporal**

#### **Mapeamento de Regiões Corporais**
```typescript
interface AnaliseDistribuicao {
  regioes: {
    membrosSuperiores: {
      triceps: number;
      biceps: number;
      antebraco: number;
      classificacao: string;
    };
    tronco: {
      peitoral: number;
      abdominal: number;
      suprailiaca: number;
      subescapular: number;
      classificacao: string;
    };
    membrosInferiores: {
      coxa: number;
      panturrilha: number;
      classificacao: string;
    };
  };
  padraoDistribuicao: 'uniforme' | 'concentrado_superior' | 'concentrado_inferior' | 'abdominal';
  riscoSaude: 'baixo' | 'moderado' | 'alto';
}
```

#### **Visualização da Distribuição**
```
DISTRIBUIÇÃO DA GORDURA CORPORAL

        🧍 ANÁLISE POR REGIÃO
        
    Cabeça/Pescoço
         📊 Normal
    
    ┌─────────────────┐
    │ Membros Sup.    │ 🟢 Baixo (8%)
    │ • Tríceps: 12mm │
    │ • Bíceps: 6mm   │
    └─────────────────┘
    
    ┌─────────────────┐
    │ Tronco          │ 🟡 Moderado (15%)
    │ • Abdome: 18mm  │
    │ • Subesc: 14mm  │
    │ • Supra: 16mm   │
    └─────────────────┘
    
    ┌─────────────────┐
    │ Membros Inf.    │ 🟢 Baixo (7%)
    │ • Coxa: 13mm    │
    │ • Pantur: 9mm   │
    └─────────────────┘

⚠️  PADRÃO: Concentração Abdominal
💡 RECOMENDAÇÃO: Exercícios aeróbicos + fortalecimento core
```

### **3. Análise de Riscos à Saúde**

#### **Indicadores de Risco Metabólico**
```typescript
interface AnaliseRiscoSaude {
  indicadores: {
    circunferenciaAbdominal: {
      valor: number;
      risco: 'baixo' | 'aumentado' | 'muito_aumentado';
      limite: number;
    };
    relacaoCinturaQuadril: {
      valor: number;
      risco: 'baixo' | 'moderado' | 'alto';
      classificacao: string;
    };
    imc: {
      valor: number;
      classificacao: string;
      risco: string;
    };
    percentualGorduraVisceral: {
      estimativa: number;
      risco: 'baixo' | 'moderado' | 'alto';
    };
  };
  score_risco_geral: number; // 0-100
  recomendacoes: string[];
}
```

#### **Dashboard de Riscos**
```
🏥 ANÁLISE DE RISCOS À SAÚDE

┌─────────────────────────────────────┐
│ SCORE GERAL DE RISCO: 25/100       │
│ ████████░░░░░░░░░░░░ BAIXO RISCO   │
└─────────────────────────────────────┘

📊 INDICADORES DETALHADOS:

🟢 Circunferência Abdominal: 80cm
   Limite de risco: 94cm (H) / 80cm (M)
   Status: Dentro da normalidade

🟡 Relação Cintura/Quadril: 0.85
   Limite de risco: 0.90 (H) / 0.85 (M)
   Status: No limite - atenção

🟢 IMC: 21.5 kg/m²
   Classificação: Normal
   Risco: Baixo

🟢 Gordura Visceral (estimativa): 8%
   Classificação: Normal (< 10%)
   Risco: Baixo

💡 RECOMENDAÇÕES:
• Manter peso atual
• Exercícios para core 3x/semana
• Monitorar cintura mensalmente
```

### **4. Comparação com População de Referência**

#### **Percentis Populacionais**
```typescript
interface ComparacaoPopulacional {
  dadosCliente: {
    percentualGordura: number;
    massaMuscular: number;
    densidade: number;
  };
  percentis: {
    percentualGordura: number; // Ex: 25 = melhor que 25% da população
    massaMuscular: number;
    fitness_geral: number;
  };
  populacaoReferencia: {
    idade: string;
    genero: string;
    atividade: 'sedentario' | 'ativo' | 'atleta';
    n_amostra: number;
  };
}
```

#### **Visualização Comparativa**
```
📈 COMPARAÇÃO COM POPULAÇÃO BRASILEIRA

        SEU PERCENTIL NA POPULAÇÃO
        
% Gordura Corporal (Homens 25-35 anos)
├─────┬─────┬─────┬─────┬─────┬─────┤
│ 5%  │ 25% │ 50% │ 75% │ 95% │     │
│     │     │  ●  │     │     │     │
├─────┼─────┼─────┼─────┼─────┼─────┤
│ 8%  │ 13% │ 18% │ 23% │ 28% │     │

🎯 VOCÊ ESTÁ NO PERCENTIL 60
   Melhor que 60% dos homens da sua idade!

Massa Muscular (kg)
├─────┬─────┬─────┬─────┬─────┬─────┤
│ 5%  │ 25% │ 50% │ 75% │ 95% │     │
│     │     │     │  ●  │     │     │
├─────┼─────┼─────┼─────┼─────┼─────┤
│ 55kg│ 60kg│ 65kg│ 70kg│ 75kg│     │

🎯 VOCÊ ESTÁ NO PERCENTIL 75
   Melhor que 75% dos homens da sua idade!
```

### **5. Interpretações Personalizadas**

#### **Sistema de IA para Interpretações**
```typescript
interface InterpretacaoPersonalizada {
  analise_geral: string;
  pontos_fortes: string[];
  areas_melhoria: string[];
  contexto_objetivo: {
    objetivo: 'emagrecimento' | 'ganho_massa' | 'performance' | 'saude';
    progresso: string;
    ajustes_sugeridos: string[];
  };
  motivacao: string;
  proximos_passos: string[];
}
```

#### **Template de Interpretação**
```
🤖 INTERPRETAÇÃO INTELIGENTE DA SUA AVALIAÇÃO

📝 ANÁLISE GERAL:
Seus resultados mostram um excelente equilíbrio corporal. 
Com 12.5% de gordura corporal, você está na faixa adequada 
para homens ativos da sua idade (25-35 anos). Sua massa 
muscular de 63.9kg representa 87.5% do seu peso total, 
indicando boa preservação muscular.

✅ SEUS PONTOS FORTES:
• Percentual de gordura dentro da faixa saudável
• Excelente massa muscular para sua idade
• Distribuição equilibrada de gordura corporal
• Baixo risco de doenças metabólicas

🎯 ÁREAS PARA MELHORIA:
• Redução leve da gordura abdominal (de 18mm para 15mm)
• Ganho adicional de massa muscular nos membros inferiores
• Melhoria da flexibilidade (se aplicável)

🏋️ CONTEXTO DO SEU OBJETIVO: Definição Muscular
PROGRESSO: Excelente! Você perdeu 1.3% de gordura mantendo 
a massa muscular. Continue o protocolo atual.

AJUSTES SUGERIDOS:
• Manter déficit calórico moderado por mais 4-6 semanas
• Incluir 2 sessões HIIT/semana para queima de gordura
• Priorizar exercícios compostos para máxima eficiência

💪 MOTIVAÇÃO:
Parabéns! Você está no caminho certo. Seus resultados 
mostram que o trabalho está compensando. Continue focado 
e disciplinado - o objetivo de 10% de gordura está próximo!

📋 PRÓXIMOS PASSOS:
1. Reavaliação em 6-8 semanas
2. Ajustar plano nutricional se necessário
3. Incluir medições de performance (força/resistência)
4. Considerar suplementação específica com nutricionista
```

### **6. Relatórios Científicos Detalhados**

#### **Seção Técnica para Profissionais**
```typescript
interface RelatorioTecnico {
  metodologia: {
    protocolo: string;
    equacoes_utilizadas: string[];
    precisao_estimada: number;
    limitacoes: string[];
  };
  dados_brutos: {
    dobras_cutaneas: Record<string, number>;
    circunferencias: Record<string, number>;
    densidade_corporal: number;
    massa_livre_gordura: number;
  };
  calculos_detalhados: {
    soma_dobras: number;
    densidade_calculada: number;
    percentual_gordura_siri: number;
    percentual_gordura_brozek: number;
    erro_estimado: number;
  };
}
```

### **7. Implementação no Sistema**

#### **Backend - Serviço de Classificação**
```typescript
// src/services/classificacao/classificacao-avancada.service.ts
export class ClassificacaoAvancadaService {
  async gerarClassificacaoCompleta(
    avaliacao: AvaliacaoCompleta,
    usuario: Usuario
  ): Promise<ClassificacaoDetalhada> {
    
    const faixaEtaria = this.determinarFaixaEtaria(usuario.idade);
    const tabelaClassificacao = this.obterTabelaClassificacao(usuario.genero, faixaEtaria);
    
    const classificacaoGordura = this.classificarPercentualGordura(
      avaliacao.percentualGordura,
      tabelaClassificacao
    );
    
    const analiseDistribuicao = this.analisarDistribuicaoGordura(avaliacao.dobras);
    const riscoSaude = this.avaliarRiscoSaude(avaliacao, usuario);
    const comparacaoPopulacional = this.compararComPopulacao(avaliacao, usuario);
    
    return {
      classificacaoGordura,
      analiseDistribuicao,
      riscoSaude,
      comparacaoPopulacional,
      interpretacaoPersonalizada: await this.gerarInterpretacaoIA(avaliacao, usuario)
    };
  }
}
```

#### **Frontend - Componente de Classificação**
```typescript
// src/components/avaliacao/ClassificacaoAvancada.tsx
export function ClassificacaoAvancada({ avaliacao }: Props) {
  return (
    <div className="space-y-6">
      <ClassificacaoPercentil data={avaliacao.classificacao} />
      <AnaliseDistribuicao data={avaliacao.distribuicao} />
      <RiscoSaude data={avaliacao.riscoSaude} />
      <ComparacaoPopulacional data={avaliacao.comparacao} />
      <InterpretacaoPersonalizada data={avaliacao.interpretacao} />
    </div>
  );
}
```

---

💡 **Este sistema de classificação avançada elevará a qualidade das interpretações, fornecendo análises científicas e personalizadas que agregam valor real aos usuários!**
