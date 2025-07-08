/**
 * Formulário de Anamnese - Segunda etapa para avaliação padrão
 * Histórico detalhado de saúde do aluno
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
import { Save, AlertCircle, Heart, Brain, Utensils, Moon, Zap } from 'lucide-react';

interface AnamneseFormProps {
  onSalvar: (dados: any) => Promise<any>;
  dadosIniciais?: any;
  loading: boolean;
  dadosTriagem: any;
}

interface DadosAnamnese {
  // História familiar
  historiaFamiliar: {
    diabetes: boolean;
    hipertensao: boolean;
    obesidade: boolean;
    problemaCardiaco: boolean;
    cancer: boolean;
    outros: string;
  };
  
  // Hábitos alimentares
  habitosAlimentares: {
    refeicoesDia: number;
    horarioRegular: boolean;
    alergias: string;
    restricoes: string;
    suplementos: string;
    hidratacao: string;
  };
  
  // Sono e estresse
  sonoEstresse: {
    horasSono: number;
    qualidadeSono: string;
    nivelEstresse: string;
    estrategiasEstresse: string;
  };
  
  // Histórico de exercícios
  historicoExercicios: {
    experienciaAnterior: string;
    atividadesFavoritas: string;
    lesoesPrevias: string;
    limitacoes: string;
  };
  
  // Estilo de vida
  estiloVida: {
    tabagismo: string;
    alcool: string;
    profissao: string;
    horasTrabalho: number;
    atividadeTrabalho: string;
  };
  
  // Dados específicos por gênero
  dadosEspecificos: {
    // Para mulheres
    cicloMenstrual?: boolean;
    gravidez?: boolean;
    amamentacao?: boolean;
    menopausa?: boolean;
    
    // Geral
    cirurgiasRecentes?: string;
    tratamentosMedicos?: string;
  };
  
  // Expectativas e motivação
  expectativas: {
    motivacao: string;
    objetivosEspecificos: string;
    tempoDisponivel: string;
    preferenciasHorario: string;
  };
  
  // Observações profissionais
  observacoesProfissional: string;
}

const opcoesQualidadeSono = [
  { value: 'excelente', label: 'Excelente' },
  { value: 'boa', label: 'Boa' },
  { value: 'regular', label: 'Regular' },
  { value: 'ruim', label: 'Ruim' },
  { value: 'pessima', label: 'Péssima' }
];

const opcoesNivelEstresse = [
  { value: 'baixo', label: 'Baixo' },
  { value: 'moderado', label: 'Moderado' },
  { value: 'alto', label: 'Alto' },
  { value: 'muito-alto', label: 'Muito Alto' }
];

const opcoesTempo = [
  { value: '2-3x-semana', label: '2-3x por semana (1h cada)' },
  { value: '4-5x-semana', label: '4-5x por semana (1h cada)' },
  { value: 'diario-30min', label: 'Diário (30 min)' },
  { value: 'diario-1h', label: 'Diário (1h ou mais)' },
  { value: 'flexivel', label: 'Horário flexível' }
];

export function AnamneseForm({ onSalvar, dadosIniciais, loading, dadosTriagem }: AnamneseFormProps) {
  const [dados, setDados] = useState<DadosAnamnese>({
    historiaFamiliar: {
      diabetes: false,
      hipertensao: false,
      obesidade: false,
      problemaCardiaco: false,
      cancer: false,
      outros: ''
    },
    habitosAlimentares: {
      refeicoesDia: 3,
      horarioRegular: true,
      alergias: '',
      restricoes: '',
      suplementos: '',
      hidratacao: ''
    },
    sonoEstresse: {
      horasSono: 8,
      qualidadeSono: '',
      nivelEstresse: '',
      estrategiasEstresse: ''
    },
    historicoExercicios: {
      experienciaAnterior: '',
      atividadesFavoritas: '',
      lesoesPrevias: '',
      limitacoes: ''
    },
    estiloVida: {
      tabagismo: '',
      alcool: '',
      profissao: '',
      horasTrabalho: 8,
      atividadeTrabalho: ''
    },
    dadosEspecificos: {},
    expectativas: {
      motivacao: '',
      objetivosEspecificos: '',
      tempoDisponivel: '',
      preferenciasHorario: ''
    },
    observacoesProfissional: ''
  });

  const [erros, setErros] = useState<string[]>([]);

  useEffect(() => {
    if (dadosIniciais) {
      setDados(dadosIniciais);
    }
  }, [dadosIniciais]);

  const handleChange = (secao: keyof DadosAnamnese, campo: string, valor: any) => {
    setDados(prev => ({
      ...prev,
      [secao]: {
        ...(prev[secao] as Record<string, any>),
        [campo]: valor
      }
    }));
    setErros([]);
  };

  const handleHistoriaFamiliarChange = (campo: string, valor: boolean | string) => {
    setDados(prev => ({
      ...prev,
      historiaFamiliar: {
        ...prev.historiaFamiliar,
        [campo]: valor
      }
    }));
  };

  const validarFormulario = () => {
    const novosErros = [];
    
    if (!dados.sonoEstresse.qualidadeSono) {
      novosErros.push('Qualidade do sono é obrigatória');
    }
    
    if (!dados.sonoEstresse.nivelEstresse) {
      novosErros.push('Nível de estresse é obrigatório');
    }
    
    if (!dados.expectativas.motivacao.trim()) {
      novosErros.push('Motivação principal é obrigatória');
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
        dataAnamnese: new Date().toISOString(),
        dadosTriagemReferencia: dadosTriagem?.id || 'triagem-atual'
      };

      await onSalvar(dadosCompletos);
    } catch (error) {
      console.error('Erro ao salvar anamnese:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* História Familiar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            História Familiar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="diabetes-familiar"
                checked={dados.historiaFamiliar.diabetes}
                onCheckedChange={(checked) => handleHistoriaFamiliarChange('diabetes', checked as boolean)}
              />
              <Label htmlFor="diabetes-familiar">Diabetes</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hipertensao-familiar"
                checked={dados.historiaFamiliar.hipertensao}
                onCheckedChange={(checked) => handleHistoriaFamiliarChange('hipertensao', checked as boolean)}
              />
              <Label htmlFor="hipertensao-familiar">Hipertensão</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="obesidade-familiar"
                checked={dados.historiaFamiliar.obesidade}
                onCheckedChange={(checked) => handleHistoriaFamiliarChange('obesidade', checked as boolean)}
              />
              <Label htmlFor="obesidade-familiar">Obesidade</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cardiaco-familiar"
                checked={dados.historiaFamiliar.problemaCardiaco}
                onCheckedChange={(checked) => handleHistoriaFamiliarChange('problemaCardiaco', checked as boolean)}
              />
              <Label htmlFor="cardiaco-familiar">Problemas Cardíacos</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cancer-familiar"
                checked={dados.historiaFamiliar.cancer}
                onCheckedChange={(checked) => handleHistoriaFamiliarChange('cancer', checked as boolean)}
              />
              <Label htmlFor="cancer-familiar">Câncer</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="outros-familiar">Outros problemas familiares</Label>
            <Textarea
              id="outros-familiar"
              placeholder="Descreva outros problemas de saúde na família..."
              value={dados.historiaFamiliar.outros}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleHistoriaFamiliarChange('outros', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Hábitos Alimentares */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Hábitos Alimentares
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="refeicoes">Número de refeições por dia</Label>
            <Input
              id="refeicoes"
              type="number"
              min="1"
              max="10"
              value={dados.habitosAlimentares.refeicoesDia}
              onChange={(e) => handleChange('habitosAlimentares', 'refeicoesDia', parseInt(e.target.value) || 3)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="horario-regular"
              checked={dados.habitosAlimentares.horarioRegular}
              onCheckedChange={(checked) => handleChange('habitosAlimentares', 'horarioRegular', checked)}
            />
            <Label htmlFor="horario-regular">Horários regulares de alimentação</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alergias">Alergias alimentares</Label>
            <Input
              id="alergias"
              placeholder="Ex: lactose, glúten, frutos do mar..."
              value={dados.habitosAlimentares.alergias}
              onChange={(e) => handleChange('habitosAlimentares', 'alergias', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="restricoes">Restrições/Dietas especiais</Label>
            <Input
              id="restricoes"
              placeholder="Ex: vegetariana, low carb, cetogênica..."
              value={dados.habitosAlimentares.restricoes}
              onChange={(e) => handleChange('habitosAlimentares', 'restricoes', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="suplementos">Suplementos em uso</Label>
            <Input
              id="suplementos"
              placeholder="Ex: whey protein, vitaminas..."
              value={dados.habitosAlimentares.suplementos}
              onChange={(e) => handleChange('habitosAlimentares', 'suplementos', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hidratacao">Consumo de água (litros/dia)</Label>
            <Input
              id="hidratacao"
              placeholder="Ex: 2-3 litros"
              value={dados.habitosAlimentares.hidratacao}
              onChange={(e) => handleChange('habitosAlimentares', 'hidratacao', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sono e Estresse */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Sono e Estresse
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="horas-sono">Horas de sono por noite</Label>
            <Input
              id="horas-sono"
              type="number"
              min="1"
              max="15"
              step="0.5"
              value={dados.sonoEstresse.horasSono}
              onChange={(e) => handleChange('sonoEstresse', 'horasSono', parseFloat(e.target.value) || 8)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="qualidade-sono">Qualidade do sono *</Label>
            <Select 
              value={dados.sonoEstresse.qualidadeSono} 
              onValueChange={(value) => handleChange('sonoEstresse', 'qualidadeSono', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a qualidade" />
              </SelectTrigger>
              <SelectContent>
                {opcoesQualidadeSono.map(opcao => (
                  <SelectItem key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nivel-estresse">Nível de estresse *</Label>
            <Select 
              value={dados.sonoEstresse.nivelEstresse} 
              onValueChange={(value) => handleChange('sonoEstresse', 'nivelEstresse', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent>
                {opcoesNivelEstresse.map(opcao => (
                  <SelectItem key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="estrategias-estresse">Como lida com o estresse?</Label>
            <Textarea
              id="estrategias-estresse"
              placeholder="Ex: exercícios, meditação, hobbies..."
              value={dados.sonoEstresse.estrategiasEstresse}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('sonoEstresse', 'estrategiasEstresse', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Expectativas e Motivação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Expectativas e Motivação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tempo-disponivel">Tempo disponível para exercícios</Label>
              <Select 
                value={dados.expectativas.tempoDisponivel} 
                onValueChange={(value) => handleChange('expectativas', 'tempoDisponivel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tempo" />
                </SelectTrigger>
                <SelectContent>
                  {opcoesTempo.map(opcao => (
                    <SelectItem key={opcao.value} value={opcao.value}>
                      {opcao.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preferencias-horario">Preferências de horário</Label>
              <Input
                id="preferencias-horario"
                placeholder="Ex: manhã, tarde, noite"
                value={dados.expectativas.preferenciasHorario}
                onChange={(e) => handleChange('expectativas', 'preferenciasHorario', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="motivacao">Principal motivação *</Label>
            <Textarea
              id="motivacao"
              placeholder="O que te motiva a buscar exercícios físicos?"
              value={dados.expectativas.motivacao}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('expectativas', 'motivacao', e.target.value)}
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="objetivos-especificos">Objetivos específicos</Label>
            <Textarea
              id="objetivos-especificos"
              placeholder="Metas específicas e prazos desejados..."
              value={dados.expectativas.objetivosEspecificos}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('expectativas', 'objetivosEspecificos', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Observações Profissionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Observações do Profissional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="observacoes-profissional">Observações e recomendações</Label>
            <Textarea
              id="observacoes-profissional"
              placeholder="Observações importantes baseadas na anamnese..."
              value={dados.observacoesProfissional}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDados(prev => ({ ...prev, observacoesProfissional: e.target.value }))}
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
          {loading ? 'Salvando...' : 'Salvar Anamnese'}
        </Button>
      </div>
    </form>
  );
}
