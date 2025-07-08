/**
 * Formulário de Alto Rendimento - Segunda etapa para atletas
 * Avaliação específica para atletas e praticantes de alto nível
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, AlertCircle, Trophy, Target, Zap, Timer, Medal, Activity } from 'lucide-react';

interface AltoRendimentoFormProps {
  onSalvar: (dados: any) => Promise<any>;
  dadosIniciais?: any;
  loading: boolean;
  dadosTriagem: any;
}

interface DadosAltoRendimento {
  // Modalidade esportiva
  modalidade: {
    esportePrincipal: string;
    posicao: string;
    tempoExperiencia: number;
    nivel: string;
    categoria: string;
  };
  
  // Histórico competitivo
  historicoCompetitivo: {
    competicoesRecentes: string;
    melhoResMarcas: string;
    lesoesPrevias: string;
    cirurgias: string;
    tempoAfastamento: string;
  };
  
  // Treinamento atual
  treinamentoAtual: {
    frequenciaSemanal: number;
    duracaoSessao: number;
    tipoTreinamento: string[];
    periodizacao: string;
    treinadorAtual: string;
  };
  
  // Testes físicos
  testesFisicos: {
    vo2max?: number;
    frequenciaCardiacaRepouso: number;
    frequenciaCardiacaMaxima?: number;
    testesRecentes: string;
    avaliacoesFuncionais: string;
  };
  
  // Recuperação
  recuperacao: {
    horasSono: number;
    qualidadeSono: string;
    metodosRecuperacao: string[];
    massagem: boolean;
    fisioterapia: boolean;
    suplementacao: string;
  };
  
  // Nutrição esportiva
  nutricaoEsportiva: {
    planAlimentar: boolean;
    nutricionista: boolean;
    suplementos: string;
    hidratacaoTreino: string;
    hidratacaoCompeticao: string;
  };
  
  // Aspectos psicológicos
  aspectosPsicologicos: {
    pressaoCompetitiva: string;
    motivacao: string;
    ansiedadePreCompeticao: string;
    acompanhamentoPsicologico: boolean;
  };
  
  // Objetivos específicos
  objetivosEspecificos: {
    metasPrincipal: string;
    prazoObjetivos: string;
    competicoesAlvo: string;
    aspectosMelhorar: string[];
  };
  
  // Observações técnicas
  observacoesTecnicas: string;
}

const niveisCompetitivos = [
  { value: 'iniciante', label: 'Iniciante' },
  { value: 'amador', label: 'Amador' },
  { value: 'federado', label: 'Federado' },
  { value: 'estadual', label: 'Estadual' },
  { value: 'nacional', label: 'Nacional' },
  { value: 'internacional', label: 'Internacional' },
  { value: 'profissional', label: 'Profissional' }
];

const tiposTreinamento = [
  'Resistência aeróbica',
  'Resistência anaeróbica',
  'Força máxima',
  'Força explosiva',
  'Potência',
  'Agilidade',
  'Coordenação',
  'Flexibilidade',
  'Técnico',
  'Tático'
];

const metodosRecuperacao = [
  'Massagem',
  'Fisioterapia',
  'Crioterapia',
  'Termoterapia',
  'Alongamento',
  'Yoga',
  'Meditação',
  'Banho de contraste',
  'Compressão pneumática',
  'Eletroestimulação'
];

const aspectosMelhorar = [
  'Resistência cardiovascular',
  'Força muscular',
  'Potência',
  'Velocidade',
  'Agilidade',
  'Coordenação',
  'Flexibilidade',
  'Equilíbrio',
  'Técnica',
  'Tática',
  'Concentração',
  'Resistência mental'
];

export function AltoRendimentoForm({ onSalvar, dadosIniciais, loading, dadosTriagem }: AltoRendimentoFormProps) {
  const [dados, setDados] = useState<DadosAltoRendimento>({
    modalidade: {
      esportePrincipal: '',
      posicao: '',
      tempoExperiencia: 0,
      nivel: '',
      categoria: ''
    },
    historicoCompetitivo: {
      competicoesRecentes: '',
      melhoResMarcas: '',
      lesoesPrevias: '',
      cirurgias: '',
      tempoAfastamento: ''
    },
    treinamentoAtual: {
      frequenciaSemanal: 5,
      duracaoSessao: 90,
      tipoTreinamento: [],
      periodizacao: '',
      treinadorAtual: ''
    },
    testesFisicos: {
      frequenciaCardiacaRepouso: 60,
      testesRecentes: '',
      avaliacoesFuncionais: ''
    },
    recuperacao: {
      horasSono: 8,
      qualidadeSono: '',
      metodosRecuperacao: [],
      massagem: false,
      fisioterapia: false,
      suplementacao: ''
    },
    nutricaoEsportiva: {
      planAlimentar: false,
      nutricionista: false,
      suplementos: '',
      hidratacaoTreino: '',
      hidratacaoCompeticao: ''
    },
    aspectosPsicologicos: {
      pressaoCompetitiva: '',
      motivacao: '',
      ansiedadePreCompeticao: '',
      acompanhamentoPsicologico: false
    },
    objetivosEspecificos: {
      metasPrincipal: '',
      prazoObjetivos: '',
      competicoesAlvo: '',
      aspectosMelhorar: []
    },
    observacoesTecnicas: ''
  });

  const [erros, setErros] = useState<string[]>([]);

  useEffect(() => {
    if (dadosIniciais) {
      setDados(dadosIniciais);
    }
  }, [dadosIniciais]);

  const handleChange = (secao: keyof DadosAltoRendimento, campo: string, valor: any) => {
    setDados(prev => ({
      ...prev,
      [secao]: {
        ...(prev[secao] as Record<string, any>),
        [campo]: valor
      }
    }));
    setErros([]);
  };

  const handleArrayChange = (secao: keyof DadosAltoRendimento, campo: string, item: string, checked: boolean) => {
    setDados(prev => {
      const secaoData = prev[secao] as Record<string, any>;
      const currentArray = secaoData[campo] as string[] || [];
      
      return {
        ...prev,
        [secao]: {
          ...secaoData,
          [campo]: checked 
            ? [...currentArray, item]
            : currentArray.filter(i => i !== item)
        }
      };
    });
  };

  const validarFormulario = () => {
    const novosErros = [];
    
    if (!dados.modalidade.esportePrincipal.trim()) {
      novosErros.push('Modalidade esportiva é obrigatória');
    }
    
    if (!dados.modalidade.nivel) {
      novosErros.push('Nível competitivo é obrigatório');
    }
    
    if (!dados.objetivosEspecificos.metasPrincipal.trim()) {
      novosErros.push('Metas principais são obrigatórias');
    }

    setErros(novosErros);
    return novosErros.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    try {
      const dadosCompletos = {
        ...dados,
        dataAvaliacao: new Date().toISOString(),
        dadosTriagemReferencia: dadosTriagem?.id || 'triagem-atual'
      };

      await onSalvar(dadosCompletos);
    } catch (error) {
      console.error('Erro ao salvar avaliação de alto rendimento:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Modalidade Esportiva */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Modalidade Esportiva
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="esporte-principal">Esporte Principal *</Label>
            <Input
              id="esporte-principal"
              placeholder="Ex: Futebol, Basquete, Natação..."
              value={dados.modalidade.esportePrincipal}
              onChange={(e) => handleChange('modalidade', 'esportePrincipal', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="posicao">Posição/Especialidade</Label>
            <Input
              id="posicao"
              placeholder="Ex: Atacante, Velocista, Goleiro..."
              value={dados.modalidade.posicao}
              onChange={(e) => handleChange('modalidade', 'posicao', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experiencia">Tempo de experiência (anos)</Label>
            <Input
              id="experiencia"
              type="number"
              min="0"
              max="50"
              value={dados.modalidade.tempoExperiencia}
              onChange={(e) => handleChange('modalidade', 'tempoExperiencia', parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nivel">Nível Competitivo *</Label>
            <Select 
              value={dados.modalidade.nivel} 
              onValueChange={(value) => handleChange('modalidade', 'nivel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent>
                {niveisCompetitivos.map(nivel => (
                  <SelectItem key={nivel.value} value={nivel.value}>
                    {nivel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Input
              id="categoria"
              placeholder="Ex: Sub-20, Adulto, Master..."
              value={dados.modalidade.categoria}
              onChange={(e) => handleChange('modalidade', 'categoria', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Treinamento Atual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Treinamento Atual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frequencia">Frequência semanal</Label>
              <Input
                id="frequencia"
                type="number"
                min="1"
                max="14"
                value={dados.treinamentoAtual.frequenciaSemanal}
                onChange={(e) => handleChange('treinamentoAtual', 'frequenciaSemanal', parseInt(e.target.value) || 5)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duracao">Duração da sessão (min)</Label>
              <Input
                id="duracao"
                type="number"
                min="30"
                max="300"
                value={dados.treinamentoAtual.duracaoSessao}
                onChange={(e) => handleChange('treinamentoAtual', 'duracaoSessao', parseInt(e.target.value) || 90)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="treinador">Treinador atual</Label>
              <Input
                id="treinador"
                placeholder="Nome do treinador"
                value={dados.treinamentoAtual.treinadorAtual}
                onChange={(e) => handleChange('treinamentoAtual', 'treinadorAtual', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Tipos de treinamento (marque todos que pratica)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {tiposTreinamento.map(tipo => (
                <div key={tipo} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tipo-${tipo}`}
                    checked={dados.treinamentoAtual.tipoTreinamento.includes(tipo)}
                    onCheckedChange={(checked) => handleArrayChange('treinamentoAtual', 'tipoTreinamento', tipo, checked as boolean)}
                  />
                  <Label htmlFor={`tipo-${tipo}`} className="text-sm">
                    {tipo}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="periodizacao">Periodização atual</Label>
            <Textarea
              id="periodizacao"
              placeholder="Descreva a periodização do treinamento..."
              value={dados.treinamentoAtual.periodizacao}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('treinamentoAtual', 'periodizacao', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Testes Físicos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Testes Físicos e Avaliações
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fc-repouso">FC Repouso (bpm)</Label>
            <Input
              id="fc-repouso"
              type="number"
              min="30"
              max="120"
              value={dados.testesFisicos.frequenciaCardiacaRepouso}
              onChange={(e) => handleChange('testesFisicos', 'frequenciaCardiacaRepouso', parseInt(e.target.value) || 60)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fc-maxima">FC Máxima (bpm)</Label>
            <Input
              id="fc-maxima"
              type="number"
              min="120"
              max="220"
              value={dados.testesFisicos.frequenciaCardiacaMaxima || ''}
              onChange={(e) => handleChange('testesFisicos', 'frequenciaCardiacaMaxima', parseInt(e.target.value) || undefined)}
              placeholder="Se conhecida"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vo2max">VO2 Máx (ml/kg/min)</Label>
            <Input
              id="vo2max"
              type="number"
              step="0.1"
              min="20"
              max="90"
              value={dados.testesFisicos.vo2max || ''}
              onChange={(e) => handleChange('testesFisicos', 'vo2max', parseFloat(e.target.value) || undefined)}
              placeholder="Se avaliado"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="testes-recentes">Testes recentes</Label>
            <Textarea
              id="testes-recentes"
              placeholder="Descreva testes físicos realizados..."
              value={dados.testesFisicos.testesRecentes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('testesFisicos', 'testesRecentes', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recuperação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Recuperação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="horas-sono-alto">Horas de sono</Label>
              <Input
                id="horas-sono-alto"
                type="number"
                min="4"
                max="12"
                step="0.5"
                value={dados.recuperacao.horasSono}
                onChange={(e) => handleChange('recuperacao', 'horasSono', parseFloat(e.target.value) || 8)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="massagem-regular"
                checked={dados.recuperacao.massagem}
                onCheckedChange={(checked) => handleChange('recuperacao', 'massagem', checked)}
              />
              <Label htmlFor="massagem-regular">Massagem regular</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fisioterapia-regular"
                checked={dados.recuperacao.fisioterapia}
                onCheckedChange={(checked) => handleChange('recuperacao', 'fisioterapia', checked)}
              />
              <Label htmlFor="fisioterapia-regular">Fisioterapia</Label>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Métodos de recuperação utilizados</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {metodosRecuperacao.map(metodo => (
                <div key={metodo} className="flex items-center space-x-2">
                  <Checkbox
                    id={`metodo-${metodo}`}
                    checked={dados.recuperacao.metodosRecuperacao.includes(metodo)}
                    onCheckedChange={(checked) => handleArrayChange('recuperacao', 'metodosRecuperacao', metodo, checked as boolean)}
                  />
                  <Label htmlFor={`metodo-${metodo}`} className="text-sm">
                    {metodo}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Objetivos Específicos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Objetivos Específicos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metas-principal">Metas principais *</Label>
            <Textarea
              id="metas-principal"
              placeholder="Descreva as principais metas esportivas..."
              value={dados.objetivosEspecificos.metasPrincipal}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('objetivosEspecificos', 'metasPrincipal', e.target.value)}
              rows={3}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prazo-objetivos">Prazo para objetivos</Label>
              <Input
                id="prazo-objetivos"
                placeholder="Ex: 6 meses, 1 ano..."
                value={dados.objetivosEspecificos.prazoObjetivos}
                onChange={(e) => handleChange('objetivosEspecificos', 'prazoObjetivos', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="competicoes-alvo">Competições alvo</Label>
              <Input
                id="competicoes-alvo"
                placeholder="Competições importantes..."
                value={dados.objetivosEspecificos.competicoesAlvo}
                onChange={(e) => handleChange('objetivosEspecificos', 'competicoesAlvo', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Aspectos a melhorar</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {aspectosMelhorar.map(aspecto => (
                <div key={aspecto} className="flex items-center space-x-2">
                  <Checkbox
                    id={`aspecto-${aspecto}`}
                    checked={dados.objetivosEspecificos.aspectosMelhorar.includes(aspecto)}
                    onCheckedChange={(checked) => handleArrayChange('objetivosEspecificos', 'aspectosMelhorar', aspecto, checked as boolean)}
                  />
                  <Label htmlFor={`aspecto-${aspecto}`} className="text-sm">
                    {aspecto}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observações Técnicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Medal className="h-5 w-5" />
            Observações Técnicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="observacoes-tecnicas">Observações e recomendações técnicas</Label>
            <Textarea
              id="observacoes-tecnicas"
              placeholder="Observações importantes para o treinamento específico..."
              value={dados.observacoesTecnicas}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDados(prev => ({ ...prev, observacoesTecnicas: e.target.value }))}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Erros */}
      {erros.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {erros.map((erro, index) => (
                <li key={index}>{erro}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Botão de salvar */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="flex items-center gap-2">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Save className="h-4 w-4" />
          )}
          {loading ? 'Salvando...' : 'Salvar Avaliação'}
        </Button>
      </div>
    </form>
  );
}
