/**
 * Componente moderno de Dobras Cutâneas
 * Integrado com a nova API de protocolos independentes
 */

import React, { useState, useEffect } from 'react';

import { calcularIdade } from '@/utils/idade';
// ...existing code...



import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Calculator, Save, Users, Target, Clock } from 'lucide-react';
import apiClient from '@/lib/api-client';
import type { 
  AvaliacaoCompleta, 
  Medidas, 
  ProtocoloInfo 
} from '@/types/dobras-cutaneas';

// Unificação: garantir que DadosPessoais tenha todos os campos necessários
// ...existing code...

// Unificação: garantir que DadosPessoais tenha todos os campos necessários
interface DadosPessoais {
  genero: string;
  peso: string;
  idade: string;
  altura: string;
  dataNascimento?: string;
  nome?: string;
  image?: string;
}

// Props do componente DobrasCutaneasModernas
interface AlunoBasic {
  id: string;
  dataNascimento?: string;
  name?: string;
  genero?: string;
  image?: string;
}

interface DobrasCutaneasModernasProps {
  userPerfilId: string;
  aluno?: AlunoBasic;
  onResultado: (resultado: any) => void;
  modoCalculoApenas?: boolean;
  className?: string;
}

const dobrasInfo = {
  triceps: {
    nome: 'Tríceps',
    descricao: 'Dobra vertical na face posterior do braço, no ponto médio entre o acrômio e o olécrano'
  },
  subescapular: {
    nome: 'Subescapular', 
    descricao: 'Dobra oblíqua logo abaixo do ângulo inferior da escápula'
  },
  suprailiaca: {
    nome: 'Supra-ilíaca',
    descricao: 'Dobra oblíqua imediatamente acima da crista ilíaca anterossuperior'
  },
  bicipital: {
    nome: 'Bicipital',
    descricao: 'Dobra vertical na face anterior do braço, sobre o músculo bíceps'
  },
  peitoral: {
    nome: 'Peitoral',
    descricao: 'Dobra diagonal no peito, entre a linha axilar anterior e o mamilo'
  },
  abdominal: {
    nome: 'Abdominal',
    descricao: 'Dobra vertical ao lado do umbigo, aproximadamente 2 cm lateralmente'
  },
  axilarMedia: {
    nome: 'Axilar Média',
    descricao: 'Dobra vertical na linha axilar média, ao nível do processo xifoide'
  },
  coxa: {
    nome: 'Coxa',
    descricao: 'Dobra vertical na face anterior da coxa, no ponto médio'
  },
  biceps: {
    nome: 'Bíceps',
    descricao: 'Dobra vertical sobre o ponto de maior volume do músculo bíceps'
  },
  panturrilha: {
    nome: 'Panturrilha',
    descricao: 'Dobra vertical na face medial da panturrilha, no nível de maior circunferência'
  }
};

export function DobrasCutaneasModernas({ 
  userPerfilId,
  aluno,
  onResultado,
  modoCalculoApenas = false,
  className
}: DobrasCutaneasModernasProps) {
  // Estados principais
  const [protocolos, setProtocolos] = useState<ProtocoloInfo[]>([]);
  const [protocoloSelecionado, setProtocoloSelecionado] = useState<string>('');
  const [dadosPessoais, setDadosPessoais] = useState<DadosPessoais>({
    genero: '-',
    idade: '-',
    peso: '-',
    altura: '-'
  });
  const [medidas, setMedidas] = useState<Medidas>({});
  const [resultado, setResultado] = useState<AvaliacaoCompleta | null>(null);
  
  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [loadingProtocolos, setLoadingProtocolos] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [dobraAtiva, setDobraAtiva] = useState<string>('');

  // Carregar protocolos disponíveis apenas uma vez ao montar o componente
  useEffect(() => {
    carregarProtocolos();
  }, []);

  // Validação: garantir que o ID passado é de aluno, não de professor
  useEffect(() => {
    if (!userPerfilId || typeof userPerfilId !== 'string' || userPerfilId.startsWith('prof') || userPerfilId.startsWith('personal')) {
      setErrors(["Selecione um aluno válido para realizar a avaliação física. O ID informado não corresponde a um aluno."]);
      setDadosPessoais({ genero: '-', idade: '-', peso: '-', altura: '-' });
      return;
    }
    carregarDadosPessoais();
  }, [userPerfilId]);

  // Função para buscar dados pessoais do aluno: gênero e idade do perfil, peso/altura da avaliação
  const carregarDadosPessoais = async () => {
    if (!userPerfilId) {
      setErrors(["ID do aluno não informado. Não é possível buscar dados pessoais."]);
      setDadosPessoais({ genero: '-', idade: '-', peso: '-', altura: '-' });
      return;
    }
    // Sempre prioriza a prop aluno se o id bater
    if (aluno && aluno.id === userPerfilId) {
      let genero = '-';
      if (aluno.genero) {
        if (aluno.genero.toLowerCase() === 'masculino' || aluno.genero.toLowerCase() === 'm') {
          genero = 'M';
        } else if (aluno.genero.toLowerCase() === 'feminino' || aluno.genero.toLowerCase() === 'f') {
          genero = 'F';
        } else {
          genero = '-';
        }
      }
      // Calcular idade a partir da dataNascimento, se disponível
      let idade = '-';
      if (aluno.dataNascimento) {
        idade = String(calcularIdade(aluno.dataNascimento));
      }
      setDadosPessoais(prev => ({
        ...prev,
        dataNascimento: aluno.dataNascimento ?? '-',
        nome: aluno.name ?? '-',
        genero,
        image: aluno.image ?? '-',
        idade
      }));
      return;
    }
    // Se não houver prop aluno válida, limpa os dados pessoais
    setDadosPessoais({ genero: '-', idade: '-', peso: '-', altura: '-' });
    setErrors(["Dados do aluno não encontrados. Verifique se a prop 'aluno' está sendo passada corretamente."]);
  };

  const carregarProtocolos = async () => {
    try {
      const response = await apiClient.get('/api/dobras-cutaneas/protocolos');
      const data = response.data?.data || [];
      
      // Verificar se os dados são válidos
      if (Array.isArray(data)) {
        setProtocolos(data);
      } else {
        console.error('Dados de protocolos inválidos:', data);
        setErrors(['Formato de dados de protocolos inválido']);
        setProtocolos([]);
      }
      setLoadingProtocolos(false);
    } catch (error) {
      console.error('Erro ao carregar protocolos:', error);
      setErrors(['Erro ao carregar protocolos disponíveis']);
      setProtocolos([]);
      setLoadingProtocolos(false);
    }
  };

  // Obter informações do protocolo selecionado
  const protocoloInfo = protocolos.find(p => p.id === protocoloSelecionado);

  // Validar se todas as medidas necessárias foram preenchidas
  const medidasCompletas = () => {
    if (!protocoloInfo) return false;
    
    return protocoloInfo.dobrasNecessarias.every(dobra => {
      const valor = medidas[dobra as keyof Medidas];
      return valor && valor > 0;
    });
  };

  // Validar dados pessoais
  const dadosValidos = () => {
    if (dadosPessoais.peso === '-' || Number(dadosPessoais.peso) <= 0) return false;
    if (protocoloInfo?.requerIdade && (dadosPessoais.idade === '-' || Number(dadosPessoais.idade) <= 0)) return false;
    return true;
  };

  // Atualizar medida
  const atualizarMedida = (dobra: string, valor: string) => {
    const numeroValor = valor ? parseFloat(valor) : undefined;
    setMedidas(prev => ({
      ...prev,
      [dobra]: numeroValor
    }));
    setErrors([]);
  };

  // Calcular protocolo
  const calcular = async () => {
    if (!protocoloSelecionado || !dadosValidos() || !medidasCompletas()) {
      setErrors(['Preencha todos os dados obrigatórios antes de calcular']);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      const payload = {
        userPerfilId: userPerfilId || 'temp-user',
        protocolo: protocoloSelecionado,
        dadosPessoais,
        medidas,
        observacoes: `Avaliação realizada em ${new Date().toLocaleDateString()}`
      };

      const endpoint = modoCalculoApenas ? '/api/dobras-cutaneas/calcular' : '/api/dobras-cutaneas';
      const response = await apiClient.post(endpoint, payload);

      const avaliacaoCompleta = response.data.data;
      setResultado(avaliacaoCompleta);
      
      if (onResultado) {
        onResultado(avaliacaoCompleta);
      }

    } catch (error: unknown) {
      console.error('Erro ao calcular:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erro ao realizar cálculo';
      setErrors([errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Limpar formulário
  const limpar = () => {
    setMedidas({});
    setResultado(null);
    setErrors([]);
    setDobraAtiva('');
  };

  if (loadingProtocolos) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Carregando protocolos...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Seleção do Protocolo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Protocolo de Avaliação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="protocolo">Protocolo</Label>
              <Select value={protocoloSelecionado} onValueChange={setProtocoloSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um protocolo" />
                </SelectTrigger>
                <SelectContent>
                  {protocolos && protocolos.length > 0 ? protocolos.map(protocolo => (
                    <SelectItem key={protocolo.id} value={protocolo.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{protocolo.nome}</span>
                        <span className="text-xs text-muted-foreground">
                          {protocolo.numDobras} dobras • {protocolo.tempoMedio}
                        </span>
                      </div>
                    </SelectItem>
                  )) : (
                    <SelectItem value="none" disabled>
                      Nenhum protocolo disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {protocoloInfo && (
              <div className="space-y-2">
                <Label>Informações do Protocolo</Label>
                <div className="p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="font-medium">{protocoloInfo.nome}</p>
                  <p className="text-blue-700">{protocoloInfo.descricao}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {protocoloInfo.tempoMedio}
                    </Badge>
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      {protocoloInfo.recomendado}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dados Pessoais do Aluno */}
      {protocoloSelecionado && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Dados do Aluno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Gênero</Label>
              <div className="text-sm text-gray-700">{dadosPessoais.genero === 'M' ? 'Masculino' : dadosPessoais.genero === 'F' ? 'Feminino' : '-'}</div>
              </div>
              <div>
                <Label>Peso</Label>
              <div className="text-sm text-gray-700">{dadosPessoais.peso !== '-' ? `${dadosPessoais.peso} kg` : '-'}</div>
              </div>
              <div>
                <Label>Idade</Label>
              <div className="text-sm text-gray-700">{dadosPessoais.idade !== '-' ? dadosPessoais.idade : '-'}</div>
              </div>
              <div>
                <Label>Altura</Label>
              <div className="text-sm text-gray-700">{dadosPessoais.altura !== '-' ? `${dadosPessoais.altura} cm` : '-'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medidas das Dobras */}
      {protocoloSelecionado && protocoloInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Medidas das Dobras Cutâneas
              <span className="text-sm text-muted-foreground ml-auto">
                {Object.keys(medidas).filter(k => medidas[k as keyof Medidas]).length}/{protocoloInfo.numDobras}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {protocoloInfo && protocoloInfo.dobrasNecessarias && protocoloInfo.dobrasNecessarias.length > 0 && (
                <>
                  {protocoloInfo.dobrasNecessarias.map(dobra => {
                    const info = dobrasInfo[dobra as keyof typeof dobrasInfo];
                    const valor = medidas[dobra as keyof Medidas];
                    if (!info) {
                      console.warn(`Informação não encontrada para dobra: ${dobra}`);
                      return null;
                    }
                    return (
                      <div key={dobra} className="space-y-2">
                        <Label htmlFor={dobra}>{info.nome}</Label>
                        <div className="text-xs text-muted-foreground mb-1">{info.descricao}</div>
                        <Input
                          id={dobra}
                          type="number"
                          min={0}
                          step={0.1}
                          value={valor ?? ''}
                          onChange={e => atualizarMedida(dobra, e.target.value)}
                          placeholder="mm"
                          className="w-full"
                          aria-label={`Valor da dobra ${info.nome}`}
                        />
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultado */}
      {resultado && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Resultado da Avaliação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {resultado.resultados.percentualGordura?.toFixed(1)}%
                </div>
                <div className="text-sm text-blue-700">Percentual de Gordura</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {resultado.resultados.massaMagra?.toFixed(1)}kg
                </div>
                <div className="text-sm text-green-700">Massa Magra</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {resultado.resultados.massaGorda?.toFixed(1)}kg
                </div>
                <div className="text-sm text-orange-700">Massa Gorda</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">
                  {resultado.resultados.classificacao}
                </div>
                <div className="text-sm text-purple-700">Classificação</div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Detalhes da Avaliação</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Protocolo:</strong> {resultado.metadata.validadeFormula}
                </div>
                <div>
                  <strong>Data:</strong> {new Date(resultado.metadata.dataAvaliacao).toLocaleDateString()}
                </div>
                <div>
                  <strong>Soma das dobras:</strong> {resultado.resultados.somaTotal?.toFixed(1)}mm
                </div>
                {resultado.resultados.densidadeCorporal && (
                  <div>
                    <strong>Densidade corporal:</strong> {resultado.resultados.densidadeCorporal?.toFixed(4)}g/cm³
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exibição de erro */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.join(' | ')}</AlertDescription>
        </Alert>
      )}

      {/* Botões de ação */}
      <div className="flex justify-between">
        <Button
          onClick={calcular}
          disabled={loading || !protocoloSelecionado}
          variant="outline"
        >
          <Calculator className="h-4 w-4 mr-2" />
          {loading ? "Calculando..." : "Calcular"}
        </Button>
        <Button
          onClick={limpar}
          disabled={loading}
          variant="ghost"
        >
          Limpar
        </Button>
      </div>
    </div>
  );
}

