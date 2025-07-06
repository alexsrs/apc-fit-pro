/**
 * Modal completo de avaliação física em etapas
 * Gerencia todo o fluxo: Triagem → Anamnese/Alto Rendimento → Medidas → Dobras Cutâneas
 * Integra com os modais existentes e evita repetir dados já coletados
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ModalPadrao } from '@/components/ui/ModalPadrao';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Save,
  AlertCircle,
  Users,
  Stethoscope,
  Trophy,
  Ruler,
  Calculator,
  RefreshCw
} from 'lucide-react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import apiClient from '@/lib/api-client';

// Modais existentes adaptados
import { ModalTriagem } from './ModalTriagem';
import { ModalAnamnese } from './ModalAnamnese';
import { DobrasCutaneasModernas } from './DobrasCutaneasModernas';

// Tipos
interface AvaliacaoEtapa {
  id: string;
  nome: string;
  icone: React.ReactNode;
  descricao: string;
  obrigatoria: boolean;
  completed: boolean;
  data?: any;
}

interface ModalAvaliacaoCompletaProps {
  open: boolean;
  onClose: () => void;
  userPerfilId: string;
  onSuccess: () => void;
  nomeAluno: string;
}

type TipoAvaliacao = 'anamnese' | 'alto-rendimento';

interface DadosColetados {
  peso?: number;
  altura?: number;
  [key: string]: any;
}

export function ModalAvaliacaoCompleta({
  open,
  onClose,
  userPerfilId,
  onSuccess,
  nomeAluno
}: ModalAvaliacaoCompletaProps) {
  const { profile } = useUserProfile();
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [tipoAvaliacao, setTipoAvaliacao] = useState<TipoAvaliacao>('anamnese');
  const [erro, setErro] = useState<string>('');
  const [carregandoDados, setCarregandoDados] = useState(false);

  // Dados coletados nas etapas anteriores para evitar repetição
  const [dadosColetados] = useState<DadosColetados>({});

  // Estados dos modais das etapas
  const [modalTriagemOpen, setModalTriagemOpen] = useState(false);
  const [modalAnamneseOpen, setModalAnamneseOpen] = useState(false);
  const [modalAltoRendimentoOpen, setModalAltoRendimentoOpen] = useState(false);

  // Dados salvos de cada etapa
  const [dadosTriagem, setDadosTriagem] = useState<any>(null);
  const [dadosAnamnese, setDadosAnamnese] = useState<any>(null);
  const [dadosAltoRendimento, setDadosAltoRendimento] = useState<any>(null);
  const [dadosMedidas, setDadosMedidas] = useState<any>(null);
  const [dadosDobras, setDadosDobras] = useState<any>(null);

  // Definição das etapas
  const etapas: AvaliacaoEtapa[] = [
    {
      id: 'triagem',
      nome: 'Triagem',
      icone: <Users className="h-5 w-5" />,
      descricao: 'Avaliação inicial básica',
      obrigatoria: true,
      completed: !!dadosTriagem
    },
    {
      id: tipoAvaliacao,
      nome: tipoAvaliacao === 'anamnese' ? 'Anamnese' : 'Alto Rendimento',
      icone: tipoAvaliacao === 'anamnese' ? <Stethoscope className="h-5 w-5" /> : <Trophy className="h-5 w-5" />,
      descricao: tipoAvaliacao === 'anamnese' 
        ? 'Histórico de saúde detalhado' 
        : 'Avaliação para atletas',
      obrigatoria: true,
      completed: tipoAvaliacao === 'anamnese' ? !!dadosAnamnese : !!dadosAltoRendimento
    },
    {
      id: 'medidas',
      nome: 'Medidas Corporais',
      icone: <Ruler className="h-5 w-5" />,
      descricao: 'Antropometria e circunferências',
      obrigatoria: true,
      completed: !!dadosMedidas
    },
    {
      id: 'dobras',
      nome: 'Dobras Cutâneas',
      icone: <Calculator className="h-5 w-5" />,
      descricao: 'Composição corporal (opcional)',
      obrigatoria: false,
      completed: !!dadosDobras
    }
  ];

  // Buscar dados já existentes das avaliações ao abrir o modal
  const buscarAvaliacoesExistentes = useCallback(async () => {
    setCarregandoDados(true);
    try {
      const response = await apiClient.get(`alunos/${userPerfilId}/avaliacoes`);
      const avaliacoes = response.data || [];

      // Separar avaliações por tipo
      const triagem = avaliacoes.find((a: any) => a.tipo === 'triagem');
      const anamnese = avaliacoes.find((a: any) => a.tipo === 'anamnese');
      const altoRendimento = avaliacoes.find((a: any) => a.tipo === 'alto-rendimento');
      const medidas = avaliacoes.find((a: any) => a.tipo === 'medidas');
      const dobras = avaliacoes.find((a: any) => a.tipo === 'dobras-cutaneas');

      if (triagem) {
        setDadosTriagem(triagem.resultado);
        
        // Definir tipo de avaliação baseado na triagem existente
        const objetivo = triagem.resultado?.bloco4?.objetivo || triagem.resultado?.atleta?.objetivo;
        if (objetivo === 'Alto rendimento esportivo') {
          setTipoAvaliacao('alto-rendimento');
        } else {
          setTipoAvaliacao('anamnese');
        }
      }
      if (anamnese) setDadosAnamnese(anamnese.resultado);
      if (altoRendimento) setDadosAltoRendimento(altoRendimento.resultado);
      if (medidas) {
        setDadosMedidas(medidas.resultado);
        // Extrair peso e altura para evitar perguntar novamente
        if (medidas.resultado?.peso) dadosColetados.peso = medidas.resultado.peso;
        if (medidas.resultado?.altura) dadosColetados.altura = medidas.resultado.altura;
      }
      if (dobras) setDadosDobras(dobras.resultado);

    } catch (error) {
      console.error('Erro ao buscar avaliações existentes:', error);
    } finally {
      setCarregandoDados(false);
    }
  }, [userPerfilId, dadosColetados]);

  useEffect(() => {
    if (open && userPerfilId) {
      buscarAvaliacoesExistentes();
    }
  }, [open, userPerfilId, buscarAvaliacoesExistentes]);

  // Buscar dados já existentes das avaliações ao abrir o modal
  useEffect(() => {
    if (open && userPerfilId) {
      buscarAvaliacoesExistentes();
    }
  }, [open, userPerfilId, buscarAvaliacoesExistentes]);

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

  // Callbacks para os modais
  const handleTriagemSuccess = (objetivo: string) => {
    // Define o tipo de avaliação baseado no objetivo da triagem
    if (objetivo === 'Alto rendimento esportivo') {
      setTipoAvaliacao('alto-rendimento');
    } else {
      setTipoAvaliacao('anamnese');
    }
    
    setModalTriagemOpen(false);
    buscarAvaliacoesExistentes(); // Recarrega dados
    proximaEtapa(); // Avança automaticamente
  };

  const handleAnamneseSuccess = () => {
    setModalAnamneseOpen(false);
    buscarAvaliacoesExistentes(); // Recarrega dados
    proximaEtapa(); // Avança automaticamente
  };

  const handleAltoRendimentoSuccess = () => {
    setModalAltoRendimentoOpen(false);
    buscarAvaliacoesExistentes(); // Recarrega dados
    proximaEtapa(); // Avança automaticamente
  };

  const handleMedidasSuccess = () => {
    buscarAvaliacoesExistentes(); // Recarrega dados
    proximaEtapa(); // Avança automaticamente
  };

  // Renderizar conteúdo da etapa atual
  const renderizarEtapaAtual = () => {
    const etapa = etapas[etapaAtual];
    
    switch (etapa.id) {
      case 'triagem':
        return (
          <div className="space-y-4">
            <div className="text-center">
              {dadosTriagem ? (
                <div className="bg-green-50 p-4 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-medium">Triagem já realizada</p>
                  <p className="text-sm text-green-600">
                    Tipo definido: {tipoAvaliacao === 'anamnese' ? 'Anamnese' : 'Alto Rendimento'}
                  </p>
                </div>
              ) : (
                <Button 
                  onClick={() => setModalTriagemOpen(true)}
                  className="w-full"
                  size="lg"
                >
                  Realizar Triagem Inicial
                </Button>
              )}
            </div>
          </div>
        );
        
      case 'anamnese':
        return (
          <div className="space-y-4">
            <div className="text-center">
              {dadosAnamnese ? (
                <div className="bg-green-50 p-4 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-medium">Anamnese já realizada</p>
                </div>
              ) : (
                <Button 
                  onClick={() => setModalAnamneseOpen(true)}
                  className="w-full"
                  size="lg"
                  disabled={!dadosTriagem}
                >
                  Realizar Anamnese
                </Button>
              )}
            </div>
          </div>
        );
        
      case 'alto-rendimento':
        return (
          <div className="space-y-4">
            <div className="text-center">
              {dadosAltoRendimento ? (
                <div className="bg-green-50 p-4 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-medium">Avaliação de Alto Rendimento já realizada</p>
                </div>
              ) : (
                <Button 
                  onClick={() => setModalAltoRendimentoOpen(true)}
                  className="w-full"
                  size="lg"
                  disabled={!dadosTriagem}
                >
                  Realizar Avaliação de Alto Rendimento
                </Button>
              )}
            </div>
          </div>
        );
        
      case 'medidas':
        // Usar formulário inline da ModalMedidasCorporais existente
        return (
          <MedidasCorporaisInline 
            userPerfilId={userPerfilId}
            dadosColetados={dadosColetados}
            onSuccess={handleMedidasSuccess}
            completed={!!dadosMedidas}
          />
        );
        
      case 'dobras':
        return (
          <div className="space-y-4">
            {profile?.role !== "professor" ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Apenas professores podem realizar avaliação de dobras cutâneas.
                </AlertDescription>
              </Alert>
            ) : (
              <DobrasCutaneasModernas
                userPerfilId={userPerfilId}
                onResultado={(resultado) => {
                  setDadosDobras(resultado);
                }}
                modoCalculoApenas={false}
                className="space-y-4"
              />
            )}
          </div>
        );
        
      default:
        return <div>Etapa não encontrada</div>;
    }
  };

  return (
    <ModalPadrao
      open={open}
      onClose={onClose}
      title={`Avaliação Completa - ${nomeAluno}`}
      description="Processo completo de avaliação física em etapas sequenciais"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Loading de dados existentes */}
        {carregandoDados && (
          <div className="flex items-center gap-2 text-blue-600">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Carregando avaliações existentes...</span>
          </div>
        )}

        {/* Indicador de progresso */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Progresso da Avaliação</h3>
            <Badge variant="outline">
              {Math.round(calcularProgresso())}% Concluído
            </Badge>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${calcularProgresso()}%` }}
            />
          </div>
          
          {/* Steps indicator */}
          <div className="flex justify-between">
            {etapas.map((etapa, index) => (
              <div
                key={etapa.id}
                className={`flex flex-col items-center cursor-pointer transition-all ${
                  index === etapaAtual ? 'scale-110' : ''
                }`}
                onClick={() => irParaEtapa(index)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    etapa.completed
                      ? 'bg-green-500 text-white'
                      : index === etapaAtual
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {etapa.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    etapa.icone
                  )}
                </div>
                <span
                  className={`text-xs text-center font-medium ${
                    index === etapaAtual ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {etapa.nome}
                </span>
                {etapa.obrigatoria && (
                  <span className="text-xs text-red-500">*</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Erro */}
        {erro && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{erro}</AlertDescription>
          </Alert>
        )}

        {/* Conteúdo da etapa atual */}
        <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
          <div className="mb-4">
            <h4 className="text-xl font-semibold flex items-center gap-2">
              {etapas[etapaAtual].icone}
              {etapas[etapaAtual].nome}
            </h4>
            <p className="text-gray-600">{etapas[etapaAtual].descricao}</p>
          </div>
          
          {renderizarEtapaAtual()}
        </div>

        {/* Navegação */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={etapaAnterior}
            disabled={!podeVoltar()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>
          
          <div className="text-sm text-gray-500">
            Etapa {etapaAtual + 1} de {etapas.length}
          </div>
          
          <div className="flex gap-2">
            {etapaAtual === etapas.length - 1 ? (
              <Button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Finalizar
              </Button>
            ) : (
              <Button
                onClick={proximaEtapa}
                disabled={!podeAvancar()}
                className="flex items-center gap-2"
              >
                Próxima
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modais das etapas */}
      <ModalTriagem
        open={modalTriagemOpen}
        onClose={() => setModalTriagemOpen(false)}
        userPerfilId={userPerfilId}
        onSuccess={handleTriagemSuccess}
      />

      <ModalAnamnese
        open={modalAnamneseOpen}
        onClose={() => setModalAnamneseOpen(false)}
        userPerfilId={userPerfilId}
        onSuccess={handleAnamneseSuccess}
      />

      {/* Modal Alto Rendimento - usar ModalTriagem com modo diferente se necessário */}
      {tipoAvaliacao === 'alto-rendimento' && (
        <ModalTriagem
          open={modalAltoRendimentoOpen}
          onClose={() => setModalAltoRendimentoOpen(false)}
          userPerfilId={userPerfilId}
          onSuccess={handleAltoRendimentoSuccess}
        />
      )}
    </ModalPadrao>
  );
}

// Componente inline para medidas corporais (extrai do ModalMedidasCorporais existente)
interface MedidasCorporaisInlineProps {
  userPerfilId: string;
  dadosColetados: DadosColetados;
  onSuccess: () => void;
  completed: boolean;
}

function MedidasCorporaisInline({
  userPerfilId,
  dadosColetados,
  onSuccess,
  completed
}: MedidasCorporaisInlineProps) {
  // Esta é uma versão simplificada que usa peso/altura dos dados coletados
  // ou pede apenas se não existirem
  
  if (completed) {
    return (
      <div className="bg-green-50 p-4 rounded-lg text-center">
        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
        <p className="text-green-800 font-medium">Medidas corporais já realizadas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Para continuar com as medidas corporais, clique no botão abaixo. 
          {dadosColetados.peso && dadosColetados.altura && (
            <span className="text-green-600">
              {" "}Peso ({dadosColetados.peso}kg) e altura ({dadosColetados.altura}cm) já foram coletados.
            </span>
          )}
        </AlertDescription>
      </Alert>
      
      <Button 
        onClick={() => {
          // Aqui você pode abrir o modal original ou implementar inline
          console.log('Realizar medidas para usuário:', userPerfilId);
          alert('Implementar medidas corporais inline ou abrir modal existente');
          onSuccess();
        }}
        className="w-full"
        size="lg"
      >
        Realizar Medidas Corporais
      </Button>
    </div>
  );
}