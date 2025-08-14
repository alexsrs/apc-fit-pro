/**
 * Formulário de Dobras Cutâneas - Para Avaliações Iniciais
 * Componente específico para coleta de dobras cutâneas no fluxo de avaliação
 */

'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
// ...existing code...
import { 
  Save, 
  Calculator, 
  Info, 
  AlertCircle, 
  Ruler,
  Target,
  CheckCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import apiClient from '@/lib/api-client';

interface DobrasCutaneasFormProps {
  userId: string;
  dadosBasicos: {
    genero: 'masculino' | 'feminino';
    idade: number;
    peso: number;
  };
  onSuccess?: (dados: any) => void;
  protocoloInicial?: string;
  loading?: boolean;
}

interface MedidasDobras {
  triceps?: number;
  subescapular?: number;
  suprailiaca?: number;
  bicipital?: number;
  peitoral?: number;
  abdominal?: number;
  torax?: number;       // ← Adicionado para Pollock 7
  axilarmedia?: number; // ← Corrigido (sem "l" no meio)
  coxa?: number;
  biceps?: number;
  panturrilha?: number;
}

interface ResultadosCalculo {
  percentualGordura: number;
  massaGorda: number;
  massaMagra: number;
  massaMuscular: number;
  musculoEsqueletico: number;
  classificacao: string;
  densidadeCorporal?: number;
  somaTotal?: number;
  somaEquacao?: number;
}

// Configuração dos protocolos disponíveis
interface ProtocoloConfig {
  nome: string;
  dobras: string[] | { masculino: string[]; feminino: string[] };
  tempoMedio: string;
  descricao: string;
  idadeObrigatoria: boolean;
  faixaIdade?: [number, number];
  generos: string[];
}

const PROTOCOLOS_CONFIG: Record<string, ProtocoloConfig> = {
  faulkner: {
    nome: 'Faulkner',
    dobras: ['subescapular', 'triceps', 'abdominal', 'suprailiaca'],
    tempoMedio: '5 min',
    descricao: 'Protocolo clássico para população geral (4 dobras)',
    idadeObrigatoria: false,
    generos: ['masculino', 'feminino']
  },
  pollock3: {
    nome: 'Pollock 3 dobras',
    dobras: {
      masculino: ['peitoral', 'abdominal', 'coxa'],
      feminino: ['triceps', 'suprailiaca', 'coxa']
    },
    tempoMedio: '3 min',
    descricao: 'Protocolo rápido e eficaz',
    idadeObrigatoria: true,
    faixaIdade: [18, 61],
    generos: ['masculino', 'feminino']
  },
  pollock7: {
    nome: 'Pollock 7 dobras',
    dobras: ['triceps', 'subescapular', 'suprailiaca', 'abdominal', 'torax', 'axilarmedia', 'coxa'],
    tempoMedio: '8 min',
    descricao: 'Protocolo completo e preciso',
    idadeObrigatoria: true,
    faixaIdade: [18, 61],
    generos: ['masculino', 'feminino']
  },
  pollock9: {
    nome: 'Pollock 9 dobras (Atletas)',
    dobras: ['triceps', 'subescapular', 'suprailiaca', 'abdominal', 'torax', 'axilarmedia', 'coxa', 'biceps', 'panturrilha'],
    tempoMedio: '12 min',
    descricao: 'Protocolo específico para atletas',
    idadeObrigatoria: false,
    generos: ['masculino', 'feminino']
  },
  guedes: {
    nome: 'Guedes (População Brasileira)',
    dobras: {
      masculino: ['triceps', 'abdominal', 'suprailiaca'],
      feminino: ['subescapular', 'suprailiaca', 'coxa']
    },
    tempoMedio: '4 min',
    descricao: 'Protocolo adaptado para população brasileira (3 dobras)',
    idadeObrigatoria: true,
    faixaIdade: [15, 65],
    generos: ['masculino', 'feminino']
  }
};

// Informações detalhadas sobre cada dobra
const DOBRAS_INFO = {
  triceps: {
    nome: 'Tríceps',
    descricao: 'Face posterior do braço, ponto médio acrômio-olécrano (vertical)',
    localizacao: 'Braço posterior'
  },
  subescapular: {
    nome: 'Subescapular',
    descricao: 'Abaixo do ângulo inferior da escápula (oblíqua)',
    localizacao: 'Costas'
  },
  suprailiaca: {
    nome: 'Supra-ilíaca',
    descricao: 'Acima da crista ilíaca, linha axilar média (oblíqua)',
    localizacao: 'Lateral do tronco'
  },
  bicipital: {
    nome: 'Bicipital',
    descricao: 'Face anterior do braço sobre o ventre do bíceps (vertical)',
    localizacao: 'Braço anterior'
  },
  peitoral: {
    nome: 'Peitoral',
    descricao: 'Entre linha axilar anterior e mamilo (oblíqua)',
    localizacao: 'Peito'
  },
  torax: {
    nome: 'Tórax',
    descricao: 'Entre linha axilar anterior e mamilo (oblíqua) - sinônimo de peitoral',
    localizacao: 'Peito'
  },
  abdominal: {
    nome: 'Abdominal',
    descricao: '2cm à direita da cicatriz umbilical (vertical)',
    localizacao: 'Abdome'
  },
  axilarmedia: {
    nome: 'Axilar Média',
    descricao: 'Linha axilar média, altura do processo xifoide (vertical)',
    localizacao: 'Lateral do tronco'
  },
  coxa: {
    nome: 'Coxa',
    descricao: 'Face anterior, ponto médio entre prega inguinal e patela (vertical)',
    localizacao: 'Perna anterior'
  },
  biceps: {
    nome: 'Bíceps',
    descricao: 'Face anterior do braço sobre o ventre do bíceps (vertical)',
    localizacao: 'Braço anterior'
  },
  panturrilha: {
    nome: 'Panturrilha',
    descricao: 'Face medial na maior circunferência (vertical)',
    localizacao: 'Perna posterior'
  }
};

export function DobrasCutaneasForm({ 
  userId, 
  dadosBasicos, 
  onSuccess, 
  protocoloInicial = 'pollock3',
  loading = false 
}: DobrasCutaneasFormProps) {
  const [protocoloSelecionado, setProtocoloSelecionado] = useState(protocoloInicial);
  const [medidas, setMedidas] = useState<MedidasDobras>({});
  const [resultados, setResultados] = useState<ResultadosCalculo | null>(null);
  const [observacoes, setObservacoes] = useState('');
  const [calculando, setCalculando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showResultados, setShowResultados] = useState(false);

  // Obter configuração do protocolo atual
  const protocoloConfig = PROTOCOLOS_CONFIG[protocoloSelecionado];
  
  // Obter dobras necessárias para o protocolo (memoizado)
  const dobrasNecessarias: string[] = useMemo(() => {
    return Array.isArray(protocoloConfig.dobras)
      ? protocoloConfig.dobras
      : (protocoloConfig.dobras[dadosBasicos.genero] || []);
  }, [protocoloConfig, dadosBasicos.genero]);

  // Validar protocolo com dados do usuário
  const validarProtocolo = useCallback(() => {
    const erros: string[] = [];
    
    // Verificar idade se obrigatória
    if (protocoloConfig.idadeObrigatoria && protocoloConfig.faixaIdade) {
      const [idadeMin, idadeMax] = protocoloConfig.faixaIdade;
      if (dadosBasicos.idade < idadeMin || dadosBasicos.idade > idadeMax) {
        erros.push(`Protocolo ${protocoloConfig.nome} requer idade entre ${idadeMin}-${idadeMax} anos`);
      }
    }
    
    return erros;
  }, [protocoloConfig, dadosBasicos.idade]);

  // Validar medidas obrigatórias
  const validarMedidas = useCallback(() => {
    const erros: string[] = [];
    
    dobrasNecessarias.forEach(dobra => {
      const valor = medidas[dobra as keyof MedidasDobras];
      if (!valor || valor < 3 || valor > 50) {
        erros.push(`${DOBRAS_INFO[dobra as keyof typeof DOBRAS_INFO]?.nome} deve estar entre 3-50mm`);
      }
    });
    
    return erros;
  }, [dobrasNecessarias, medidas]);

  // Calcular resultados em tempo real
  const calcularResultados = useCallback(async () => {
    const errosValidacao = [...validarProtocolo(), ...validarMedidas()];
    if (errosValidacao.length > 0) {
      setErrors(errosValidacao);
      return;
    }

    setCalculando(true);
    setErrors([]);

    try {
      // Normalizar o protocolo para remover hífens (API espera sem hífen)
      const protocoloNormalizado = protocoloSelecionado.replace(/-/g, '');
      
      const payload = {
        protocolo: protocoloNormalizado,
        dadosPessoais: {
          genero: dadosBasicos.genero === 'masculino' ? 'M' : 'F',
          idade: dadosBasicos.idade,
          peso: dadosBasicos.peso
        },
        medidas: medidas
      };

      const response = await apiClient.post('/api/dobras-cutaneas/calcular', payload);
      setResultados(response.data);
      setShowResultados(true);
      
    } catch (error: any) {
      console.error('Erro ao calcular:', error);
      setErrors([error.response?.data?.message || 'Erro ao calcular resultados']);
    } finally {
      setCalculando(false);
    }
  }, [validarProtocolo, validarMedidas, protocoloSelecionado, dadosBasicos.genero, dadosBasicos.idade, dadosBasicos.peso, medidas]);

  // Salvar avaliação
  const salvarAvaliacao = async () => {
    if (!resultados) {
      setErrors(['Calcule os resultados antes de salvar']);
      return;
    }

    setSalvando(true);
    try {
      // Normalizar o protocolo para remover hífens (API espera sem hífen)
      const protocoloNormalizado = protocoloSelecionado.replace(/-/g, '');
      
      const payload = {
        userPerfilId: userId,
        protocolo: protocoloNormalizado,
        dadosPessoais: {
          genero: dadosBasicos.genero === 'masculino' ? 'M' : 'F',
          idade: dadosBasicos.idade,
          peso: dadosBasicos.peso
        },
        medidas: medidas,
        observacoes: observacoes
      };

      const response = await apiClient.post('/api/dobras-cutaneas', payload);
      
      onSuccess?.({
        ...response.data,
        resultados
      });

    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      setErrors([error.response?.data?.message || 'Erro ao salvar avaliação']);
    } finally {
      setSalvando(false);
    }
  };

  // Reset ao trocar protocolo
  useEffect(() => {
    setMedidas({});
    setResultados(null);
    setShowResultados(false);
    setErrors([]);
  }, [protocoloSelecionado]);

  // Auto-calcular quando medidas estão completas
  // useEffect ajustado conforme dependências necessárias
  useEffect(() => {
    const medidasCompletas = dobrasNecessarias.every(dobra => {
      const valor = medidas[dobra as keyof MedidasDobras];
      return valor && typeof valor === 'number' && valor >= 3 && valor <= 50;
    });

    if (medidasCompletas && !calculando) {
      const timer = setTimeout(() => {
        calcularResultados();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [medidas, protocoloSelecionado, calcularResultados, calculando, dobrasNecessarias]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Ruler className="h-6 w-6 text-green-600" />
        <h3 className="text-xl font-bold">Dobras Cutâneas</h3>
      </div>

      {/* Seleção de Protocolo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Protocolo de Avaliação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="protocolo">Selecione o Protocolo</Label>
            <Select value={protocoloSelecionado} onValueChange={setProtocoloSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um protocolo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PROTOCOLOS_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center justify-between w-full">
                      <span>{config.nome}</span>
                      <Badge variant="secondary" className="ml-2">
                        {config.tempoMedio}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Info do Protocolo */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-800">{protocoloConfig.nome}</span>
            </div>
            <p className="text-sm text-blue-700 mb-2">{protocoloConfig.descricao}</p>
            <div className="text-xs text-blue-600">
              <strong>Dobras necessárias:</strong> {dobrasNecessarias.length} dobras
              {protocoloConfig.idadeObrigatoria && protocoloConfig.faixaIdade && (
                <span className="ml-2">
                  <strong>Idade:</strong> {protocoloConfig.faixaIdade[0]}-{protocoloConfig.faixaIdade[1]} anos
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validação de Protocolo */}
      {validarProtocolo().length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {validarProtocolo().map((erro, index) => (
              <div key={index}>{erro}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Medidas das Dobras */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Medidas das Dobras Cutâneas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dobrasNecessarias.map((dobra) => {
              const dobraInfo = DOBRAS_INFO[dobra as keyof typeof DOBRAS_INFO] || {
                nome: dobra.charAt(0).toUpperCase() + dobra.slice(1),
                descricao: 'Descrição indisponível',
                localizacao: 'Local não especificado'
              };
              const valor = medidas[dobra as keyof MedidasDobras];
              const isValid = valor && typeof valor === 'number' && valor >= 3 && valor <= 50;
              
              return (
                <div key={dobra} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={dobra}>{dobraInfo.nome}</Label>
                    {isValid && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  
                  <Input
                    id={dobra}
                    type="number"
                    min="3"
                    max="50"
                    step="0.1"
                    value={valor}
                    onChange={(e) => setMedidas(prev => ({
                      ...prev,
                      [dobra]: parseFloat(e.target.value) || undefined
                    }))}
                    placeholder="mm"
                    className={!valor || isValid ? '' : 'border-red-500'}
                  />
                  
                  <div className="text-xs text-gray-600">
                    <div><strong>Local:</strong> {dobraInfo.localizacao}</div>
                    <div className="text-gray-500">{dobraInfo.descricao}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Botão de Cálculo */}
      <div className="flex justify-center">
        <Button 
          onClick={calcularResultados}
          disabled={calculando || dobrasNecessarias.some(dobra => !medidas[dobra as keyof MedidasDobras])}
          className="flex items-center gap-2"
        >
          {calculando ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Calculator className="w-4 h-4" />
          )}
          {calculando ? 'Calculando...' : 'Calcular Resultados'}
        </Button>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errors.map((erro, index) => (
              <div key={index}>{erro}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Resultados */}
      {showResultados && resultados && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Resultados Calculados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">
                  {resultados.percentualGordura.toFixed(1)}%
                </div>
                <div className="text-sm text-blue-600">% Gordura</div>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {resultados.massaMagra.toFixed(1)}kg
                </div>
                <div className="text-sm text-green-600">Massa Magra</div>
              </div>
              
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">
                  {resultados.massaMuscular.toFixed(1)}kg
                </div>
                <div className="text-sm text-purple-600">M. Muscular</div>
              </div>
              
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-700">
                  {resultados.classificacao}
                </div>
                <div className="text-sm text-orange-600">Classificação</div>
              </div>
            </div>

            {resultados.somaTotal && (
              <div className="text-center text-sm text-gray-600 mb-4">
                Soma das dobras: {resultados.somaTotal.toFixed(1)}mm
                {resultados.somaEquacao && resultados.somaEquacao !== resultados.somaTotal && (
                  <span className="ml-2">
                    (Equação: {resultados.somaEquacao.toFixed(1)}mm)
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Observações */}
      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações (Opcional)</Label>
        <Textarea
          id="observacoes"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Observações sobre a avaliação, condições especiais, etc."
          rows={3}
        />
      </div>

      {/* Botão de Salvar */}
      <div className="flex justify-end">
        <Button
          onClick={salvarAvaliacao}
          disabled={!resultados || salvando || loading}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {salvando ? 'Salvando...' : 'Salvar Avaliação'}
        </Button>
      </div>
    </div>
  );
}
