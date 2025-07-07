/**
 * Modal reutilizável para exibir detalhes de avaliações
 * Pode ser usado em qualquer lugar do sistema onde precise mostrar dados de uma avaliação
 */

'use client';

import React from 'react';
import { ModalPadrao } from '@/components/ui/ModalPadrao';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ResultadoAvaliacao } from '@/components/ResultadoAvaliacao';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Calendar,
  User,
  Mail,
  FileText,
  Clock
} from 'lucide-react';

// Tipos para props do modal
interface AvaliacaoDetalhes {
  id: string;
  tipo: string;
  status: string;
  data: string;
  resultado: any;
  userPerfil?: {
    user: {
      name: string;
      email: string;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

interface ModalDetalhesAvaliacaoProps {
  open: boolean;
  onClose: () => void;
  avaliacao: AvaliacaoDetalhes | null;
  titulo?: string;
  mostrarAcoes?: boolean;
  onAprovar?: (avaliacao: AvaliacaoDetalhes) => void;
  onReprovar?: (avaliacao: AvaliacaoDetalhes) => void;
  onEditar?: (avaliacao: AvaliacaoDetalhes) => void;
  modoVisualizacao?: 'completo' | 'simples' | 'readonly';
}

/**
 * Modal reutilizável para exibir detalhes de avaliações de forma padronizada
 */
export function ModalDetalhesAvaliacao({
  open,
  onClose,
  avaliacao,
  titulo = "Detalhes da Avaliação",
  mostrarAcoes = false,
  onAprovar,
  onReprovar,
  onEditar,
  modoVisualizacao = 'completo'
}: ModalDetalhesAvaliacaoProps) {
  if (!avaliacao) return null;

  // Função para formatar o tipo de avaliação
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

  // Função para cor do status
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'aprovada':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'reprovada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para renderizar o resultado usando o componente ResultadoAvaliacao
  const renderResultadoAmigavel = (resultado: any, tipo: string) => {
    if (!resultado) return 'Nenhum dado disponível';
    
    try {
      const dados = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;
      
      return (
        <ResultadoAvaliacao
          resultado={dados}
          tipo={tipo}
          inModal={true}
        />
      );
    } catch (error) {
      console.error('Erro ao renderizar resultado:', error);
      // Fallback para JSON formatado apenas em caso de erro
      return (
        <pre className="text-sm whitespace-pre-wrap break-words bg-red-50 p-3 rounded border border-red-200">
          Erro ao processar dados: {JSON.stringify(resultado, null, 2)}
        </pre>
      );
    }
  };

  return (
    <ModalPadrao
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          {titulo}
        </div>
      }
      description={
        avaliacao.userPerfil
          ? `${formatarTipo(avaliacao.tipo)} de ${avaliacao.userPerfil.user.name}`
          : undefined
      }
      maxWidth="2xl"
    >
      {/* Informações básicas */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        {avaliacao.userPerfil && (
          <>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <Label className="text-sm font-medium text-gray-700">Aluno</Label>
                <p className="text-sm text-gray-900">{avaliacao.userPerfil.user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <p className="text-sm text-gray-900">{avaliacao.userPerfil.user.email}</p>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <div>
            <Label className="text-sm font-medium text-gray-700">Tipo</Label>
            <p className="text-sm text-gray-900">{formatarTipo(avaliacao.tipo)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <div>
            <Label className="text-sm font-medium text-gray-700">Data</Label>
            <p className="text-sm text-gray-900">
              {new Date(avaliacao.data).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <Label className="text-sm font-medium text-gray-700">Status</Label>
            <div className="mt-1">
              <Badge className={getStatusColor(avaliacao.status)}>
                {avaliacao.status === 'aprovada' ? 'Aprovada' : 
                 avaliacao.status === 'pendente' ? 'Pendente' : 
                 'Reprovada'}
              </Badge>
            </div>
          </div>
        </div>

        {avaliacao.createdAt && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>
              <Label className="text-sm font-medium text-gray-700">Criada em</Label>
              <p className="text-sm text-gray-500">
                {new Date(avaliacao.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dados da avaliação */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Dados da Avaliação
        </Label>
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          {renderResultadoAmigavel(avaliacao.resultado, avaliacao.tipo)}
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex justify-between items-center pt-4 border-t">
        {mostrarAcoes && (avaliacao.status === 'pendente') && (
          <div className="flex gap-2">
            {onAprovar && (
              <Button
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-50"
                onClick={() => onAprovar(avaliacao)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Aprovar
              </Button>
            )}
            
            {onReprovar && (
              <Button
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => onReprovar(avaliacao)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reprovar
              </Button>
            )}
          </div>
        )}

        <div className="flex gap-2 ml-auto">
          {onEditar && modoVisualizacao !== 'readonly' && (
            <Button
              variant="outline"
              onClick={() => onEditar(avaliacao)}
            >
              Editar
            </Button>
          )}
          
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </ModalPadrao>
  );
}
