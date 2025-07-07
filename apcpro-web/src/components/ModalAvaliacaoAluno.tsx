/**
 * Modal de avaliação física para alunos
 * Gerencia o fluxo: Triagem → Anamnese/Alto Rendimento → Medidas Corporais
 * Baseado no ModalAvaliacaoCompleta, mas sem dobras cutâneas
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
  RefreshCw
} from 'lucide-react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import apiClient from '@/lib/api-client';

// Modais existentes adaptados
import { ModalTriagem } from './ModalTriagem';
import { ModalAnamnese } from './ModalAnamnese';
import { ModalDetalhesAvaliacao } from './ModalDetalhesAvaliacao';
import { ModalMedidasCorporais } from './ModalMedidasCorporais';

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
  const [erro] = useState<string>('');
  const [, setCarregandoDados] = useState(false);

  // Dados coletados nas etapas anteriores para evitar repetição
  const [, setDadosColetados] = useState<DadosColetados>({});

  // Estados dos modais das etapas
  const [modalTriagemOpen, setModalTriagemOpen] = useState(false);
  const [modalAnamneseOpen, setModalAnamneseOpen] = useState(false);
  const [modalAltoRendimentoOpen, setModalAltoRendimentoOpen] = useState(false);
  const [modalMedidasCorporaisOpen, setModalMedidasCorporaisOpen] = useState(false);
  
  // Estados para modais de detalhes (visualização de avaliações existentes)
  const [modalDetalhesTriagem, setModalDetalhesTriagem] = useState(false);
  const [modalDetalhesAnamnese, setModalDetalhesAnamnese] = useState(false);
  const [modalDetalhesAltoRendimento, setModalDetalhesAltoRendimento] = useState(false);
  const [modalDetalhesMedidas, setModalDetalhesMedidas] = useState(false);

  // Dados salvos de cada etapa
  const [dadosTriagem, setDadosTriagem] = useState<any>(null);
  const [dadosAnamnese, setDadosAnamnese] = useState<any>(null);
  const [dadosAltoRendimento, setDadosAltoRendimento] = useState<any>(null);
  const [dadosMedidas, setDadosMedidas] = useState<any>(null);
  
  // Dados do usuário para medidas corporais
  const [idadeUsuario, setIdadeUsuario] = useState<number>(25); // valor padrão
  const [dataNascimentoUsuario, setDataNascimentoUsuario] = useState<string>('1999-01-01'); // valor padrão

  // Definição das etapas (sem dobras cutâneas para alunos)
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
    }
  ];

  // Buscar dados já existentes das avaliações ao abrir o modal
  const buscarAvaliacoesExistentes = useCallback(async () => {
    if (!profile?.id) return;
    
    setCarregandoDados(true);
    try {
      // Buscar dados do usuário (idade e data de nascimento)
      try {
        const userResponse = await apiClient.get(`alunos/${profile.id}`);
        const userData = userResponse.data;
        
        if (userData.dataNascimento) {
          setDataNascimentoUsuario(userData.dataNascimento);
          
          // Calcular idade
          const today = new Date();
          const birthDate = new Date(userData.dataNascimento);
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          
          setIdadeUsuario(age);
        }
      } catch (userError) {
        console.warn('Erro ao buscar dados do usuário, usando valores padrão:', userError);
      }

      const response = await apiClient.get(`alunos/${profile.id}/avaliacoes`);
      const avaliacoes = response.data || [];

      // Filtrar apenas avaliações pendentes ou aprovadas (ignorar reprovadas)
      const avaliacoesValidas = avaliacoes.filter((a: any) => 
        a.status === 'pendente' || a.status === 'aprovada'
      );

      // Separar avaliações por tipo (pegar a mais recente de cada tipo válido)
      const triagem = avaliacoesValidas
        .filter((a: any) => a.tipo === 'triagem')
        .sort((a: any, b: any) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];
      
      const anamnese = avaliacoesValidas
        .filter((a: any) => a.tipo === 'anamnese')
        .sort((a: any, b: any) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];
      
      const altoRendimento = avaliacoesValidas
        .filter((a: any) => a.tipo === 'alto-rendimento')
        .sort((a: any, b: any) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];
      
      const medidas = avaliacoesValidas
        .filter((a: any) => a.tipo === 'medidas')
        .sort((a: any, b: any) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];

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
        if (medidas.resultado?.peso || medidas.resultado?.altura) {
          setDadosColetados(prev => ({
            ...prev,
            ...(medidas.resultado?.peso && { peso: medidas.resultado.peso }),
            ...(medidas.resultado?.altura && { altura: medidas.resultado.altura })
          }));
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
    
    // Contar etapas que têm dados válidos
    const etapasComDados = etapasObrigatorias.filter(etapa => {
      switch (etapa.id) {
        case 'triagem':
          return !!dadosTriagem;
        case 'anamnese':
          return tipoAvaliacao === 'anamnese' ? !!dadosAnamnese : false;
        case 'alto-rendimento':
          return tipoAvaliacao === 'alto-rendimento' ? !!dadosAltoRendimento : false;
        case 'medidas':
          return !!dadosMedidas;
        default:
          return false;
      }
    });

    return Math.round((etapasComDados.length / etapasObrigatorias.length) * 100);
  };

  // Funções para lidar com o sucesso de cada etapa
  const handleTriagemSuccess = () => {
    setModalTriagemOpen(false);
    buscarAvaliacoesExistentes();
  };

  const handleAnamneseSuccess = () => {
    setModalAnamneseOpen(false);
    buscarAvaliacoesExistentes();
  };

  const handleAltoRendimentoSuccess = () => {
    setModalAltoRendimentoOpen(false);
    buscarAvaliacoesExistentes();
  };

  const handleMedidasSuccess = () => {
    setModalMedidasCorporaisOpen(false);
    buscarAvaliacoesExistentes();
  };

  // Navegação entre etapas
  const proximaEtapa = () => {
    if (etapaAtual < etapas.length - 1) {
      setEtapaAtual(etapaAtual + 1);
    }
  };

  const etapaAnterior = () => {
    if (etapaAtual > 0) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  // Finalizar avaliação
  const finalizarAvaliacao = () => {
    onSuccess();
    onClose();
  };

  // Função para executar a etapa atual
  const executarEtapa = () => {
    const etapa = etapas[etapaAtual];
    
    switch (etapa.id) {
      case 'triagem':
        setModalTriagemOpen(true);
        break;
      case 'anamnese':
        setModalAnamneseOpen(true);
        break;
      case 'alto-rendimento':
        setModalAltoRendimentoOpen(true);
        break;
      case 'medidas':
        setModalMedidasCorporaisOpen(true);
        break;
    }
  };

  // Função para visualizar detalhes da etapa
  const visualizarDetalhes = () => {
    const etapa = etapas[etapaAtual];
    
    switch (etapa.id) {
      case 'triagem':
        setModalDetalhesTriagem(true);
        break;
      case 'anamnese':
        setModalDetalhesAnamnese(true);
        break;
      case 'alto-rendimento':
        setModalDetalhesAltoRendimento(true);
        break;
      case 'medidas':
        setModalDetalhesMedidas(true);
        break;
    }
  };

  const etapaAtualObj = etapas[etapaAtual];
  const progresso = calcularProgresso();
  const todosConcluidos = etapas.filter(e => e.obrigatoria).every(e => e.completed);

  return (
    <>
      <ModalPadrao
        open={open}
        onClose={onClose}
        title="Avaliação Física Completa"
        description="Complete todas as etapas da sua avaliação física"
        maxWidth="2xl"
      >
        <div className="space-y-6">
          {/* Indicador de progresso */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Progresso da Avaliação
              </span>
              <span className="text-sm font-medium text-blue-600">
                {progresso}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>

          {/* Lista de etapas */}
          <div className="space-y-3">
            {etapas.map((etapa, index) => (
              <div
                key={etapa.id}
                className={`
                  flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${index === etapaAtual 
                    ? 'border-blue-500 bg-blue-50' 
                    : etapa.completed 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }
                `}
                onClick={() => setEtapaAtual(index)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full
                    ${index === etapaAtual 
                      ? 'bg-blue-500 text-white' 
                      : etapa.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}>
                    {etapa.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      etapa.icone
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{etapa.nome}</h3>
                    <p className="text-sm text-gray-500">{etapa.descricao}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {etapa.obrigatoria && (
                    <Badge variant="outline" className="text-xs">
                      Obrigatória
                    </Badge>
                  )}
                  {etapa.completed && (
                    <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                      Concluída
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Informações da etapa atual */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              Etapa Atual: {etapaAtualObj.nome}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {etapaAtualObj.descricao}
            </p>
            
            <div className="flex gap-2">
              {etapaAtualObj.completed ? (
                <Button 
                  onClick={visualizarDetalhes}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Ver Detalhes
                </Button>
              ) : (
                <Button 
                  onClick={executarEtapa}
                  className="flex items-center gap-2"
                >
                  {etapaAtualObj.icone}
                  Realizar {etapaAtualObj.nome}
                </Button>
              )}
              
              {etapaAtualObj.completed && (
                <Button 
                  onClick={executarEtapa}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refazer
                </Button>
              )}
            </div>
          </div>

          {/* Erro */}
          {erro && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}

          {/* Botões de navegação */}
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

            <div className="flex gap-2">
              {etapaAtual < etapas.length - 1 ? (
                <Button
                  onClick={proximaEtapa}
                  disabled={!podeAvancar()}
                  className="flex items-center gap-2"
                >
                  Próxima
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={finalizarAvaliacao}
                  disabled={!todosConcluidos}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Finalizar
                </Button>
              )}
            </div>
          </div>
        </div>
      </ModalPadrao>

      {/* Modais das etapas */}
      {profile?.id && (
        <>
          <ModalTriagem
            open={modalTriagemOpen}
            onClose={() => setModalTriagemOpen(false)}
            onSuccess={handleTriagemSuccess}
            userPerfilId={profile.id}
          />

          <ModalAnamnese
            open={modalAnamneseOpen}
            onClose={() => setModalAnamneseOpen(false)}
            onSuccess={handleAnamneseSuccess}
            userPerfilId={profile.id}
          />

          <ModalAnamnese
            open={modalAltoRendimentoOpen}
            onClose={() => setModalAltoRendimentoOpen(false)}
            onSuccess={handleAltoRendimentoSuccess}
            userPerfilId={profile.id}
          />

          <ModalMedidasCorporais
            open={modalMedidasCorporaisOpen}
            onClose={() => setModalMedidasCorporaisOpen(false)}
            onSuccess={handleMedidasSuccess}
            userPerfilId={profile.id}
            idade={idadeUsuario}
            dataNascimento={dataNascimentoUsuario}
          />
        </>
      )}

      {/* Modais de detalhes */}
      {dadosTriagem && (
        <ModalDetalhesAvaliacao
          open={modalDetalhesTriagem}
          onClose={() => setModalDetalhesTriagem(false)}
          avaliacao={{
            id: 'triagem-current',
            tipo: 'triagem',
            data: new Date().toISOString(),
            status: 'concluido',
            resultado: dadosTriagem
          }}
        />
      )}

      {dadosAnamnese && (
        <ModalDetalhesAvaliacao
          open={modalDetalhesAnamnese}
          onClose={() => setModalDetalhesAnamnese(false)}
          avaliacao={{
            id: 'anamnese-current',
            tipo: 'anamnese',
            data: new Date().toISOString(),
            status: 'concluido',
            resultado: dadosAnamnese
          }}
        />
      )}

      {dadosAltoRendimento && (
        <ModalDetalhesAvaliacao
          open={modalDetalhesAltoRendimento}
          onClose={() => setModalDetalhesAltoRendimento(false)}
          avaliacao={{
            id: 'alto-rendimento-current',
            tipo: 'alto-rendimento',
            data: new Date().toISOString(),
            status: 'concluido',
            resultado: dadosAltoRendimento
          }}
        />
      )}

      {dadosMedidas && (
        <ModalDetalhesAvaliacao
          open={modalDetalhesMedidas}
          onClose={() => setModalDetalhesMedidas(false)}
          avaliacao={{
            id: 'medidas-current',
            tipo: 'medidas',
            data: new Date().toISOString(),
            status: 'concluido',
            resultado: dadosMedidas
          }}
        />
      )}
    </>
  );
}
