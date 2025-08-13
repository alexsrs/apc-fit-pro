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
import { LoadingInline } from '@/components/ui/Loading';
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
  Calculator
} from 'lucide-react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import apiClient from '@/lib/api-client';

// Modais existentes adaptados
import { ModalTriagem } from './ModalTriagem';
import { ModalAnamnese } from './ModalAnamnese';
import { DobrasCutaneasModernas } from './DobrasCutaneasModernas';
import { ModalDetalhesAvaliacao } from './ModalDetalhesAvaliacao';
import { ModalMedidasCorporais } from './ModalMedidasCorporais';
import { calcularIdade } from '@/utils/idade';

// Tipos
interface Aluno {
  id: string;
  name: string;
  dataNascimento?: string;
  genero?: string;
  peso?: number;
  altura?: number;
}

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
  const [dadosColetados, setDadosColetados] = useState<DadosColetados>({});

  // Estado para aluno selecionado
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);

  useEffect(() => {
    async function buscarAluno() {
      if (!userPerfilId) return;
      try {
        const resp = await apiClient.get(`/api/alunos/${userPerfilId}/profile`);
        setAlunoSelecionado(resp.data);
  } catch {
    setAlunoSelecionado(null);
  }
    }
    buscarAluno();
  }, [userPerfilId]);

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
  const [modalDetalhesDobras, setModalDetalhesDobras] = useState(false);

  // Dados salvos de cada etapa
  const [dadosTriagem, setDadosTriagem] = useState<any>(null);
  const [dadosAnamnese, setDadosAnamnese] = useState<any>(null);
  const [dadosAltoRendimento, setDadosAltoRendimento] = useState<any>(null);
  const [dadosMedidas, setDadosMedidas] = useState<any>(null);
  const [dadosDobras, setDadosDobras] = useState<any>(null);
  
  // Dados do usuário para medidas corporais
  // const [idadeUsuario, setIdadeUsuario] = useState<number | undefined>(undefined);
  // const [dataNascimentoUsuario, setDataNascimentoUsuario] = useState<string>('');

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
    // Adiciona etapa de dobras cutâneas apenas para professor
    ...(profile?.role === 'professor' ? [{
      id: 'dobras',
      nome: 'Dobras Cutâneas',
      icone: <Calculator className="h-5 w-5" />,
      descricao: 'Composição corporal (opcional)',
      obrigatoria: false,
      completed: !!dadosDobras
    }] : [])
  ];

  // Buscar dados já existentes das avaliações ao abrir o modal
  const buscarAvaliacoesExistentes = useCallback(async () => {
    setCarregandoDados(true);
    try {
      // Buscar avaliações do aluno
      const response = await apiClient.get(`alunos/${userPerfilId}/avaliacoes`);
      const avaliacoes = response.data || [];
      const avaliacoesValidas = avaliacoes;

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
        if (medidas.resultado?.peso || medidas.resultado?.altura) {
          setDadosColetados(prev => ({
            ...prev,
            ...(medidas.resultado?.peso && { peso: medidas.resultado.peso }),
            ...(medidas.resultado?.altura && { altura: medidas.resultado.altura })
          }));
        }
      }

      // Extrair userId do aluno das avaliações (campo alunoId)
      let userId = '';
      for (const avaliacao of avaliacoesValidas) {
        if (avaliacao.alunoId && typeof avaliacao.alunoId === 'string') {
          userId = avaliacao.alunoId;
          break;
        }
      }

      // Buscar data de nascimento via endpoint de perfil do aluno usando userId
      if (userId) {
        let dataNascimentoApi = '';
        try {
          // Busca o perfil do aluno usando o userId correto (não o userPerfilId)
          const perfilResponse = await apiClient.get(`alunos/${userId}/profile`);
          if (perfilResponse?.data?.dataNascimento) {
            dataNascimentoApi = perfilResponse.data.dataNascimento;
            // setDataNascimentoUsuario(dataNascimentoApi);
            // Calcular idade
            const today = new Date();
            const birthDate = new Date(dataNascimentoApi);
            // age removido (não utilizado)
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              // linha removida: age-- (variável removida)
            }
            // setIdadeUsuario(age);
          } else {
            setErro('Data de nascimento não encontrada no perfil do aluno.');
            // setDataNascimentoUsuario('');
            // setIdadeUsuario(0);
          }
        } catch {
          setErro('Erro ao buscar perfil do aluno para data de nascimento.');
          // setDataNascimentoUsuario('');
          // setIdadeUsuario(0);
        }
      } else {
        setErro('Não foi possível identificar o userId do aluno. Dados de perfil não serão exibidos.');
        // setDataNascimentoUsuario('');
        // setIdadeUsuario(0);
      }

    } catch (error) {
      console.error('Erro ao buscar avaliações existentes:', error);
    } finally {
      setCarregandoDados(false);
    }
  }, [userPerfilId]);

  // FUNÇÃO DESABILITADA: aprovarUltimaAvaliacao 
  // Motivo: Backend agora já cria avaliações de professores com status 'aprovada' automaticamente
  const aprovarUltimaAvaliacao = async (tipoAvaliacao: string) => {
    // Esta função não é mais necessária pois o backend já salva 
    // avaliações de professores como 'aprovada' direto na criação
    console.log(`[DESABILITADO] aprovarUltimaAvaliacao para ${tipoAvaliacao} - backend já salva como aprovada`);
    return;
  };

  useEffect(() => {
    if (open && userPerfilId) {
      buscarAvaliacoesExistentes();
    }
  }, [open, userPerfilId, buscarAvaliacoesExistentes]);

  // Listener para evento personalizado de abertura do modal de medidas
  useEffect(() => {
    const handleOpenModalMedidas = () => {
      setModalDetalhesMedidas(true);
    };

    window.addEventListener('openModalDetalhesMedidas', handleOpenModalMedidas);
    
    return () => {
      window.removeEventListener('openModalDetalhesMedidas', handleOpenModalMedidas);
    };
  }, []);

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
    
    // Contar etapas que têm dados válidos (independente do perfil)
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
        case 'dobras':
          return !!dadosDobras;
        default:
          return false;
      }
    });
    
    return etapasObrigatorias.length > 0 ? (etapasComDados.length / etapasObrigatorias.length) * 100 : 0;
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
  const handleTriagemSuccess = async (objetivo: string) => {
    // Define o tipo de avaliação baseado no objetivo da triagem
    if (objetivo === 'Alto rendimento esportivo') {
      setTipoAvaliacao('alto-rendimento');
    } else {
      setTipoAvaliacao('anamnese');
    }
    
    setModalTriagemOpen(false);
    
    // Backend agora já salva avaliações de professores como 'aprovada' automaticamente
    
    buscarAvaliacoesExistentes(); // Recarrega dados
    proximaEtapa(); // Avança automaticamente
  };

  const handleAnamneseSuccess = async () => {
    setModalAnamneseOpen(false);
    
    // Backend agora já salva avaliações de professores como 'aprovada' automaticamente
    if (profile?.role === "professor") {
      // Backend agora já salva avaliações de professores como 'aprovada' automaticamente
    }
    
    buscarAvaliacoesExistentes(); // Recarrega dados
    proximaEtapa(); // Avança automaticamente
  };

  const handleAltoRendimentoSuccess = async () => {
    setModalAltoRendimentoOpen(false);
    
    // Backend agora já salva avaliações de professores como 'aprovada' automaticamente
    
    buscarAvaliacoesExistentes(); // Recarrega dados
    proximaEtapa(); // Avança automaticamente
  };

  const handleMedidasSuccess = async () => {
    // Backend agora já salva avaliações de professores como 'aprovada' automaticamente
    
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
              {dadosTriagem && profile?.role !== "professor" ? (
                <div className="bg-green-50 p-4 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-medium">Triagem já realizada</p>
                  <p className="text-sm text-green-600">
                    Tipo definido: {tipoAvaliacao === 'anamnese' ? 'Anamnese' : 'Alto Rendimento'}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                    onClick={() => setModalDetalhesTriagem(true)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              ) : profile?.role === "professor" && dadosTriagem ? (
                <div className="space-y-3">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-medium">✅ Triagem realizada e aprovada</p>
                    <p className="text-sm text-green-600">
                      Tipo: {tipoAvaliacao === 'anamnese' ? 'Anamnese' : 'Alto Rendimento'}
                    </p>
                    <p className="text-sm text-green-600">
                      Você pode realizar uma nova triagem se necessário
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-2 mr-2"
                      onClick={() => setModalDetalhesTriagem(true)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                  <Button 
                    onClick={() => setModalTriagemOpen(true)}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    Realizar Nova Triagem
                  </Button>
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
              {dadosAnamnese && profile?.role !== "professor" ? (
                <div className="bg-green-50 p-4 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-medium">Anamnese já realizada</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                    onClick={() => setModalDetalhesAnamnese(true)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              ) : profile?.role === "professor" && dadosAnamnese ? (
                <div className="space-y-3">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-medium">✅ Anamnese realizada e aprovada</p>
                    <p className="text-sm text-green-600">
                      Você pode realizar uma nova anamnese se necessário
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-2 mr-2"
                      onClick={() => setModalDetalhesAnamnese(true)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                  <Button 
                    onClick={() => setModalAnamneseOpen(true)}
                    variant="outline"
                    className="w-full"
                    size="lg"
                    disabled={!dadosTriagem}
                  >
                    Realizar Nova Anamnese
                  </Button>
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
              {dadosAltoRendimento && profile?.role !== "professor" ? (
                <div className="bg-green-50 p-4 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-medium">Avaliação de Alto Rendimento já realizada</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                    onClick={() => setModalDetalhesAltoRendimento(true)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              ) : profile?.role === "professor" && dadosAltoRendimento ? (
                <div className="space-y-3">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-medium">✅ Avaliação de Alto Rendimento realizada e aprovada</p>
                    <p className="text-sm text-green-600">
                      Você pode realizar uma nova avaliação se necessário
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-2 mr-2"
                      onClick={() => setModalDetalhesAltoRendimento(true)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                  <Button 
                    onClick={() => setModalAltoRendimentoOpen(true)}
                    variant="outline"
                    className="w-full"
                    size="lg"
                    disabled={!dadosTriagem}
                  >
                    Realizar Nova Avaliação de Alto Rendimento
                  </Button>
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
            completed={!!dadosMedidas}
            onOpenMedidasModal={() => setModalMedidasCorporaisOpen(true)}
          />
        );
      case 'dobras':
        // Etapa exclusiva para professor
        // Função utilitária para montar dados pessoais corretos
        function montarDadosPessoaisDobras() {
          // Prioriza dados do aluno da API, sempre retorna 'M' ou 'F'
          let genero: 'M' | 'F' = 'M';
          if (alunoSelecionado?.genero) {
            const g = alunoSelecionado.genero.trim().toLowerCase();
            if (g === 'f' || g === 'feminino' || g.startsWith('fem') || g.startsWith('f')) genero = 'F';
            else if (g === 'm' || g === 'masculino' || g.startsWith('masc') || g.startsWith('m')) genero = 'M';
          }
          // Peso e altura das últimas medidas salvas
          const peso = dadosMedidas?.peso !== undefined ? dadosMedidas.peso : alunoSelecionado?.peso || 0;
          const altura = dadosMedidas?.altura !== undefined ? dadosMedidas.altura : alunoSelecionado?.altura || undefined;
          // Idade calculada pela data de nascimento do aluno
          const idade = alunoSelecionado?.dataNascimento ? calcularIdade(alunoSelecionado.dataNascimento) : undefined;
          return {
            genero,
            peso,
            altura,
            idade
          };
        }

        return (
          <div className="space-y-4">
            <DobrasCutaneasModernas
              resultado={{
                protocolo: '',
                dadosPessoais: montarDadosPessoaisDobras(),
                medidas: {},
                resultados: {
                  somaTotal: 0,
                  percentualGordura: 0,
                  massaGorda: 0,
                  massaMagra: 0,
                  classificacao: '',
                },
                metadata: {
                  dataAvaliacao: new Date().toISOString(),
                  validadeFormula: "true"
                },
                aluno: {
                  id: alunoSelecionado?.id || userPerfilId,
                  name: alunoSelecionado?.name || nomeAluno,
                  dataNascimento: alunoSelecionado?.dataNascimento || '',
                  genero: alunoSelecionado?.genero || undefined,
                  peso: dadosMedidas?.peso !== undefined ? dadosMedidas.peso : alunoSelecionado?.peso || undefined,
                  altura: dadosMedidas?.altura !== undefined ? dadosMedidas.altura : alunoSelecionado?.altura || undefined
                }
              }}
              onResultado={setDadosDobras}
              modoCalculoApenas={false}
              className="space-y-4"
            />
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
            <LoadingInline color="blue" />
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

      <ModalMedidasCorporais
        open={modalMedidasCorporaisOpen}
        onClose={() => setModalMedidasCorporaisOpen(false)}
        userPerfilId={userPerfilId}
        onSuccess={handleMedidasSuccess}
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

      {/* Modais de Detalhes das Avaliações Existentes */}
      {dadosTriagem && (
        <ModalDetalhesAvaliacao
          open={modalDetalhesTriagem}
          onClose={() => setModalDetalhesTriagem(false)}
          avaliacao={{
            id: 'triagem-existente',
            tipo: 'triagem',
            status: 'aprovada',
            data: new Date().toISOString(),
            resultado: dadosTriagem
          }}
          titulo="Detalhes da Triagem Existente"
          modoVisualizacao="readonly"
        />
      )}

      {dadosAnamnese && (
        <ModalDetalhesAvaliacao
          open={modalDetalhesAnamnese}
          onClose={() => setModalDetalhesAnamnese(false)}
          avaliacao={{
            id: 'anamnese-existente',
            tipo: 'anamnese',
            status: 'aprovada',
            data: new Date().toISOString(),
            resultado: dadosAnamnese
          }}
          titulo="Detalhes da Anamnese Existente"
          modoVisualizacao="readonly"
        />
      )}

      {dadosAltoRendimento && (
        <ModalDetalhesAvaliacao
          open={modalDetalhesAltoRendimento}
          onClose={() => setModalDetalhesAltoRendimento(false)}
          avaliacao={{
            id: 'alto-rendimento-existente',
            tipo: 'alto-rendimento',
            status: 'aprovada',
            data: new Date().toISOString(),
            resultado: dadosAltoRendimento
          }}
          titulo="Detalhes da Avaliação de Alto Rendimento Existente"
          modoVisualizacao="readonly"
        />
      )}

      {dadosMedidas && (
        <ModalDetalhesAvaliacao
          open={modalDetalhesMedidas}
          onClose={() => setModalDetalhesMedidas(false)}
          avaliacao={{
            id: 'medidas-existente',
            tipo: 'medidas',
            status: 'aprovada',
            data: new Date().toISOString(),
            resultado: dadosMedidas
          }}
          titulo="Detalhes das Medidas Corporais Existentes"
          modoVisualizacao="readonly"
        />
      )}

      {dadosDobras && profile?.role === 'professor' && (
        <ModalDetalhesAvaliacao
          open={modalDetalhesDobras}
          onClose={() => setModalDetalhesDobras(false)}
          avaliacao={{
            id: 'dobras-existente',
            tipo: 'dobras-cutaneas',
            status: 'aprovada',
            data: new Date().toISOString(),
            resultado: dadosDobras
          }}
          titulo="Detalhes das Dobras Cutâneas Existentes"
          modoVisualizacao="readonly"
        />
      )}
    </ModalPadrao>
  );
}

// Componente inline para medidas corporais (extrai do ModalMedidasCorporais existente)
interface MedidasCorporaisInlineProps {
  userPerfilId: string;
  dadosColetados: DadosColetados;
  completed: boolean;
  onOpenMedidasModal: () => void;
}

function MedidasCorporaisInline({
  userPerfilId,
  dadosColetados,
  completed,
  onOpenMedidasModal
}: MedidasCorporaisInlineProps) {
  const { profile } = useUserProfile();
  
  // Esta é uma versão simplificada que usa peso/altura dos dados coletados
  // ou pede apenas se não existirem
  
  if (completed && profile?.role !== "professor") {
    return (
      <div className="bg-green-50 p-4 rounded-lg text-center">
        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
        <p className="text-green-800 font-medium">Medidas corporais já realizadas</p>
        <Button 
          variant="outline" 
          size="sm"
          className="mt-2"
          onClick={() => {
            // Trigger modal de detalhes
            const event = new CustomEvent('openModalDetalhesMedidas');
            window.dispatchEvent(event);
          }}
        >
          Ver Detalhes
        </Button>
      </div>
    );
  }

  if (completed && profile?.role === "professor") {
    return (
      <div className="space-y-3">
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-green-800 font-medium">✅ Medidas corporais realizadas e aprovadas</p>
          <p className="text-sm text-green-600">
            Você pode realizar novas medidas se necessário
          </p>
          <Button 
            variant="outline" 
            size="sm"
            className="mt-2 mr-2"
            onClick={() => {
              // Trigger modal de detalhes
              const event = new CustomEvent('openModalDetalhesMedidas');
              window.dispatchEvent(event);
            }}
          >
            Ver Detalhes
          </Button>
        </div>
        <Button 
          onClick={() => {
            console.log('Realizar novas medidas para usuário:', userPerfilId);
            onOpenMedidasModal();
          }}
          variant="outline"
          className="w-full"
          size="lg"
        >
          Realizar Novas Medidas Corporais
        </Button>
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
        onClick={onOpenMedidasModal}
        className="w-full"
        size="lg"
      >
        Realizar Medidas Corporais
      </Button>
    </div>
  );
}
