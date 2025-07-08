/**
 * Formulário de Triagem - Primeira etapa obrigatória
 * Avaliação inicial básica do aluno
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, AlertCircle, Heart, Activity, Target } from 'lucide-react';
import { Textarea } from '../ui/textarea';

interface TriagemFormProps {
  onSalvar: (dados: any) => Promise<any>;
  dadosIniciais?: any;
  loading: boolean;
  idade: number;
  dataNascimento: string;
}

interface DadosTriagem {
  // Dados básicos
  peso: number;
  altura: number;
  nivelAtividade: string;
  objetivo: string;
  
  // Histórico básico de saúde
  problemasSaude: string[];
  medicamentos: string;
  lesoes: string;
  
  // Limitações
  limitacoesFisicas: string;
  
  // Observações
  observacoes: string;
  
  // Questionário PAR-Q simplificado
  parq: {
    problemasCardiacos: boolean;
    dorPeito: boolean;
    tonturas: boolean;
    problemaOsseo: boolean;
    medicamentosCardiacos: boolean;
    outrasRazoes: boolean;
  };
}

const niveisAtividade = [
  { value: 'sedentario', label: 'Sedentário (nenhuma atividade)' },
  { value: 'leve', label: 'Leve (1-2x por semana)' },
  { value: 'moderado', label: 'Moderado (3-4x por semana)' },
  { value: 'intenso', label: 'Intenso (5-6x por semana)' },
  { value: 'muito-intenso', label: 'Muito Intenso (2x por dia)' }
];

const objetivos = [
  { value: 'emagrecimento', label: 'Emagrecimento/Perda de peso' },
  { value: 'ganho-massa', label: 'Ganho de massa muscular' },
  { value: 'condicionamento', label: 'Condicionamento físico' },
  { value: 'reabilitacao', label: 'Reabilitação/Fisioterapia' },
  { value: 'performance', label: 'Performance esportiva' },
  { value: 'bem-estar', label: 'Bem-estar geral' }
];

const problemasSaudeOpcoes = [
  'Diabetes',
  'Hipertensão',
  'Problemas cardíacos',
  'Problemas respiratórios',
  'Problemas articulares',
  'Problemas de coluna',
  'Outros'
];

export function TriagemForm({ onSalvar, dadosIniciais, loading, idade, dataNascimento }: TriagemFormProps) {
  const [dados, setDados] = useState<DadosTriagem>({
    peso: 0,
    altura: 0,
    nivelAtividade: '',
    objetivo: '',
    problemasSaude: [],
    medicamentos: '',
    lesoes: '',
    limitacoesFisicas: '',
    observacoes: '',
    parq: {
      problemasCardiacos: false,
      dorPeito: false,
      tonturas: false,
      problemaOsseo: false,
      medicamentosCardiacos: false,
      outrasRazoes: false
    }
  });

  const [erros, setErros] = useState<string[]>([]);

  useEffect(() => {
    if (dadosIniciais) {
      setDados(dadosIniciais);
    }
  }, [dadosIniciais]);

  const handleChange = (campo: string, valor: any) => {
    setDados(prev => ({
      ...prev,
      [campo]: valor
    }));
    setErros([]);
  };

  const handleParqChange = (campo: string, valor: boolean) => {
    setDados(prev => ({
      ...prev,
      parq: {
        ...prev.parq,
        [campo]: valor
      }
    }));
  };

  const handleProblemasSaudeChange = (problema: string, checked: boolean) => {
    setDados(prev => ({
      ...prev,
      problemasSaude: checked 
        ? [...prev.problemasSaude, problema]
        : prev.problemasSaude.filter(p => p !== problema)
    }));
  };

  const validarFormulario = () => {
    const novosErros = [];
    
    if (!dados.peso || dados.peso <= 0) {
      novosErros.push('Peso é obrigatório');
    }
    
    if (!dados.altura || dados.altura <= 0) {
      novosErros.push('Altura é obrigatória');
    }
    
    if (!dados.nivelAtividade) {
      novosErros.push('Nível de atividade é obrigatório');
    }
    
    if (!dados.objetivo) {
      novosErros.push('Objetivo principal é obrigatório');
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
        idade,
        dataNascimento,
        imc: dados.peso / Math.pow(dados.altura / 100, 2),
        dataTriagem: new Date().toISOString()
      };

      await onSalvar(dadosCompletos);
    } catch (error) {
      console.error('Erro ao salvar triagem:', error);
    }
  };

  // Verificar se há algum risco no PAR-Q
  const temRiscoPARQ = Object.values(dados.parq).some(valor => valor === true);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados antropométricos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Dados Básicos
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="peso">Peso (kg) *</Label>
            <Input
              id="peso"
              type="number"
              step="0.1"
              min="1"
              max="300"
              value={dados.peso || ''}
              onChange={(e) => handleChange('peso', parseFloat(e.target.value) || 0)}
              placeholder="Ex: 70.5"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="altura">Altura (cm) *</Label>
            <Input
              id="altura"
              type="number"
              step="0.1"
              min="50"
              max="250"
              value={dados.altura || ''}
              onChange={(e) => handleChange('altura', parseFloat(e.target.value) || 0)}
              placeholder="Ex: 175"
              required
            />
          </div>

          {dados.peso > 0 && dados.altura > 0 && (
            <div className="md:col-span-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium">
                IMC: {(dados.peso / Math.pow(dados.altura / 100, 2)).toFixed(1)} kg/m²
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Atividade e Objetivos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Atividade e Objetivos
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nivelAtividade">Nível de Atividade Atual *</Label>
            <Select value={dados.nivelAtividade} onValueChange={(value) => handleChange('nivelAtividade', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent>
                {niveisAtividade.map(nivel => (
                  <SelectItem key={nivel.value} value={nivel.value}>
                    {nivel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="objetivo">Objetivo Principal *</Label>
            <Select value={dados.objetivo} onValueChange={(value) => handleChange('objetivo', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o objetivo" />
              </SelectTrigger>
              <SelectContent>
                {objetivos.map(objetivo => (
                  <SelectItem key={objetivo.value} value={objetivo.value}>
                    {objetivo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Saúde */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Histórico de Saúde
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Problemas de Saúde (marque todos que se aplicam)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {problemasSaudeOpcoes.map(problema => (
                <div key={problema} className="flex items-center space-x-2">
                  <Checkbox
                    id={`problema-${problema}`}
                    checked={dados.problemasSaude.includes(problema)}
                    onCheckedChange={(checked) => handleProblemasSaudeChange(problema, checked as boolean)}
                  />
                  <Label htmlFor={`problema-${problema}`} className="text-sm">
                    {problema}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medicamentos">Medicamentos em Uso</Label>
              <Textarea
                id="medicamentos"
                placeholder="Liste os medicamentos que usa regularmente..."
                value={dados.medicamentos}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('medicamentos', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lesoes">Lesões/Cirurgias Anteriores</Label>
              <Textarea
                id="lesoes"
                placeholder="Descreva lesões ou cirurgias relevantes..."
                value={dados.lesoes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('lesoes', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="limitacoes">Limitações Físicas</Label>
            <Textarea
              id="limitacoes"
              placeholder="Descreva qualquer limitação física que deva ser considerada..."
              value={dados.limitacoesFisicas}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('limitacoesFisicas', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Questionário PAR-Q Simplificado */}
      <Card>
        <CardHeader>
          <CardTitle>Questionário de Prontidão para Atividade Física (PAR-Q)</CardTitle>
          <p className="text-sm text-gray-600">
            Responda SIM ou NÃO para cada pergunta:
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="parq-cardiacos"
                checked={dados.parq.problemasCardiacos}
                onCheckedChange={(checked) => handleParqChange('problemasCardiacos', checked as boolean)}
              />
              <Label htmlFor="parq-cardiacos" className="text-sm">
                Algum médico já disse que você possui um problema de coração?
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="parq-dor"
                checked={dados.parq.dorPeito}
                onCheckedChange={(checked) => handleParqChange('dorPeito', checked as boolean)}
              />
              <Label htmlFor="parq-dor" className="text-sm">
                Você sente dores no peito quando pratica atividade física?
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="parq-tonturas"
                checked={dados.parq.tonturas}
                onCheckedChange={(checked) => handleParqChange('tonturas', checked as boolean)}
              />
              <Label htmlFor="parq-tonturas" className="text-sm">
                Você sente tonturas ou já perdeu a consciência durante exercícios?
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="parq-osseo"
                checked={dados.parq.problemaOsseo}
                onCheckedChange={(checked) => handleParqChange('problemaOsseo', checked as boolean)}
              />
              <Label htmlFor="parq-osseo" className="text-sm">
                Você tem algum problema ósseo ou articular que poderia ser agravado?
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="parq-medicamentos"
                checked={dados.parq.medicamentosCardiacos}
                onCheckedChange={(checked) => handleParqChange('medicamentosCardiacos', checked as boolean)}
              />
              <Label htmlFor="parq-medicamentos" className="text-sm">
                Você toma medicamentos para pressão arterial ou problemas cardíacos?
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="parq-outras"
                checked={dados.parq.outrasRazoes}
                onCheckedChange={(checked) => handleParqChange('outrasRazoes', checked as boolean)}
              />
              <Label htmlFor="parq-outras" className="text-sm">
                Você conhece alguma outra razão pela qual não deveria praticar atividade física?
              </Label>
            </div>
          </div>

          {temRiscoPARQ && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Atenção:</strong> As respostas indicam necessidade de avaliação médica antes de iniciar atividades físicas.
                É recomendado consultar um médico antes de prescrever exercícios.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Observações */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações Adicionais</Label>
            <Textarea
              id="observacoes"
              placeholder="Informações adicionais relevantes para a avaliação..."
              value={dados.observacoes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('observacoes', e.target.value)}
              rows={3}
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
          {loading ? 'Salvando...' : 'Salvar Triagem'}
        </Button>
      </div>
    </form>
  );
}
