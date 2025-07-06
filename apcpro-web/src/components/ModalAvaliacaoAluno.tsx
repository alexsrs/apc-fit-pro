/**
 * Modal de avaliação física para alunos
 * 
 * Funcionalidades:
 * - Alunos podem realizar avaliações (Triagem, Anamnese/Alto Rendimento, Medidas)
 * - Dobras cutâneas são restritas apenas para professores
 * - Avaliações ficam com status "pendente" aguardando aprovação do professor
 * - Permite iniciar nova avaliação a qualquer momento
 * - Reaproveita dados já coletados para evitar repetição
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ModalPadrao } from '@/components/ui/ModalPadrao';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle,
  Users,
  Stethoscope,
  Trophy,
  Ruler,
  Clock,
  Info
} from 'lucide-react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import apiClient from '@/lib/api-client';
import { calcularIdade, isAvaliacaoVencida, formatarDataValidade } from '@/utils/idade';

// Formulários específicos
import { TriagemForm } from './avaliacoes/TriagemForm';
import { AnamneseForm } from './avaliacoes/AnamneseForm'; 
import { AltoRendimentoForm } from './avaliacoes/AltoRendimentoForm';
import { MedidasCorporaisForm } from './avaliacoes/MedidasCorporaisForm';

// Tipos
interface AvaliacaoEtapa {
  id: string;
  nome: string;
  icone: React.ReactNode;
  descricao: string;
  obrigatoria: boolean;
  completed: boolean;
  status?: 'pendente' | 'aprovada' | 'reprovada' | 'vencida';
  validadeAte?: string;
}

interface ModalAvaliacaoAlunoProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type TipoAvaliacao = 'anamnese' | 'alto-rendimento';

interface DadosColetados {
  peso?: number;
  altura?: number;
  [key: string]: any;
}

export function ModalAvaliacaoAluno({
  open,
  onClose,
  onSuccess
}: ModalAvaliacaoAlunoProps) {
  const { profile } = useUserProfile();
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [tipoAvaliacao, setTipoAvaliacao] = useState<TipoAvaliacao>('anamnese');
  const [erro, setErro] = useState<string>('');
  const [carregandoDados, setCarregandoDados] = useState(false);
  const [salvandoAvaliacao, setSalvandoAvaliacao] = useState(false);

  // Dados coletados nas etapas anteriores para evitar repetição
  const [dadosColetados, setDadosColetados] = useState<DadosColetados>({});

  // Dados salvos de cada etapa
  const [dadosTriagem, setDadosTriagem] = useState<any>(null);
  const [dadosAnamnese, setDadosAnamnese] = useState<any>(null);
  const [dadosAltoRendimento, setDadosAltoRendimento] = useState<any>(null);
  const [dadosMedidas, setDadosMedidas] = useState<any>(null);

  // Função para determinar o status atual da avaliação (incluindo vencida)
  const determinarStatusAvaliacao = (avaliacao: any) => {
    if (!avaliacao) return undefined;
    
    // Se já está reprovada, mantém reprovada
    if (avaliacao.status === 'reprovada') {
      return 'reprovada';
    }
    
    // Se tem validade e está vencida, status vencida
    if (avaliacao.validadeAte && isAvaliacaoVencida(avaliacao.validadeAte)) {
      return 'vencida';
    }
    
    // Caso contrário, mantém o status original
    return avaliacao.status;
  };

  // Definição das etapas (sem dobras cutâneas para alunos)
  const etapas: AvaliacaoEtapa[] = [
    {
      id: 'triagem',
      nome: 'Triagem',
      icone: <Users className="h-5 w-5" />,
      descricao: 'Avaliação inicial básica',
      obrigatoria: true,
      completed: !!dadosTriagem,
      status: determinarStatusAvaliacao(dadosTriagem),
      validadeAte: dadosTriagem?.validadeAte
    },
    {
      id: tipoAvaliacao,
      nome: tipoAvaliacao === 'anamnese' ? 'Anamnese' : 'Alto Rendimento',
      icone: tipoAvaliacao === 'anamnese' ? <Stethoscope className="h-5 w-5" /> : <Trophy className="h-5 w-5" />,
      descricao: tipoAvaliacao === 'anamnese' 
        ? 'Histórico de saúde detalhado' 
        : 'Avaliação para atletas',
      obrigatoria: true,
      completed: tipoAvaliacao === 'anamnese' ? !!dadosAnamnese : !!dadosAltoRendimento,
      status: tipoAvaliacao === 'anamnese' 
        ? determinarStatusAvaliacao(dadosAnamnese) 
        : determinarStatusAvaliacao(dadosAltoRendimento),
      validadeAte: tipoAvaliacao === 'anamnese' ? dadosAnamnese?.validadeAte : dadosAltoRendimento?.validadeAte
    },
    {
      id: 'medidas',
      nome: 'Medidas Corporais',
      icone: <Ruler className="h-5 w-5" />,
      descricao: 'Antropometria e circunferências',
      obrigatoria: true,
      completed: !!dadosMedidas,
      status: determinarStatusAvaliacao(dadosMedidas),
      validadeAte: dadosMedidas?.validadeAte
    }
  ];

  // Buscar dados já existentes das avaliações ao abrir o modal
  const buscarAvaliacoesExistentes = useCallback(async () => {
    if (!profile?.id) return;
    
    setCarregandoDados(true);
    try {
      const response = await apiClient.get(`alunos/${profile.id}/avaliacoes`);
      const avaliacoes = response.data || [];

      // Separar avaliações por tipo
      const triagem = avaliacoes.find((a: any) => a.tipo === 'triagem');
      const anamnese = avaliacoes.find((a: any) => a.tipo === 'anamnese');
      const altoRendimento = avaliacoes.find((a: any) => a.tipo === 'alto-rendimento');
      const medidas = avaliacoes.find((a: any) => a.tipo === 'medidas');

      if (triagem) {
        setDadosTriagem({
          ...triagem.resultado,
          status: triagem.status,
          validadeAte: triagem.validadeAte
        });
        
        // Definir tipo de avaliação baseado na triagem existente
        const objetivo = triagem.resultado?.bloco4?.objetivo || triagem.resultado?.atleta?.objetivo;
        if (objetivo === 'Alto rendimento esportivo') {
          setTipoAvaliacao('alto-rendimento');
        } else {
          setTipoAvaliacao('anamnese');
        }
      }
      
      if (anamnese) {
        setDadosAnamnese({
          ...anamnese.resultado,
          status: anamnese.status,
          validadeAte: anamnese.validadeAte
        });
      }
      
      if (altoRendimento) {
        setDadosAltoRendimento({
          ...altoRendimento.resultado,
          status: altoRendimento.status,
          validadeAte: altoRendimento.validadeAte
        });
      }
      
      if (medidas) {
        setDadosMedidas({
          ...medidas.resultado,
          status: medidas.status,
          validadeAte: medidas.validadeAte
        });
        
        // Extrair peso e altura para evitar perguntar novamente
        if (medidas.resultado?.peso) {
          setDadosColetados(prev => ({ ...prev, peso: medidas.resultado.peso }));
        }
        if (medidas.resultado?.altura) {
          setDadosColetados(prev => ({ ...prev, altura: medidas.resultado.altura }));
        }
      }

    } catch (error) {
      console.error('Erro ao buscar avaliações existentes:', error);
    } finally {
      setCarregandoDados(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    if (open && profile?.id) {
      buscarAvaliacoesExistentes();
    }
  }, [open, profile?.id, buscarAvaliacoesExistentes]);

  // Verificar se pode avançar para a próxima etapa
  const podeAvancar = () => {
    const etapa = etapas[etapaAtual];
    return etapa.completed || !etapa.obrigatoria;
  };

  // Verificar se pode voltar
  const podeVoltar = () => {
    return etapaAtual > 0;
  };

  // Calcular progresso
  const calcularProgresso = () => {
    const etapasObrigatorias = etapas.filter(e => e.obrigatoria);
    const etapasCompletadas = etapas.filter(e => e.completed && e.obrigatoria);
    return (etapasCompletadas.length / etapasObrigatorias.length) * 100;
  };

  // Navegar entre etapas
  const irParaEtapa = (index: number) => {
    if (index >= 0 && index < etapas.length) {
      setEtapaAtual(index);
      setErro('');
    }
  };

  const proximaEtapa = () => {
    if (podeAvancar() && etapaAtual < etapas.length - 1) {
      setEtapaAtual(etapaAtual + 1);
    }
  };

  const etapaAnterior = () => {
    if (podeVoltar()) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  // Salvar avaliação com status "pendente"
  const salvarAvaliacao = async (tipo: string, dados: any) => {
    if (!profile?.id) return;
    
    setSalvandoAvaliacao(true);
    try {
      await apiClient.post(`alunos/${profile.id}/avaliacoes`, {
        tipo,
        resultado: dados,
        status: 'pendente' // Sempre pendente para alunos
      });
      
      // Recarregar dados
      await buscarAvaliacoesExistentes();
      
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      setErro('Erro ao salvar avaliação. Tente novamente.');
    } finally {
      setSalvandoAvaliacao(false);
    }
  };

  // Callbacks para os formulários
  const handleTriagemSubmit = async (dados: any) => {
    await salvarAvaliacao('triagem', dados);
    
    // Define o tipo de avaliação baseado no objetivo
    const objetivo = dados.bloco4?.objetivo || dados.atleta?.objetivo;
    if (objetivo === 'Alto rendimento esportivo') {
      setTipoAvaliacao('alto-rendimento');
    } else {
      setTipoAvaliacao('anamnese');
    }
    
    proximaEtapa();
  };

  const handleAnamneseSubmit = async (dados: any) => {
    await salvarAvaliacao('anamnese', dados);
    proximaEtapa();
  };

  const handleAltoRendimentoSubmit = async (dados: any) => {
    await salvarAvaliacao('alto-rendimento', dados);
    proximaEtapa();
  };

  const handleMedidasSuccess = () => {
    // Finalizar avaliação
    onSuccess();
    onClose();
  };

  // Renderizar badge de status
  const renderStatusBadge = (status?: string, validadeAte?: string) => {
    if (!status) return null;
    
    const configs = {
      pendente: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendente', icon: <Clock className="h-3 w-3" /> },
      aprovada: { color: 'bg-green-100 text-green-800', text: 'Aprovada', icon: <CheckCircle className="h-3 w-3" /> },
      reprovada: { color: 'bg-red-100 text-red-800', text: 'Reprovada', icon: <AlertCircle className="h-3 w-3" /> },
      vencida: { color: 'bg-gray-100 text-gray-800', text: 'Vencida', icon: <AlertCircle className="h-3 w-3" /> }
    };
    
    const config = configs[status as keyof typeof configs];
    if (!config) return null;
    
    return (
      <div className="flex flex-col gap-1">
        <Badge className={`${config.color} flex items-center gap-1`}>
          {config.icon}
          {config.text}
        </Badge>
        {validadeAte && status !== 'pendente' && (
          <span className="text-xs text-gray-500">
            Validade: {formatarDataValidade(validadeAte)}
          </span>
        )}
      </div>
    );
  };

  // Renderizar conteúdo da etapa atual
  const renderizarEtapaAtual = () => {
    const etapa = etapas[etapaAtual];
    
    switch (etapa.id) {
      case 'triagem':
        return (
          <div className="space-y-4">
            {dadosTriagem ? (
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Triagem já realizada</span>
                    {renderStatusBadge(dadosTriagem.status, dadosTriagem.validadeAte)}
                  </div>
                  <p className="text-sm text-blue-600">
                    Tipo definido: {tipoAvaliacao === 'anamnese' ? 'Anamnese' : 'Alto Rendimento'}
                  </p>
                </div>
                <Button 
                  onClick={() => setEtapaAtual(0)}
                  variant="outline" 
                  className="w-full"
                  disabled={salvandoAvaliacao}
                >
                  Refazer Triagem
                </Button>
              </div>
            ) : (
              <TriagemForm
                onSalvar={handleTriagemSubmit}
                loading={salvandoAvaliacao}
                dadosIniciais={dadosTriagem}
                idade={calcularIdade(profile?.dataNascimento ?? undefined)}
                dataNascimento={profile?.dataNascimento ? 
                  typeof profile.dataNascimento === 'string' 
                    ? profile.dataNascimento 
                    : profile.dataNascimento.toISOString().split('T')[0]
                  : ''
                }
              />
            )}
          </div>
        );
        
      case 'anamnese':
        return (
          <div className="space-y-4">
            {dadosAnamnese ? (
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Anamnese já realizada</span>
                    {renderStatusBadge(dadosAnamnese.status, dadosAnamnese.validadeAte)}
                  </div>
                </div>
                <Button 
                  onClick={() => setDadosAnamnese(null)}
                  variant="outline" 
                  className="w-full"
                  disabled={salvandoAvaliacao}
                >
                  Refazer Anamnese
                </Button>
              </div>
            ) : (
              <AnamneseForm
                onSalvar={handleAnamneseSubmit}
                loading={salvandoAvaliacao}
                dadosIniciais={dadosAnamnese}
                dadosTriagem={dadosTriagem}
              />
            )}
          </div>
        );
        
      case 'alto-rendimento':
        return (
          <div className="space-y-4">
            {dadosAltoRendimento ? (
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Avaliação de Alto Rendimento já realizada</span>
                    {renderStatusBadge(dadosAltoRendimento.status, dadosAltoRendimento.validadeAte)}
                  </div>
                </div>
                <Button 
                  onClick={() => setDadosAltoRendimento(null)}
                  variant="outline" 
                  className="w-full"
                  disabled={salvandoAvaliacao}
                >
                  Refazer Avaliação
                </Button>
              </div>
            ) : (
              <AltoRendimentoForm
                onSalvar={handleAltoRendimentoSubmit}
                loading={salvandoAvaliacao}
                dadosIniciais={dadosAltoRendimento}
                dadosTriagem={dadosTriagem}
              />
            )}
          </div>
        );
        
      case 'medidas':
        return (
          <div className="space-y-4">
            {dadosMedidas ? (
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Medidas Corporais já realizadas</span>
                    {renderStatusBadge(dadosMedidas.status, dadosMedidas.validadeAte)}
                  </div>
                </div>
                <Button 
                  onClick={() => setDadosMedidas(null)}
                  variant="outline" 
                  className="w-full"
                  disabled={salvandoAvaliacao}
                >
                  Refazer Medidas
                </Button>
              </div>
            ) : (
              <MedidasCorporaisForm
                userId={profile?.id || ''}
                onSuccess={handleMedidasSuccess}
                initialData={{
                  peso: dadosColetados.peso,
                  altura: dadosColetados.altura,
                  ...dadosMedidas
                }}
              />
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <ModalPadrao 
      open={open} 
      onClose={onClose}
      title="Avaliação Física"
      className="max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      <div className="space-y-6">
        {/* Alerta informativo para alunos */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Para alunos:</strong> Suas avaliações ficam com status &quot;pendente&quot; até serem aprovadas pelo professor. 
            Dobras cutâneas são realizadas apenas pelo professor.
          </AlertDescription>
        </Alert>

        {/* Indicador de progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso da avaliação</span>
            <span>{Math.round(calcularProgresso())}%</span>
          </div>
          <Progress value={calcularProgresso()} className="w-full" />
        </div>

        {/* Navegação das etapas */}
        <div className="flex flex-wrap gap-2">
          {etapas.map((etapa, index) => (
            <button
              key={etapa.id}
              onClick={() => irParaEtapa(index)}
              disabled={index > etapaAtual && !podeAvancar()}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${etapaAtual === index 
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                  : etapa.completed 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
                ${(index > etapaAtual && !podeAvancar()) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {etapa.icone}
              <span>{etapa.nome}</span>
              {etapa.completed && <CheckCircle className="h-4 w-4" />}
              {etapa.status && renderStatusBadge(etapa.status, etapa.validadeAte)}
            </button>
          ))}
        </div>

        {/* Erro */}
        {erro && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{erro}</AlertDescription>
          </Alert>
        )}

        {/* Conteúdo da etapa atual */}
        <div className="min-h-[400px]">
          {carregandoDados ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Carregando dados...</p>
              </div>
            </div>
          ) : (
            renderizarEtapaAtual()
          )}
        </div>

        {/* Navegação inferior */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={etapaAnterior}
            disabled={!podeVoltar() || salvandoAvaliacao}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>

          <div className="text-sm text-gray-600">
            Etapa {etapaAtual + 1} de {etapas.length}
          </div>

          <Button
            onClick={proximaEtapa}
            disabled={!podeAvancar() || etapaAtual >= etapas.length - 1 || salvandoAvaliacao}
            className="flex items-center gap-2"
          >
            Próxima
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </ModalPadrao>
  );
}
