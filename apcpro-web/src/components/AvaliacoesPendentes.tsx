/**
 * Componente para gerenciar avaliações pendentes dos alunos
 * Permite ao professor aprovar/reprovar avaliações e definir validade
 * Exibe apenas 5 avaliações por padrão, com modal para lista completa
 * Permite visualizar detalhes completos de cada avaliação
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  FileText,
  AlertCircle,
  Eye,
  List,
  ChevronRight,
} from 'lucide-react';
import apiClient from '@/lib/api-client';
import { ModalDetalhesAvaliacao } from '@/components/ModalDetalhesAvaliacao';

interface AvaliacaoPendente {
  id: string;
  tipo: string;
  data: string;
  status: string;
  resultado: any;
  userPerfil: {
    id: string;
    user: {
      name: string;
      email: string;
    };
  };
}

interface AvaliacoesPendentesProps {
  professorId: string;
  onAtualizacao?: () => void;
}

export function AvaliacoesPendentes({ professorId, onAtualizacao }: AvaliacoesPendentesProps) {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoPendente[]>([]);
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState<string | null>(null);
  
  // Estado do modal de aprovação
  const [modalAprovacao, setModalAprovacao] = useState<{
    open: boolean;
    avaliacao: AvaliacaoPendente | null;
  }>({ open: false, avaliacao: null });
  const [validadeDias, setValidadeDias] = useState(90);
  
  // Estado do modal de reprovação
  const [modalReprovacao, setModalReprovacao] = useState<{
    open: boolean;
    avaliacao: AvaliacaoPendente | null;
  }>({ open: false, avaliacao: null });
  const [motivo, setMotivo] = useState('');

  // Estado do modal de lista completa
  const [modalListaCompleta, setModalListaCompleta] = useState(false);

  // Estado do modal de detalhes
  const [modalDetalhes, setModalDetalhes] = useState<{
    open: boolean;
    avaliacao: AvaliacaoPendente | null;
  }>({ open: false, avaliacao: null });

  // Buscar avaliações pendentes
  const buscarAvaliacoesPendentes = useCallback(async () => {
    setLoading(true);
    try {
      // Buscar todos os alunos do professor
      const alunosResponse = await apiClient.get(`users/${professorId}/alunos`);
      const alunos = alunosResponse.data || [];
      
      console.log('👥 Alunos retornados do backend:', alunos);
      
      // Buscar avaliações pendentes de cada aluno
      const todasAvaliacoes: AvaliacaoPendente[] = [];
      for (const aluno of alunos) {
        try {
          const avaliacoesResponse = await apiClient.get(`alunos/${aluno.id}/avaliacoes`);
          const avaliacoesAluno = avaliacoesResponse.data || [];
          
          // Filtrar apenas as pendentes
          const pendentes = avaliacoesAluno
            .filter((a: any) => a.status === 'pendente')
            .map((a: any) => ({
              ...a,
              userPerfil: {
                id: aluno.id,
                user: {
                  // Corrigido: usar a estrutura correta dos dados do backend
                  name: aluno.name || 'Nome não informado',
                  email: aluno.email || 'Email não informado'
                }
              }
            }));
          
          todasAvaliacoes.push(...pendentes);
        } catch (error) {
          console.error(`Erro ao buscar avaliações do aluno ${aluno.id}:`, error);
        }
      }
      
      // Ordenar por data (mais recentes primeiro)
      todasAvaliacoes.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      
      setAvaliacoes(todasAvaliacoes);
    } catch (error) {
      console.error('Erro ao buscar avaliações pendentes:', error);
    } finally {
      setLoading(false);
    }
  }, [professorId]);

  useEffect(() => {
    if (professorId) {
      buscarAvaliacoesPendentes();
    }
  }, [professorId, buscarAvaliacoesPendentes]);

  // Aprovar avaliação
  const aprovarAvaliacao = async () => {
    if (!modalAprovacao.avaliacao) return;
    
    setProcessando(modalAprovacao.avaliacao.id);
    try {
      await apiClient.patch(`avaliacoes/${modalAprovacao.avaliacao.id}/aprovar`, {
        diasValidade: validadeDias
      });
      
      // Atualizar lista
      await buscarAvaliacoesPendentes();
      setModalAprovacao({ open: false, avaliacao: null });
      onAtualizacao?.();
    } catch (error) {
      console.error('Erro ao aprovar avaliação:', error);
      alert('Erro ao aprovar avaliação. Tente novamente.');
    } finally {
      setProcessando(null);
    }
  };

  // Reprovar avaliação
  const reprovarAvaliacao = async () => {
    if (!modalReprovacao.avaliacao) return;
    
    setProcessando(modalReprovacao.avaliacao.id);
    try {
      await apiClient.patch(`avaliacoes/${modalReprovacao.avaliacao.id}/reprovar`, {
        motivo
      });
      
      // Atualizar lista
      await buscarAvaliacoesPendentes();
      setModalReprovacao({ open: false, avaliacao: null });
      setMotivo('');
      onAtualizacao?.();
    } catch (error) {
      console.error('Erro ao reprovar avaliação:', error);
      alert('Erro ao reprovar avaliação. Tente novamente.');
    } finally {
      setProcessando(null);
    }
  };

  // Formatar tipo de avaliação
  const formatarTipo = (tipo: string) => {
    const tipos: Record<string, string> = {
      'triagem': 'Triagem',
      'anamnese': 'Anamnese',
      'alto-rendimento': 'Alto Rendimento',
      'medidas': 'Medidas Corporais',
      'dobras-cutaneas': 'Dobras Cutâneas'
    };
    return tipos[tipo] || tipo;
  };

  // Formatar dados do resultado da avaliação para visualização
  const formatarResultado = (resultado: any, tipo: string) => {
    if (!resultado) return null; // Retorna null para não exibir nada
    
    try {
      const dados = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;
      
      switch (tipo) {
        case 'anamnese':
          return `Histórico: ${dados.historico_medico || 'Não informado'}, Atividade: ${dados.atividade_fisica || 'Não informado'}`;
        case 'dobras-cutaneas':
          return `Dobras: ${Object.keys(dados).length} medidas realizadas`;
        case 'medidas':
          return `Peso: ${dados.peso || 'N/A'}kg, Altura: ${dados.altura || 'N/A'}cm`;
        case 'triagem':
          return null; // Remove a mensagem "Triagem básica realizada"
        default:
          const numCampos = Object.keys(dados).length;
          return numCampos > 0 ? `${numCampos} campos preenchidos` : null;
      }
    } catch {
      return null; // Em caso de erro, não exibe nada
    }
  };

  // Renderizar item de avaliação
  const renderizarItemAvaliacao = (avaliacao: AvaliacaoPendente, compacto = false) => (
    <div
      key={avaliacao.id}
      className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
        compacto ? 'p-3' : ''
      }`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{avaliacao.userPerfil.user.name}</span>
          <Badge className="bg-yellow-100 text-yellow-800">
            {formatarTipo(avaliacao.tipo)}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(avaliacao.data).toLocaleDateString('pt-BR')}
            </span>
          </div>
          {!compacto && (
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{avaliacao.userPerfil.user.email}</span>
            </div>
          )}
        </div>
        
        {!compacto && formatarResultado(avaliacao.resultado, avaliacao.tipo) && (
          <div className="mt-2 text-sm text-gray-500">
            {formatarResultado(avaliacao.resultado, avaliacao.tipo)}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setModalDetalhes({ open: true, avaliacao })}
          className="text-blue-600 hover:bg-blue-50"
        >
          <Eye className="h-4 w-4" />
          {!compacto && <span className="ml-1">Ver</span>}
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          className="text-green-600 border-green-600 hover:bg-green-50"
          onClick={() => setModalAprovacao({ open: true, avaliacao })}
          disabled={processando === avaliacao.id}
        >
          <CheckCircle className="h-4 w-4" />
          {!compacto && <span className="ml-1">Aprovar</span>}
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 border-red-600 hover:bg-red-50"
          onClick={() => setModalReprovacao({ open: true, avaliacao })}
          disabled={processando === avaliacao.id}
        >
          <XCircle className="h-4 w-4" />
          {!compacto && <span className="ml-1">Reprovar</span>}
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Avaliações Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (avaliacoes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Avaliações Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma avaliação pendente</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Avaliações Pendentes
              <Badge variant="secondary">{avaliacoes.length}</Badge>
            </div>
            {avaliacoes.length > 2 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalListaCompleta(true)}
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                Ver Todas ({avaliacoes.length})
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {avaliacoes.slice(0, 2).map((avaliacao) => renderizarItemAvaliacao(avaliacao))}
            
            {avaliacoes.length > 2 && (
              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full text-blue-600 hover:bg-blue-50"
                  onClick={() => setModalListaCompleta(true)}
                >
                  Ver mais {avaliacoes.length - 2} avaliações
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Aprovação */}
      <Dialog open={modalAprovacao.open} onOpenChange={(open) => !open && setModalAprovacao({ open: false, avaliacao: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Avaliação</DialogTitle>
            <DialogDescription>
              Você está aprovando a avaliação de <strong>{formatarTipo(modalAprovacao.avaliacao?.tipo || '')}</strong> de{' '}
              <strong>{modalAprovacao.avaliacao?.userPerfil.user.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="validadeDias">Validade (dias)</Label>
              <Input
                id="validadeDias"
                type="number"
                min="1"
                max="365"
                value={validadeDias}
                onChange={(e) => setValidadeDias(Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-sm text-gray-600 mt-1">
                A avaliação será válida por {validadeDias} dias (até{' '}
                {new Date(Date.now() + validadeDias * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')})
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAprovacao({ open: false, avaliacao: null })}>
              Cancelar
            </Button>
            <Button onClick={aprovarAvaliacao} disabled={processando === modalAprovacao.avaliacao?.id}>
              {processando === modalAprovacao.avaliacao?.id ? 'Aprovando...' : 'Aprovar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Reprovação */}
      <Dialog open={modalReprovacao.open} onOpenChange={(open) => !open && setModalReprovacao({ open: false, avaliacao: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprovar Avaliação</DialogTitle>
            <DialogDescription>
              Você está reprovando a avaliação de <strong>{formatarTipo(modalReprovacao.avaliacao?.tipo || '')}</strong> de{' '}
              <strong>{modalReprovacao.avaliacao?.userPerfil.user.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Ao reprovar, o aluno será notificado e poderá refazer a avaliação.
              </AlertDescription>
            </Alert>

            <div>
              <Label htmlFor="motivo">Motivo da reprovação (opcional)</Label>
              <Textarea
                id="motivo"
                placeholder="Descreva o motivo da reprovação para orientar o aluno..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalReprovacao({ open: false, avaliacao: null })}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={reprovarAvaliacao} 
              disabled={processando === modalReprovacao.avaliacao?.id}
            >
              {processando === modalReprovacao.avaliacao?.id ? 'Reprovando...' : 'Reprovar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Lista Completa */}
      <Dialog open={modalListaCompleta} onOpenChange={setModalListaCompleta}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Todas as Avaliações Pendentes
              <Badge variant="secondary">{avaliacoes.length}</Badge>
            </DialogTitle>
            <DialogDescription>
              Lista completa de avaliações aguardando aprovação
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[60vh] space-y-3">
            {avaliacoes.map((avaliacao) => renderizarItemAvaliacao(avaliacao, true))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalListaCompleta(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes da Avaliação */}
      <ModalDetalhesAvaliacao
        open={modalDetalhes.open}
        onClose={() => setModalDetalhes({ open: false, avaliacao: null })}
        avaliacao={modalDetalhes.avaliacao}
        titulo="Detalhes da Avaliação Pendente"
        mostrarAcoes={true}
        onAprovar={() => {
          setModalDetalhes({ open: false, avaliacao: null });
          // Converter AvaliacaoDetalhes para AvaliacaoPendente
          const avaliacaoPendente = modalDetalhes.avaliacao;
          if (avaliacaoPendente) {
            setModalAprovacao({ open: true, avaliacao: avaliacaoPendente });
          }
        }}
        onReprovar={() => {
          setModalDetalhes({ open: false, avaliacao: null });
          // Converter AvaliacaoDetalhes para AvaliacaoPendente
          const avaliacaoPendente = modalDetalhes.avaliacao;
          if (avaliacaoPendente) {
            setModalReprovacao({ open: true, avaliacao: avaliacaoPendente });
          }
        }}
        modoVisualizacao="completo"
      />
    </>
  );
}
