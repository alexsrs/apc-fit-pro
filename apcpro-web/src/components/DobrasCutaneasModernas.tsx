/**
 * Componente moderno de Dobras Cutâneas
 * Integrado com a nova API de protocolos independentes
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  DadosPessoais, 
  Medidas, 
  ProtocoloInfo 
} from '@/types/dobras-cutaneas';

interface DobrasCutaneasModernasProps {
  userPerfilId?: string;
  onResultado?: (resultado: AvaliacaoCompleta) => void;
  modoCalculoApenas?: boolean; // Se true, não salva no banco
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
  onResultado, 
  modoCalculoApenas = false,
  className 
}: DobrasCutaneasModernasProps) {
  // Estados principais
  const [protocolos, setProtocolos] = useState<ProtocoloInfo[]>([]);
  const [protocoloSelecionado, setProtocoloSelecionado] = useState<string>('');
  const [dadosPessoais, setDadosPessoais] = useState<DadosPessoais>({
    genero: 'M',
    peso: 70
  });
  const [medidas, setMedidas] = useState<Medidas>({});
  const [resultado, setResultado] = useState<AvaliacaoCompleta | null>(null);
  
  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [loadingProtocolos, setLoadingProtocolos] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [dobraAtiva, setDobraAtiva] = useState<string>('');

  // Carregar protocolos disponíveis
  useEffect(() => {
    carregarProtocolos();
  }, []);

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
    if (!dadosPessoais.peso || dadosPessoais.peso <= 0) return false;
    if (protocoloInfo?.requerIdade && (!dadosPessoais.idade || dadosPessoais.idade <= 0)) return false;
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

      {/* Dados Pessoais */}
      {protocoloSelecionado && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genero">Gênero</Label>
                <Select 
                  value={dadosPessoais.genero} 
                  onValueChange={(value: 'M' | 'F') => 
                    setDadosPessoais(prev => ({ ...prev, genero: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  min="1"
                  max="300"
                  value={dadosPessoais.peso || ''}
                  onChange={(e) => 
                    setDadosPessoais(prev => ({ ...prev, peso: parseFloat(e.target.value) || 0 }))
                  }
                  placeholder="Ex: 70.5"
                />
              </div>

              {protocoloInfo?.requerIdade && (
                <div className="space-y-2">
                  <Label htmlFor="idade">Idade (anos)</Label>
                  <Input
                    id="idade"
                    type="number"
                    min="1"
                    max="120"
                    value={dadosPessoais.idade || ''}
                    onChange={(e) => 
                      setDadosPessoais(prev => ({ ...prev, idade: parseInt(e.target.value) || undefined }))
                    }
                    placeholder="Ex: 25"
                    required
                  />
                </div>
              )}
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
              {protocoloInfo && protocoloInfo.dobrasNecessarias && protocoloInfo.dobrasNecessarias.length > 0 ? 
                protocoloInfo.dobrasNecessarias.map(dobra => {
                  const info = dobrasInfo[dobra as keyof typeof dobrasInfo];
                  const valor = medidas[dobra as keyof Medidas];
                  
                  if (!info) {
                    console.warn(`Informação não encontrada para dobra: ${dobra}`);
                    return null;
                  }
                  
                  return (
                    <div key={dobra} className="space-y-2">
                      <Label htmlFor={`medida-${dobra}`} className="flex items-center gap-2">
                        {info.nome}
                        <span className="text-xs text-muted-foreground">(mm)</span>
                        {valor && (
                          <Badge variant="outline" className="text-green-600 ml-auto">
                            {valor} mm
                          </Badge>
                        )}
                      </Label>
                      <Input
                        id={`medida-${dobra}`}
                        type="number"
                        step="0.1"
                        min="3"
                        max="50"
                        value={medidas[dobra as keyof Medidas] || ''}
                        onChange={(e) => atualizarMedida(dobra, e.target.value)}
                        onFocus={() => setDobraAtiva(dobra)}
                        onBlur={() => setDobraAtiva('')}
                        placeholder="3.0 - 50.0"
                        className={`transition-all ${dobraAtiva === dobra ? 'ring-2 ring-blue-500' : ''} ${valor ? 'border-green-300' : ''}`}
                      />
                      <p className="text-xs text-muted-foreground">
                        {info.descricao}
                      </p>
                    </div>
                  );
                }).filter(Boolean) : (
                  <div className="col-span-full text-center p-8 text-muted-foreground">
                    Selecione um protocolo para visualizar as medidas necessárias
                  </div>
                )
              }
            </div>
          </CardContent>
        </Card>
      )}

      {/* Erros */}
      {errors && errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Ações */}
      {protocoloSelecionado && (
        <Card>
          <CardContent className="flex justify-between items-center p-4">
            <div className="text-sm text-muted-foreground">
              {medidasCompletas() && dadosValidos() 
                ? '✅ Pronto para calcular' 
                : 'Preencha todos os campos obrigatórios'
              }
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={limpar}
                disabled={loading}
              >
                Limpar
              </Button>
              
              <Button 
                onClick={calcular}
                disabled={loading || !medidasCompletas() || !dadosValidos()}
                className="min-w-[120px]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Calculando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {modoCalculoApenas ? <Calculator className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                    <span>{modoCalculoApenas ? 'Calcular' : 'Calcular e Salvar'}</span>
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultados */}
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
                  {resultado.resultados.percentualGordura.toFixed(1)}%
                </div>
                <div className="text-sm text-blue-700">Percentual de Gordura</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {resultado.resultados.massaMagra.toFixed(1)}kg
                </div>
                <div className="text-sm text-green-700">Massa Magra</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {resultado.resultados.massaGorda.toFixed(1)}kg
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
                  <strong>Soma das dobras:</strong> {resultado.resultados.somaTotal.toFixed(1)}mm
                </div>
                {resultado.resultados.densidadeCorporal && (
                  <div>
                    <strong>Densidade corporal:</strong> {resultado.resultados.densidadeCorporal.toFixed(4)}g/cm³
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
