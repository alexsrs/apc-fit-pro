/**
 * Orquestrador de Avaliação Física Completa
 * Coordena o fluxo completo de avaliação inicial
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
// ...existing code...
import { 
  CheckCircle, 
  Circle, 
  ArrowLeft, 
  ArrowRight, 
  Save,
  FileText,
  AlertCircle,
// ...existing code...
  Heart,
  Ruler,
  Calculator,
  Target,
  Eye
} from 'lucide-react';

// Importar componentes de formulário
import { TriagemForm } from './TriagemForm';
import { AnamneseForm } from './AnamneseForm';
import { AltoRendimentoForm } from './AltoRendimentoForm';
import { MedidasCorporaisForm } from './MedidasCorporaisForm';
import { DobrasCutaneasForm } from './DobrasCutaneasForm';

interface AvaliacaoFisicaCompletaProps {
  userId: string;
  tipoUsuario: 'aluno' | 'atleta';
  dadosUsuario: {
    nome: string;
    genero: 'masculino' | 'feminino';
    idade: number;
    dataNascimento: string;
  };
  onFinalizar: (dadosCompletos: any) => void;
  onCancelar?: () => void;
}

interface StepConfig {
  id: string;
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
  obrigatoria: boolean;
  paraAtletas?: boolean;
  paraAlunos?: boolean;
}

interface DadosEtapa {
  triagem?: any;
  anamnese?: any;
  altoRendimento?: any;
  medidasCorporais?: any;
  dobrasCutaneas?: any;
}

// Configuração dos steps do wizard
const STEPS_CONFIG: StepConfig[] = [
  {
    id: 'triagem',
    titulo: 'Triagem Inicial',
    descricao: 'Avaliação básica de saúde e objetivos',
    icone: <Heart className="w-5 h-5" />,
    obrigatoria: true,
    paraAtletas: true,
    paraAlunos: true
  },
  {
    id: 'anamnese',
    titulo: 'Anamnese',
    descricao: 'Histórico detalhado de saúde',
    icone: <FileText className="w-5 h-5" />,
    obrigatoria: true,
    paraAtletas: false,
    paraAlunos: true
  },
  {
    id: 'altoRendimento',
    titulo: 'Alto Rendimento',
    descricao: 'Avaliação específica para atletas',
    icone: <Target className="w-5 h-5" />,
    obrigatoria: true,
    paraAtletas: true,
    paraAlunos: false
  },
  {
    id: 'medidasCorporais',
    titulo: 'Medidas Corporais',
    descricao: 'Antropometria e circunferências',
    icone: <Ruler className="w-5 h-5" />,
    obrigatoria: true,
    paraAtletas: true,
    paraAlunos: true
  },
  {
    id: 'dobrasCutaneas',
    titulo: 'Dobras Cutâneas',
    descricao: 'Composição corporal detalhada',
    icone: <Calculator className="w-5 h-5" />,
    obrigatoria: false,
    paraAtletas: true,
    paraAlunos: true
  },
  {
    id: 'preview',
    titulo: 'Revisão Final',
    descricao: 'Verificar dados antes de finalizar',
    icone: <Eye className="w-5 h-5" />,
    obrigatoria: true,
    paraAtletas: true,
    paraAlunos: true
  }
];

export function AvaliacaoFisicaCompleta({
  userId,
  tipoUsuario,
  dadosUsuario,
  onFinalizar,
  onCancelar
}: AvaliacaoFisicaCompletaProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dadosEtapas, setDadosEtapas] = useState<DadosEtapa>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Filtrar steps baseado no tipo de usuário
  const stepsDisponiveis = STEPS_CONFIG.filter(step => {
    if (tipoUsuario === 'atleta') return step.paraAtletas;
    return step.paraAlunos;
  });

  const stepAtual = stepsDisponiveis[currentStep];
  const totalSteps = stepsDisponiveis.length;
  const progresso = ((currentStep + 1) / totalSteps) * 100;

  // Verificar se step está completo
  const isStepCompleto = (stepId: string) => {
    return !!dadosEtapas[stepId as keyof DadosEtapa];
  };

  // Validar se pode prosseguir
  const podeProximaEtapa = () => {
    if (stepAtual.obrigatoria) {
      return isStepCompleto(stepAtual.id);
    }
    return true;
  };

  // Salvar dados de uma etapa
  const salvarEtapa = (stepId: string, dados: any) => {
    setDadosEtapas(prev => ({
      ...prev,
      [stepId]: dados
    }));
    setErrors([]);
  };

  // Navegar para próxima etapa
  const proximaEtapa = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Navegar para etapa anterior
  const etapaAnterior = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Ir diretamente para uma etapa
  const irParaEtapa = (index: number) => {
    setCurrentStep(index);
  };

  // Finalizar avaliação completa
  const finalizarAvaliacao = async () => {
    setLoading(true);
    try {
      // Compilar todos os dados
      const dadosCompletos = {
        userId,
        tipoUsuario,
        dadosUsuario,
        avaliacoes: dadosEtapas,
        dataFinalizacao: new Date().toISOString()
      };

      onFinalizar(dadosCompletos);
    } catch {
      setErrors(['Erro ao finalizar avaliação. Tente novamente.']);
    } finally {
      setLoading(false);
    }
  };

  // Renderizar stepper
  const renderStepper = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Avaliação Física Completa
        </h2>
        <Badge variant={tipoUsuario === 'atleta' ? 'default' : 'secondary'}>
          {tipoUsuario === 'atleta' ? 'Atleta' : 'Aluno'}
        </Badge>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progresso</span>
          <span>{currentStep + 1} de {totalSteps}</span>
        </div>
        <Progress value={progresso} className="h-2" />
      </div>

      <div className="flex flex-wrap gap-2">
        {stepsDisponiveis.map((step, index) => {
          const isCompleto = isStepCompleto(step.id);
          const isAtual = index === currentStep;
          const isDisponivel = index <= currentStep;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                isAtual 
                  ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                  : isCompleto
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : isDisponivel
                  ? 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed'
              }`}
              onClick={() => isDisponivel && irParaEtapa(index)}
            >
              {isCompleto ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{step.titulo}</span>
              {step.obrigatoria && !isCompleto && (
                <span className="text-xs text-red-500">*</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Renderizar conteúdo da etapa atual
  const renderConteudoEtapa = () => {
    const onSuccessEtapa = async (dados: any) => {
      salvarEtapa(stepAtual.id, dados);
      if (stepAtual.id !== 'preview') {
        proximaEtapa();
      }
    };

    switch (stepAtual.id) {
      case 'triagem':
        return (
          <TriagemForm
            onSalvar={onSuccessEtapa}
            dadosIniciais={dadosEtapas.triagem}
            loading={loading}
            idade={dadosUsuario.idade}
            dataNascimento={dadosUsuario.dataNascimento}
          />
        );

      case 'anamnese':
        return (
          <AnamneseForm
            onSalvar={onSuccessEtapa}
            dadosIniciais={dadosEtapas.anamnese}
            loading={loading}
            dadosTriagem={dadosEtapas.triagem}
          />
        );

      case 'altoRendimento':
        return (
          <AltoRendimentoForm
            onSalvar={onSuccessEtapa}
            dadosIniciais={dadosEtapas.altoRendimento}
            loading={loading}
            dadosTriagem={dadosEtapas.triagem}
          />
        );

      case 'medidasCorporais':
        return (
          <MedidasCorporaisForm
            userId={userId}
            onSuccess={onSuccessEtapa}
            initialData={dadosEtapas.medidasCorporais}
          />
        );

      case 'dobrasCutaneas':
        const dadosBasicos = {
          genero: dadosUsuario.genero,
          idade: dadosUsuario.idade,
          peso: dadosEtapas.medidasCorporais?.peso || 70 // fallback
        };
        
        return (
          <DobrasCutaneasForm
            userId={userId}
            dadosBasicos={dadosBasicos}
            onSuccess={onSuccessEtapa}
            protocoloInicial={tipoUsuario === 'atleta' ? 'pollock9' : 'pollock3'}
            loading={loading}
          />
        );

      case 'preview':
        return renderPreviewFinal();

      default:
        return <div>Etapa não encontrada</div>;
    }
  };

  // Renderizar preview final
  const renderPreviewFinal = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Revisão Final da Avaliação
        </h3>
        <p className="text-gray-600">
          Verifique todos os dados antes de finalizar a avaliação
        </p>
      </div>

      {/* Resumo das etapas */}
      <div className="grid gap-4">
        {stepsDisponiveis
          .filter(step => step.id !== 'preview')
          .map(step => {
            const dados = dadosEtapas[step.id as keyof DadosEtapa];
            const isCompleto = !!dados;

            return (
              <Card key={step.id} className={`${isCompleto ? 'border-green-300' : 'border-red-300'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {step.icone}
                      <div>
                        <h4 className="font-semibold">{step.titulo}</h4>
                        <p className="text-sm text-gray-600">{step.descricao}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCompleto ? (
                        <Badge className="bg-green-100 text-green-800">
                          Completo
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          {step.obrigatoria ? 'Obrigatório' : 'Opcional'}
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const stepIndex = stepsDisponiveis.findIndex(s => s.id === step.id);
                          irParaEtapa(stepIndex);
                        }}
                      >
                        {isCompleto ? 'Editar' : 'Completar'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Validação final */}
      {stepsDisponiveis.some(step => step.obrigatoria && !isStepCompleto(step.id)) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Algumas etapas obrigatórias ainda não foram completadas.
          </AlertDescription>
        </Alert>
      )}

      {/* Botão finalizar */}
      <div className="flex justify-center">
        <Button
          onClick={finalizarAvaliacao}
          disabled={
            loading || 
            stepsDisponiveis.some(step => step.obrigatoria && !isStepCompleto(step.id))
          }
          className="px-8 py-3 text-lg"
        >
          <Save className="w-5 h-5 mr-2" />
          {loading ? 'Finalizando...' : 'Finalizar Avaliação'}
        </Button>
      </div>
    </div>
  );

  // Renderizar navegação
  const renderNavegacao = () => {
    if (stepAtual.id === 'preview') return null;

    return (
      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <Button
          variant="outline"
          onClick={etapaAnterior}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </Button>

        <div className="text-sm text-gray-600">
          {stepAtual.titulo} - {stepAtual.descricao}
        </div>

        <Button
          onClick={proximaEtapa}
          disabled={!podeProximaEtapa() || currentStep === totalSteps - 1}
          className="flex items-center gap-2"
        >
          Próxima
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderStepper()}

      {/* Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errors.map((erro, index) => (
              <div key={index}>{erro}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Conteúdo da etapa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {stepAtual.icone}
            {stepAtual.titulo}
            {stepAtual.obrigatoria && (
              <Badge variant="destructive" className="ml-2">Obrigatória</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderConteudoEtapa()}
        </CardContent>
      </Card>

      {renderNavegacao()}

      {/* Botão cancelar */}
      {onCancelar && (
        <div className="text-center mt-6">
          <Button variant="ghost" onClick={onCancelar}>
            Cancelar Avaliação
          </Button>
        </div>
      )}

      {/* Botão refazer avaliação para alunos */}
      {tipoUsuario === 'aluno' && (
        <div className="text-center mt-4">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentStep(0);
              setDadosEtapas({});
              setErrors([]);
            }}
          >
            Refazer Avaliação
          </Button>
        </div>
      )}
    </div>
  );
}
