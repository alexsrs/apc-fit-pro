# 🏋️ Banco de Dados de Exercícios e Recomendações Inteligentes

## 🎯 Inspirado na Análise FineShape - Sistema Completo

### **1. Estrutura do Banco de Exercícios**

#### **Schema Prisma - Exercícios**
```prisma
model Exercicio {
  id              String   @id @default(cuid())
  nome            String
  nomeAlternativo String?
  categoria       CategoriaExercicio
  grupoMuscular   GrupoMuscular[]
  equipamento     Equipamento[]
  dificuldade     NivelDificuldade
  calorias_min    Int? // Calorias por minuto
  
  // Mídia
  imagem_url      String?
  video_url       String?
  gif_url         String?
  
  // Instruções
  descricao       String
  instrucoes      String[]
  dicas_tecnica   String[]
  erros_comuns    String[]
  
  // Progressões
  variacao_facil      String?
  variacao_dificil    String?
  progressoes         ProgressaoExercicio[]
  
  // Metadados
  tempo_execucao      Int? // segundos
  tempo_descanso      Int? // segundos
  target_reps_min     Int?
  target_reps_max     Int?
  
  // Benefícios específicos
  beneficios          BeneficioExercicio[]
  contraindicacoes    String[]
  
  criado_em       DateTime @default(now())
  atualizado_em   DateTime @updatedAt
  
  // Relacionamentos
  treinos         TreinoExercicio[]
  recomendacoes   RecomendacaoExercicio[]
  
  @@map("exercicios")
}

enum CategoriaExercicio {
  FORCA
  CARDIO
  FLEXIBILIDADE
  MOBILIDADE
  FUNCIONAL
  HIIT
  YOGA
  PILATES
  AQUATICO
}

enum GrupoMuscular {
  PEITORAL
  COSTAS
  OMBROS
  BICEPS
  TRICEPS
  ANTEBRACO
  CORE
  ABDOMEN
  LOMBAR
  QUADRICEPS
  ISQUIOTIBIAIS
  GLUTEOS
  PANTURRILHAS
  CORPO_TODO
}

enum Equipamento {
  PESO_LIVRE
  HALTER
  BARRA
  MAQUINA
  ELÁSTICO
  PESO_CORPORAL
  KETTLEBELL
  MEDICINE_BALL
  STEP
  ESTEIRA
  BICICLETA
  PISCINA
  TAPETE
  NENHUM
}

enum NivelDificuldade {
  INICIANTE
  INTERMEDIARIO
  AVANCADO
  EXPERT
}

model BeneficioExercicio {
  id          String @id @default(cuid())
  exercicio_id String
  exercicio   Exercicio @relation(fields: [exercicio_id], references: [id])
  beneficio   TipoBeneficio
  intensidade Int // 1-5
  
  @@map("beneficios_exercicios")
}

enum TipoBeneficio {
  QUEIMA_GORDURA
  GANHO_MASSA
  MELHORA_CARDIO
  AUMENTA_FORÇA
  MELHORA_FLEXIBILIDADE
  REDUZ_ESTRESSE
  MELHORA_POSTURA
  AUMENTA_RESISTENCIA
  DEFINE_MUSCULO
  QUEIMA_GORDURA_ABDOMINAL
}
```

#### **Sistema de Recomendações Inteligentes**
```prisma
model RecomendacaoExercicio {
  id                String @id @default(cuid())
  usuario_id        String
  usuario           User @relation(fields: [usuario_id], references: [id])
  exercicio_id      String
  exercicio         Exercicio @relation(fields: [exercicio_id], references: [id])
  
  // Contexto da recomendação
  baseado_em        TipoRecomendacao
  avaliacao_id      String?
  objetivo          ObjetivoTreino
  prioridade        Int // 1-10
  motivo            String
  
  // Parametros específicos
  series_sugeridas  Int?
  reps_sugeridas    String? // "8-12" ou "30 segundos"
  carga_sugerida    String? // "Peso corporal" ou "50-60% 1RM"
  frequencia_semana Int? // vezes por semana
  
  // Progressão
  progressao_semanas Int? // quantas semanas manter
  proximo_exercicio_id String?
  
  criado_em         DateTime @default(now())
  status            StatusRecomendacao @default(PENDENTE)
  
  @@map("recomendacoes_exercicios")
}

enum TipoRecomendacao {
  BASEADO_AVALIACAO
  BASEADO_OBJETIVO
  BASEADO_DEFICIENCIA
  BASEADO_EVOLUCAO
  BASEADO_LESAO
  SUGESTAO_GERAL
}

enum ObjetivoTreino {
  EMAGRECIMENTO
  GANHO_MASSA
  DEFINICAO
  CONDICIONAMENTO
  REABILITACAO
  PERFORMANCE
  SAUDE_GERAL
}

enum StatusRecomendacao {
  PENDENTE
  ACEITA
  REJEITADA
  EXECUTANDO
  FINALIZADA
}
```

### **2. Engine de Recomendações Baseada em Avaliação**

#### **Serviço de Recomendações**
```typescript
// src/services/recomendacoes/engine-recomendacoes.service.ts
export class EngineRecomendacoesService {
  
  async gerarRecomendacoes(
    usuarioId: string, 
    avaliacaoId: string
  ): Promise<RecomendacaoCompleta[]> {
    
    const avaliacao = await this.avaliacaoService.buscarPorId(avaliacaoId);
    const usuario = await this.userService.buscarPorId(usuarioId);
    const historico = await this.buscarHistoricoTreinos(usuarioId);
    
    const analises = [
      this.analisarComposicaoCorporal(avaliacao),
      this.analisarDistribuicaoGordura(avaliacao),
      this.analisarAssimetrias(avaliacao),
      this.analisarDeficiencias(avaliacao, historico),
      this.analisarObjetivo(usuario.objetivo)
    ];
    
    return this.compilarRecomendacoes(analises, usuario);
  }
  
  private analisarComposicaoCorporal(avaliacao: Avaliacao): AnaliseRecomendacao {
    const { percentualGordura, massaMuscular } = avaliacao.resultados;
    
    const recomendacoes: RecomendacaoExercicio[] = [];
    
    // Lógica para % gordura elevado
    if (percentualGordura > 15) { // para homens
      recomendacoes.push(...this.exerciciosQueimGordura());
    }
    
    // Lógica para baixa massa muscular
    if (massaMuscular < this.calcularMassaMuscularIdeal(avaliacao)) {
      recomendacoes.push(...this.exerciciosGanhoMassa());
    }
    
    return { categoria: 'composicao_corporal', recomendacoes };
  }
  
  private analisarDistribuicaoGordura(avaliacao: Avaliacao): AnaliseRecomendacao {
    const dobras = avaliacao.dobras;
    const recomendacoes: RecomendacaoExercicio[] = [];
    
    // Concentração abdominal
    if (dobras.abdominal > dobras.media_geral * 1.3) {
      recomendacoes.push(...this.exerciciosCore());
      recomendacoes.push(...this.exerciciosHIIT());
    }
    
    // Membros superiores
    if (dobras.triceps > dobras.media_geral * 1.2) {
      recomendacoes.push(...this.exerciciosTriceps());
    }
    
    // Membros inferiores
    if (dobras.coxa > dobras.media_geral * 1.2) {
      recomendacoes.push(...this.exerciciosMembrosInferiores());
    }
    
    return { categoria: 'distribuicao_gordura', recomendacoes };
  }
  
  private exerciciosQueimGordura(): RecomendacaoExercicio[] {
    return [
      {
        exercicio: 'Burpees',
        objetivo: 'EMAGRECIMENTO',
        prioridade: 9,
        motivo: 'Alto gasto calórico e trabalho de corpo inteiro',
        series: 3,
        reps: '10-15',
        frequencia: 3
      },
      {
        exercicio: 'Mountain Climbers',
        objetivo: 'EMAGRECIMENTO',
        prioridade: 8,
        motivo: 'Cardio intenso com fortalecimento do core',
        series: 3,
        reps: '30 segundos',
        frequencia: 4
      },
      {
        exercicio: 'Jumping Jacks',
        objetivo: 'EMAGRECIMENTO',
        prioridade: 7,
        motivo: 'Exercício cardiovascular de baixo impacto',
        series: 3,
        reps: '45 segundos',
        frequencia: 4
      }
    ];
  }
  
  private exerciciosCore(): RecomendacaoExercicio[] {
    return [
      {
        exercicio: 'Prancha',
        objetivo: 'DEFINICAO',
        prioridade: 9,
        motivo: 'Fortalecimento do core e redução da gordura abdominal',
        series: 3,
        reps: '30-60 segundos',
        frequencia: 5
      },
      {
        exercicio: 'Bicycle Crunches',
        objetivo: 'DEFINICAO',
        prioridade: 8,
        motivo: 'Trabalha oblíquos e reto abdominal',
        series: 3,
        reps: '15-20 cada lado',
        frequencia: 4
      }
    ];
  }
}
```

### **3. Interface de Recomendações**

#### **Dashboard de Recomendações**
```typescript
// src/components/recomendacoes/DashboardRecomendacoes.tsx
export function DashboardRecomendacoes({ usuarioId }: Props) {
  const { data: recomendacoes } = useRecomendacoes(usuarioId);
  
  return (
    <div className="space-y-6">
      {/* Header com resumo */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">
          🎯 Suas Recomendações Personalizadas
        </h2>
        <p className="opacity-90">
          Baseadas na sua avaliação mais recente e objetivos definidos
        </p>
        <div className="mt-4 flex gap-4 text-sm">
          <span>📊 {recomendacoes.length} exercícios selecionados</span>
          <span>🔥 Foco: {recomendacoes.objetivo_principal}</span>
          <span>⏱️ {recomendacoes.tempo_estimado} min/dia</span>
        </div>
      </div>
      
      {/* Seções por categoria */}
      <div className="grid gap-6">
        <SecaoRecomendacao 
          titulo="🔥 Queima de Gordura Direcionada"
          exercicios={recomendacoes.queima_gordura}
          cor="red"
        />
        <SecaoRecomendacao 
          titulo="💪 Fortalecimento Muscular"
          exercicios={recomendacoes.ganho_massa}
          cor="blue"
        />
        <SecaoRecomendacao 
          titulo="🎯 Exercícios Específicos"
          exercicios={recomendacoes.especificos}
          cor="green"
        />
      </div>
    </div>
  );
}
```

#### **Card de Exercício com Detalhes**
```typescript
// src/components/exercicios/CardExercicio.tsx
export function CardExercicio({ exercicio, recomendacao }: Props) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Imagem/GIF do exercício */}
      <div className="relative h-48 bg-gray-100">
        {exercicio.gif_url ? (
          <img 
            src={exercicio.gif_url} 
            alt={exercicio.nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Dumbbell className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Badge de dificuldade */}
        <Badge 
          className={`absolute top-2 right-2 ${
            exercicio.dificuldade === 'INICIANTE' ? 'bg-green-500' :
            exercicio.dificuldade === 'INTERMEDIARIO' ? 'bg-yellow-500' :
            'bg-red-500'
          }`}
        >
          {exercicio.dificuldade}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{exercicio.nome}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">{recomendacao.prioridade}/10</span>
          </div>
        </div>
        
        {/* Motivo da recomendação */}
        <div className="bg-blue-50 p-3 rounded-lg mb-3">
          <p className="text-sm text-blue-800">
            <Info className="w-4 h-4 inline mr-1" />
            {recomendacao.motivo}
          </p>
        </div>
        
        {/* Parâmetros de treino */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
          <div className="text-center">
            <div className="font-medium text-gray-600">Séries</div>
            <div className="font-bold">{recomendacao.series}</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-600">Reps</div>
            <div className="font-bold">{recomendacao.reps}</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-600">Freq/Sem</div>
            <div className="font-bold">{recomendacao.frequencia}x</div>
          </div>
        </div>
        
        {/* Grupos musculares */}
        <div className="flex flex-wrap gap-1 mb-3">
          {exercicio.grupos_musculares.map(grupo => (
            <Badge key={grupo} variant="secondary" className="text-xs">
              {grupo}
            </Badge>
          ))}
        </div>
        
        {/* Ações */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDetails(true)}
          >
            <Eye className="w-4 h-4 mr-1" />
            Detalhes
          </Button>
          <Button 
            size="sm"
            onClick={() => adicionarAoTreino(exercicio.id)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### **4. Modal de Detalhes do Exercício**

```typescript
// src/components/exercicios/ModalDetalhesExercicio.tsx
export function ModalDetalhesExercicio({ exercicio, isOpen, onClose }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{exercicio.nome}</DialogTitle>
          {exercicio.nome_alternativo && (
            <p className="text-gray-600">
              Também conhecido como: {exercicio.nome_alternativo}
            </p>
          )}
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Coluna da esquerda - Mídia */}
          <div className="space-y-4">
            {/* GIF/Vídeo do exercício */}
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {exercicio.video_url ? (
                <video 
                  controls 
                  className="w-full h-full"
                  poster={exercicio.imagem_url}
                >
                  <source src={exercicio.video_url} type="video/mp4" />
                </video>
              ) : exercicio.gif_url ? (
                <img 
                  src={exercicio.gif_url} 
                  alt={exercicio.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Dumbbell className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Informações básicas */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Categoria:</span>
                <p>{exercicio.categoria}</p>
              </div>
              <div>
                <span className="font-medium">Equipamento:</span>
                <p>{exercicio.equipamentos.join(', ')}</p>
              </div>
              <div>
                <span className="font-medium">Tempo:</span>
                <p>{exercicio.tempo_execucao}s execução / {exercicio.tempo_descanso}s descanso</p>
              </div>
              <div>
                <span className="font-medium">Calorias:</span>
                <p>~{exercicio.calorias_min} cal/min</p>
              </div>
            </div>
          </div>
          
          {/* Coluna da direita - Instruções */}
          <div className="space-y-4">
            {/* Descrição */}
            <div>
              <h4 className="font-bold mb-2">📝 Descrição</h4>
              <p className="text-gray-700">{exercicio.descricao}</p>
            </div>
            
            {/* Instruções passo a passo */}
            <div>
              <h4 className="font-bold mb-2">📋 Como Executar</h4>
              <ol className="list-decimal list-inside space-y-1">
                {exercicio.instrucoes.map((instrucao, index) => (
                  <li key={index} className="text-gray-700">{instrucao}</li>
                ))}
              </ol>
            </div>
            
            {/* Dicas de técnica */}
            <div>
              <h4 className="font-bold mb-2">💡 Dicas de Técnica</h4>
              <ul className="list-disc list-inside space-y-1">
                {exercicio.dicas_tecnica.map((dica, index) => (
                  <li key={index} className="text-gray-700">{dica}</li>
                ))}
              </ul>
            </div>
            
            {/* Erros comuns */}
            <div>
              <h4 className="font-bold mb-2 text-red-600">⚠️ Erros Comuns</h4>
              <ul className="list-disc list-inside space-y-1">
                {exercicio.erros_comuns.map((erro, index) => (
                  <li key={index} className="text-red-700">{erro}</li>
                ))}
              </ul>
            </div>
            
            {/* Benefícios */}
            <div>
              <h4 className="font-bold mb-2">🎯 Benefícios</h4>
              <div className="grid grid-cols-2 gap-2">
                {exercicio.beneficios.map(beneficio => (
                  <div key={beneficio.tipo} className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: beneficio.intensidade }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm">{beneficio.tipo}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Progressões */}
            {(exercicio.variacao_facil || exercicio.variacao_dificil) && (
              <div>
                <h4 className="font-bold mb-2">📈 Progressões</h4>
                {exercicio.variacao_facil && (
                  <p className="text-sm text-green-700">
                    <TrendingDown className="w-4 h-4 inline mr-1" />
                    Mais fácil: {exercicio.variacao_facil}
                  </p>
                )}
                {exercicio.variacao_dificil && (
                  <p className="text-sm text-red-700">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    Mais difícil: {exercicio.variacao_dificil}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={() => adicionarAoTreino(exercicio.id)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar ao Treino
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### **5. Seed Data - Banco de Exercícios**

<function_calls>
<invoke name="create_file">
<parameter name="content"># 🏋️ Banco de Dados de Exercícios - Seed Data

## Exercícios para Queima de Gordura

### 1. HIIT e Cardio Intenso

```typescript
const exerciciosHIIT = [
  {
    nome: "Burpees",
    categoria: "HIIT",
    grupos_musculares: ["CORPO_TODO", "CORE", "PEITORAL", "QUADRICEPS"],
    equipamento: ["NENHUM"],
    dificuldade: "INTERMEDIARIO",
    calorias_min: 15,
    tempo_execucao: 45,
    tempo_descanso: 15,
    descricao: "Exercício completo que combina agachamento, prancha e salto, proporcionando alto gasto calórico e fortalecimento muscular.",
    instrucoes: [
      "Inicie em pé, com os pés na largura dos ombros",
      "Agache e apoie as mãos no chão",
      "Salte com os pés para trás, ficando em posição de prancha",
      "Faça uma flexão (opcional)",
      "Salte com os pés de volta à posição de agachamento",
      "Salte verticalmente com os braços para cima"
    ],
    dicas_tecnica: [
      "Mantenha o core contraído durante todo o movimento",
      "Aterrisse suavemente para proteger as articulações",
      "Mantenha um ritmo constante, sem pressa excessiva",
      "Respire de forma controlada"
    ],
    erros_comuns: [
      "Arquear as costas na posição de prancha",
      "Não estender completamente os quadris no salto",
      "Apoiar apenas os dedos dos pés no chão",
      "Fazer o movimento muito rapidamente perdendo a técnica"
    ],
    beneficios: [
      { tipo: "QUEIMA_GORDURA", intensidade: 5 },
      { tipo: "MELHORA_CARDIO", intensidade: 5 },
      { tipo: "AUMENTA_RESISTENCIA", intensidade: 4 },
      { tipo: "DEFINE_MUSCULO", intensidade: 3 }
    ],
    variacao_facil: "Burpee sem flexão e sem salto final",
    variacao_dificil: "Burpee com flexão e salto sobre obstáculo"
  },
  
  {
    nome: "Mountain Climbers",
    nome_alternativo: "Escalador",
    categoria: "HIIT",
    grupos_musculares: ["CORE", "OMBROS", "QUADRICEPS"],
    equipamento: ["NENHUM"],
    dificuldade: "INICIANTE",
    calorias_min: 12,
    tempo_execucao: 30,
    tempo_descanso: 30,
    descricao: "Exercício dinâmico que simula a escalada, excelente para cardio e fortalecimento do core.",
    instrucoes: [
      "Inicie na posição de prancha alta",
      "Mantenha as mãos firmes no chão, alinhadas com os ombros",
      "Traga alternadamente os joelhos em direção ao peito",
      "Mantenha o quadril estável durante o movimento",
      "Realize o movimento de forma rápida e controlada"
    ],
    dicas_tecnica: [
      "Mantenha o corpo alinhado como uma prancha",
      "Não levante muito o quadril",
      "Apoie todo o pé no chão, não apenas os dedos",
      "Mantenha os ombros diretamente sobre as mãos"
    ],
    erros_comuns: [
      "Levantar demais o quadril",
      "Apoiar apenas os dedos dos pés",
      "Movimento muito largo dos pés",
      "Perder o alinhamento da coluna"
    ],
    beneficios: [
      { tipo: "QUEIMA_GORDURA", intensidade: 4 },
      { tipo: "MELHORA_CARDIO", intensidade: 4 },
      { tipo: "DEFINE_MUSCULO", intensidade: 4 },
      { tipo: "QUEIMA_GORDURA_ABDOMINAL", intensidade: 5 }
    ],
    variacao_facil: "Mountain climbers lentos com pausa",
    variacao_dificil: "Mountain climbers com TRX ou BOSU"
  }
];
```

## Exercícios para Core e Abdome

```typescript
const exerciciosCore = [
  {
    nome: "Prancha",
    nome_alternativo: "Plank",
    categoria: "FORCA",
    grupos_musculares: ["CORE", "OMBROS", "GLUTEOS"],
    equipamento: ["NENHUM"],
    dificuldade: "INICIANTE",
    calorias_min: 3,
    tempo_execucao: 60,
    tempo_descanso: 60,
    descricao: "Exercício isométrico fundamental para fortalecimento do core e estabilização corporal.",
    instrucoes: [
      "Deite de bruços no chão",
      "Apoie-se nos antebraços e nos dedos dos pés",
      "Mantenha o corpo alinhado da cabeça aos calcanhares",
      "Contraia o abdome e respire normalmente",
      "Mantenha a posição pelo tempo determinado"
    ],
    dicas_tecnica: [
      "Mantenha o pescoço neutro, olhando para o chão",
      "Contraia glúteos e abdome simultaneamente",
      "Respire de forma controlada e constante",
      "Mantenha os ombros afastados das orelhas"
    ],
    erros_comuns: [
      "Levantar ou baixar demais o quadril",
      "Apoiar o peso nos ombros",
      "Prender a respiração",
      "Relaxar a musculatura do core"
    ],
    beneficios: [
      { tipo: "DEFINE_MUSCULO", intensidade: 5 },
      { tipo: "MELHORA_POSTURA", intensidade: 5 },
      { tipo: "AUMENTA_FORÇA", intensidade: 4 },
      { tipo: "QUEIMA_GORDURA_ABDOMINAL", intensidade: 3 }
    ],
    variacao_facil: "Prancha com apoio nos joelhos",
    variacao_dificil: "Prancha com elevação alternada de braços/pernas"
  },
  
  {
    nome: "Bicycle Crunches",
    nome_alternativo: "Bicicleta no Ar",
    categoria: "FORCA",
    grupos_musculares: ["CORE", "ABDOMEN"],
    equipamento: ["NENHUM"],
    dificuldade: "INTERMEDIARIO",
    calorias_min: 6,
    tempo_execucao: 45,
    tempo_descanso: 45,
    descricao: "Exercício dinâmico que trabalha reto abdominal e oblíquos simultaneamente.",
    instrucoes: [
      "Deite de costas com as mãos atrás da cabeça",
      "Eleve as pernas formando 90° no quadril e joelho",
      "Traga o cotovelo direito em direção ao joelho esquerdo",
      "Estenda a perna direita simultaneamente",
      "Alterne os lados em movimento contínuo"
    ],
    dicas_tecnica: [
      "Não puxe o pescoço com as mãos",
      "Mantenha a lombar apoiada no chão",
      "Contraia o abdome a cada movimento",
      "Movimento controlado, não muito rápido"
    ],
    erros_comuns: [
      "Puxar o pescoço com as mãos",
      "Movimento muito rápido perdendo controle",
      "Não tocar cotovelo no joelho oposto",
      "Apoiar os pés no chão durante o exercício"
    ],
    beneficios: [
      { tipo: "DEFINE_MUSCULO", intensidade: 5 },
      { tipo: "QUEIMA_GORDURA_ABDOMINAL", intensidade: 4 },
      { tipo: "AUMENTA_FORÇA", intensidade: 4 },
      { tipo: "MELHORA_CARDIO", intensidade: 2 }
    ],
    variacao_facil: "Bicycle crunches com pés apoiados",
    variacao_dificil: "Bicycle crunches com peso adicional"
  }
];
```

## Exercícios para Membros Superiores

```typescript
const exerciciosMembrosSuperiores = [
  {
    nome: "Flexão de Braços",
    nome_alternativo: "Push-up",
    categoria: "FORCA",
    grupos_musculares: ["PEITORAL", "TRICEPS", "OMBROS", "CORE"],
    equipamento: ["NENHUM"],
    dificuldade: "INTERMEDIARIO",
    calorias_min: 8,
    tempo_execucao: 30,
    tempo_descanso: 60,
    descricao: "Exercício clássico para desenvolvimento da parte superior do corpo e core.",
    instrucoes: [
      "Inicie na posição de prancha com braços estendidos",
      "Mãos na largura dos ombros, dedos apontando para frente",
      "Desça o corpo até o peito quase tocar o chão",
      "Suba empurrando o chão com as mãos",
      "Mantenha o corpo alinhado durante todo o movimento"
    ],
    dicas_tecnica: [
      "Mantenha o core contraído",
      "Desça de forma controlada",
      "Estenda completamente os braços na subida",
      "Mantenha a cabeça neutra"
    ],
    erros_comuns: [
      "Arqueamento excessivo das costas",
      "Não descer completamente",
      "Levantar o quadril",
      "Movimento parcial dos braços"
    ],
    beneficios: [
      { tipo: "AUMENTA_FORÇA", intensidade: 5 },
      { tipo: "DEFINE_MUSCULO", intensidade: 5 },
      { tipo: "GANHO_MASSA", intensidade: 4 },
      { tipo: "QUEIMA_GORDURA", intensidade: 3 }
    ],
    variacao_facil: "Flexão com apoio nos joelhos",
    variacao_dificil: "Flexão com uma mão ou com peso"
  },
  
  {
    nome: "Triceps Dips",
    nome_alternativo: "Mergulho para Tríceps",
    categoria: "FORCA",
    grupos_musculares: ["TRICEPS", "OMBROS", "PEITORAL"],
    equipamento: ["PESO_CORPORAL"],
    dificuldade: "INTERMEDIARIO",
    calorias_min: 7,
    tempo_execucao: 30,
    tempo_descanso: 60,
    descricao: "Exercício específico para fortalecimento dos tríceps utilizando o peso corporal.",
    instrucoes: [
      "Sente na borda de uma cadeira ou banco",
      "Apoie as mãos na borda, dedos para frente",
      "Deslize o corpo para frente, saindo da superfície",
      "Desça flexionando os cotovelos até 90°",
      "Suba empurrando com os tríceps"
    ],
    dicas_tecnica: [
      "Mantenha os cotovelos próximos ao corpo",
      "Desça apenas até onde conseguir subir",
      "Mantenha o tronco ereto",
      "Pés apoiados no chão para iniciantes"
    ],
    erros_comuns: [
      "Descer mais do que a capacidade",
      "Cotovelos muito abertos",
      "Usar impulso das pernas",
      "Não controlar a descida"
    ],
    beneficios: [
      { tipo: "DEFINE_MUSCULO", intensidade: 5 },
      { tipo: "AUMENTA_FORÇA", intensidade: 4 },
      { tipo: "GANHO_MASSA", intensidade: 3 },
      { tipo: "QUEIMA_GORDURA", intensidade: 2 }
    ],
    variacao_facil: "Dips com pés apoiados no chão",
    variacao_dificil: "Dips com pés elevados"
  }
];
```

## Exercícios para Membros Inferiores

```typescript
const exerciciosMembrosInferiores = [
  {
    nome: "Agachamento",
    nome_alternativo: "Squat",
    categoria: "FORCA",
    grupos_musculares: ["QUADRICEPS", "GLUTEOS", "ISQUIOTIBIAIS"],
    equipamento: ["NENHUM"],
    dificuldade: "INICIANTE",
    calorias_min: 10,
    tempo_execucao: 30,
    tempo_descanso: 60,
    descricao: "Exercício fundamental para desenvolvimento da musculatura dos membros inferiores.",
    instrucoes: [
      "Fique em pé com pés na largura dos ombros",
      "Pontas dos pés ligeiramente voltadas para fora",
      "Desça como se fosse sentar em uma cadeira",
      "Desça até as coxas ficarem paralelas ao chão",
      "Suba empurrando pelos calcanhares"
    ],
    dicas_tecnica: [
      "Mantenha o peso nos calcanhares",
      "Joelhos alinhados com a ponta dos pés",
      "Tronco ereto durante todo o movimento",
      "Desça de forma controlada"
    ],
    erros_comuns: [
      "Joelhos ultrapassarem muito a ponta dos pés",
      "Inclinar demais o tronco à frente",
      "Não descer até a paralela",
      "Perder o equilíbrio"
    ],
    beneficios: [
      { tipo: "AUMENTA_FORÇA", intensidade: 5 },
      { tipo: "GANHO_MASSA", intensidade: 5 },
      { tipo: "QUEIMA_GORDURA", intensidade: 4 },
      { tipo: "DEFINE_MUSCULO", intensidade: 4 }
    ],
    variacao_facil: "Agachamento com apoio na parede",
    variacao_dificil: "Agachamento com salto ou peso adicional"
  },
  
  {
    nome: "Lunges",
    nome_alternativo: "Afundo",
    categoria: "FORCA",
    grupos_musculares: ["QUADRICEPS", "GLUTEOS", "ISQUIOTIBIAIS"],
    equipamento: ["NENHUM"],
    dificuldade: "INTERMEDIARIO",
    calorias_min: 9,
    tempo_execucao: 30,
    tempo_descanso: 60,
    descricao: "Exercício unilateral excelente para força, equilíbrio e simetria muscular.",
    instrucoes: [
      "Fique em pé com os pés na largura dos quadris",
      "Dê um passo à frente com uma perna",
      "Desça flexionando ambos os joelhos até 90°",
      "O joelho de trás deve quase tocar o chão",
      "Volte à posição inicial e alterne as pernas"
    ],
    dicas_tecnica: [
      "Mantenha o tronco ereto",
      "O joelho da frente não deve ultrapassar a ponta do pé",
      "Distribua o peso entre as duas pernas",
      "Mantenha o core contraído"
    ],
    erros_comuns: [
      "Passo muito curto ou muito longo",
      "Inclinar o tronco à frente",
      "Apoiar todo peso na perna da frente",
      "Não descer completamente"
    ],
    beneficios: [
      { tipo: "AUMENTA_FORÇA", intensidade: 5 },
      { tipo: "DEFINE_MUSCULO", intensidade: 4 },
      { tipo: "MELHORA_POSTURA", intensidade: 4 },
      { tipo: "QUEIMA_GORDURA", intensidade: 3 }
    ],
    variacao_facil: "Lunges estáticos (sem alternar)",
    variacao_dificil: "Lunges com salto ou peso adicional"
  }
];
```

## Exercícios de Flexibilidade e Mobilidade

```typescript
const exerciciosFlexibilidade = [
  {
    nome: "Alongamento de Isquiotibiais",
    categoria: "FLEXIBILIDADE",
    grupos_musculares: ["ISQUIOTIBIAIS", "LOMBAR"],
    equipamento: ["NENHUM"],
    dificuldade: "INICIANTE",
    calorias_min: 2,
    tempo_execucao: 30,
    tempo_descanso: 0,
    descricao: "Alongamento fundamental para flexibilidade posterior da coxa e lombar.",
    instrucoes: [
      "Sente no chão com uma perna estendida",
      "Flexione a outra perna apoiando o pé na coxa",
      "Incline o tronco à frente sobre a perna estendida",
      "Mantenha a posição por 30 segundos",
      "Repita com a outra perna"
    ],
    dicas_tecnica: [
      "Movimento lento e progressivo",
      "Não force além do confortável",
      "Mantenha a respiração relaxada",
      "Foque na região que está alongando"
    ],
    erros_comuns: [
      "Forçar demais o alongamento",
      "Dobrar a perna que deveria estar estendida",
      "Prender a respiração",
      "Movimento brusco"
    ],
    beneficios: [
      { tipo: "MELHORA_FLEXIBILIDADE", intensidade: 5 },
      { tipo: "REDUZ_ESTRESSE", intensidade: 3 },
      { tipo: "MELHORA_POSTURA", intensidade: 3 }
    ],
    contraindicacoes: [
      "Lesões agudas nos isquiotibiais",
      "Problemas graves na lombar"
    ]
  }
];
```

## Script de Seed para o Banco

```typescript
// prisma/seeds/exercicios.seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedExercicios() {
  console.log('🏋️ Inserindo exercícios de HIIT...');
  
  for (const exercicio of exerciciosHIIT) {
    await prisma.exercicio.create({
      data: {
        nome: exercicio.nome,
        nome_alternativo: exercicio.nome_alternativo,
        categoria: exercicio.categoria,
        grupo_muscular: exercicio.grupos_musculares,
        equipamento: exercicio.equipamento,
        dificuldade: exercicio.dificuldade,
        calorias_min: exercicio.calorias_min,
        tempo_execucao: exercicio.tempo_execucao,
        tempo_descanso: exercicio.tempo_descanso,
        descricao: exercicio.descricao,
        instrucoes: exercicio.instrucoes,
        dicas_tecnica: exercicio.dicas_tecnica,
        erros_comuns: exercicio.erros_comuns,
        variacao_facil: exercicio.variacao_facil,
        variacao_dificil: exercicio.variacao_dificil,
        beneficios: {
          create: exercicio.beneficios.map(b => ({
            beneficio: b.tipo,
            intensidade: b.intensidade
          }))
        }
      }
    });
  }
  
  console.log('💪 Inserindo exercícios de Core...');
  // Repetir para outras categorias...
  
  console.log('✅ Seed de exercícios concluído!');
}

async function main() {
  try {
    await seedExercicios();
  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

## Comandos para Executar o Seed

```powershell
# Executar seed completo
npx tsx prisma/seeds/exercicios.seed.ts

# Verificar dados inseridos
npx prisma studio
```

---

💡 **Este banco de exercícios fornecerá uma base sólida para o sistema de recomendações inteligentes, com dados detalhados e estruturados para cada exercício!**
