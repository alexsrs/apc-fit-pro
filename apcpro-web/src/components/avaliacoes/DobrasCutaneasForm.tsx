"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Calculator, Save } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface DobrasCutaneasFormProps {
  userId: string;
  idade: number;
  genero?: string;
  onSuccess?: () => void;
  initialData?: any;
}

interface ProtocoloInfo {
  id: string;
  nome: string;
  idade_min: number;
  idade_max: number;
  genero: string;
  populacao: string;
  dobras_utilizadas: string[];
  descricao: string;
  referencia: string;
}

interface DadosPessoais {
  nome?: string;
  idade: number;
  genero?: string;
  peso?: number;
  altura?: number;
  email?: string;
  dataAvaliacao?: string;
}

interface Medidas {
  triceps?: number;
  biceps?: number;
  subescapular?: number;
  suprailiaca?: number;
  abdominal?: number;
  coxa?: number;
  panturrilha?: number;
  axilar_media?: number;
  peitoral?: number;
  [key: string]: number | undefined;
}

interface Resultado {
  densidade_corporal?: number;
  percentual_gordura?: number;
  massa_gorda?: number;
  massa_magra?: number;
  imc?: number;
  classificacao?: string;
  protocolo_utilizado?: string;
  observacoes?: string;
}

export function DobrasCutaneasForm({
  userId,
  idade,
  genero,
  onSuccess,
  initialData
}: DobrasCutaneasFormProps) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [protocolos, setProtocolos] = useState<ProtocoloInfo[]>([]);
  const [protocoloSelecionado, setProtocoloSelecionado] = useState<string>('');
  const [dadosPessoais, setDadosPessoais] = useState<DadosPessoais>({
    idade,
    genero,
    peso: initialData?.peso || 0,
    altura: initialData?.altura || 0
  });

  // Buscar peso/altura da última avaliação, gênero/idade/email do perfil e data da avaliação
  useEffect(() => {
    const fetchDadosPessoais = async () => {
      try {
        // Busca peso/altura da última avaliação do tipo "medidas"
        const avalResponse = await apiClient.get(`/api/avaliacoes/${userId}`);
        let peso = dadosPessoais.peso;
        let altura = dadosPessoais.altura;
        let dataAvaliacao = "";
        if (avalResponse.data && avalResponse.data.length > 0) {
          const ultimaMedidas = avalResponse.data.find((a: any) => a.tipo === "medidas");
          if (ultimaMedidas) {
            peso = ultimaMedidas.medidas?.peso ?? peso;
            altura = ultimaMedidas.medidas?.altura ?? altura;
            if (ultimaMedidas.data) {
              dataAvaliacao = new Date(ultimaMedidas.data).toLocaleDateString('pt-BR');
            }
          }
        }
        // Busca gênero, dataNascimento e email do perfil
        const perfilResponse = await apiClient.get(`/api/${userId}/profile`);
        let genero = dadosPessoais.genero;
        let idade = dadosPessoais.idade;
        let email = "";
        if (perfilResponse.data) {
          genero = perfilResponse.data.genero ?? genero;
          email = perfilResponse.data.email ?? "";
          // Calcula idade a partir da dataNascimento
          if (perfilResponse.data.dataNascimento) {
            const nascimento = new Date(perfilResponse.data.dataNascimento);
            const hoje = new Date();
            idade = hoje.getFullYear() - nascimento.getFullYear();
            const m = hoje.getMonth() - nascimento.getMonth();
            if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
              idade--;
            }
          }
        }
        setDadosPessoais(prev => ({
          ...prev,
          peso,
          altura,
          genero,
          idade,
          email,
          dataAvaliacao
        }));
      } catch (error) {
        console.error('Erro ao buscar dados pessoais:', error);
      }
    };
    fetchDadosPessoais();
  }, [userId]);
  const [medidas, setMedidas] = useState<Medidas>({});
  const [resultado, setResultado] = useState<Resultado | null>(null);

  // Carregar protocolos disponíveis
  useEffect(() => {
    const carregarProtocolos = async () => {
      try {
        const response = await apiClient.get('/api/dobras-cutaneas/protocolos');
        setProtocolos(response.data || []);
      } catch (error) {
        console.error('Erro ao carregar protocolos:', error);
        setErro('Erro ao carregar protocolos de dobras cutâneas');
      }
    };
    carregarProtocolos();
  }, []);

  // Filtrar protocolos compatíveis
  const protocolosCompativeis = protocolos.filter(p => {
    const idadeCompativel = idade >= p.idade_min && idade <= p.idade_max;
    const generoCompativel = !genero || p.genero === 'ambos' || p.genero.toLowerCase() === genero.toLowerCase();
    return idadeCompativel && generoCompativel;
  });

  const handleInputChange = (field: string, value: string | number) => {
    setMedidas(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }));
  };

  const calcularResultado = async () => {
    if (!protocoloSelecionado) {
      setErro('Selecione um protocolo para calcular');
      return;
    }

    const protocolo = protocolos.find(p => p.id === protocoloSelecionado);
    if (!protocolo) {
      setErro('Protocolo não encontrado');
      return;
    }

    // Verificar se todas as dobras necessárias foram preenchidas
    const dobrasNecessarias = protocolo.dobras_utilizadas;
    const dobrasPreenchidas = dobrasNecessarias.filter(dobra => 
      medidas[dobra] && medidas[dobra]! > 0
    );

    if (dobrasPreenchidas.length !== dobrasNecessarias.length) {
      setErro(`Preencha todas as dobras necessárias: ${dobrasNecessarias.join(', ')}`);
      return;
    }

    setLoading(true);
    setErro(null);
    try {
      const payload = {
        protocolo_id: protocoloSelecionado,
        dados_pessoais: dadosPessoais,
        medidas: medidas
      };

      const response = await apiClient.post('/api/dobras-cutaneas/calcular', payload);
      setResultado(response.data);
    } catch (error) {
      console.error('Erro ao calcular:', error);
      setErro('Erro ao calcular resultado');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!resultado) {
      setErro('Calcule o resultado antes de salvar');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        userPerfilId: userId,
        protocoloId: protocoloSelecionado,
        medidas: medidas,
        resultado: resultado
      };

      await apiClient.post('/api/dobras-cutaneas', payload);
      alert('Dobras cutâneas salvas com sucesso!');
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar dobras:', error);
      setErro('Erro ao salvar dobras cutâneas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const protocolo = protocolos.find(p => p.id === protocoloSelecionado);
  const dobrasNecessarias = protocolo?.dobras_utilizadas || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold">Dobras Cutâneas</h3>
      </div>

      {/* Card Medidas Corporais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Medidas Corporais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data da Avaliação</Label>
              <div className="text-sm text-gray-700">{dadosPessoais.dataAvaliacao || '-'}</div>
            </div>
            <div>
              <Label>Email</Label>
              <div className="text-sm text-gray-700">{dadosPessoais.email || '-'}</div>
            </div>
            <div>
              <Label>Peso</Label>
              <div className="text-sm text-gray-700">{dadosPessoais.peso ? `${dadosPessoais.peso} kg` : '-'}</div>
            </div>
            <div>
              <Label>Altura</Label>
              <div className="text-sm text-gray-700">{dadosPessoais.altura ? `${dadosPessoais.altura} cm` : '-'}</div>
            </div>
            <div>
              <Label>Idade</Label>
              <div className="text-sm text-gray-700">{dadosPessoais.idade || '-'}</div>
            </div>
            <div>
              <Label>Gênero</Label>
              <div className="text-sm text-gray-700">{dadosPessoais.genero || '-'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seleção do protocolo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Protocolo de Avaliação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="protocolo">Protocolo *</Label>
              <Select 
                value={protocoloSelecionado} 
                onValueChange={setProtocoloSelecionado}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um protocolo..." />
                </SelectTrigger>
                <SelectContent>
                  {protocolosCompativeis.map(protocolo => (
                    <SelectItem key={protocolo.id} value={protocolo.id}>
                      {protocolo.nome} - {protocolo.populacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {protocolo && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium">Dobras utilizadas:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {protocolo.dobras_utilizadas.map(dobra => (
                    <Badge key={dobra} variant="secondary">
                      {dobra.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Medidas das dobras */}
      {protocolo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Medidas das Dobras (mm)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {dobrasNecessarias.map(dobra => (
                <div key={dobra}>
                  <Label htmlFor={dobra}>
                    {dobra.replace('_', ' ').toUpperCase()}
                  </Label>
                  <Input
                    id={dobra}
                    type="number"
                    step="0.1"
                    value={medidas[dobra] || ""}
                    onChange={(e) => handleInputChange(dobra, e.target.value)}
                    placeholder="Ex: 12.5"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultado */}
      {resultado && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resultado da Avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Percentual de Gordura</Label>
                <div className="text-2xl font-bold text-blue-600">
                  {resultado.percentual_gordura?.toFixed(1)}%
                </div>
              </div>
              <div>
                <Label>Classificação</Label>
                <Badge className="mt-1">
                  {resultado.classificacao}
                </Badge>
              </div>
              <div>
                <Label>Massa Gorda (kg)</Label>
                <div className="text-lg font-semibold">
                  {resultado.massa_gorda?.toFixed(1)} kg
                </div>
              </div>
              <div>
                <Label>Massa Magra (kg)</Label>
                <div className="text-lg font-semibold">
                  {resultado.massa_magra?.toFixed(1)} kg
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exibição de erro */}
      {erro && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}

      {/* Botões de ação */}
      <div className="flex justify-between">
        <Button
          onClick={calcularResultado}
          disabled={loading || !protocoloSelecionado}
          variant="outline"
        >
          <Calculator className="h-4 w-4 mr-2" />
          {loading ? "Calculando..." : "Calcular"}
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading || !resultado}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {loading ? "Salvando..." : "Salvar Dobras"}
        </Button>
      </div>
    </div>
  );
}
