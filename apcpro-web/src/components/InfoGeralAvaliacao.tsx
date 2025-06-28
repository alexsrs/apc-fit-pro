import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface InfoGeralAvaliacaoProps {
  criadoEm: string;
  atualizadoEm?: string;
  usuario?: {
    nome: string;
    email: string;
  };
  professor?: {
    nome: string;
    email: string;
  };
  status?: string;
  tipo: string;
  objetivoClassificado?: string;
  validade?: string;
  observacoes?: string;
}

/**
 * Componente para exibir informações gerais comuns a todas as avaliações
 * Inclui dados como: data, usuário, professor, status, tipo, etc.
 */
export function InfoGeralAvaliacao({
  criadoEm,
  atualizadoEm,
  usuario,
  professor,
  status = "concluída",
  tipo,
  objetivoClassificado,
  validade,
  observacoes,
}: InfoGeralAvaliacaoProps) {
  /**
   * Formata uma data para exibição
   */
  const formatarData = (data: string): string => {
    return new Date(data).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Retorna o ícone e cor do status da avaliação
   */
  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case "concluída":
      case "concluido":
        return {
          icon: CheckCircle,
          color: "bg-green-100 text-green-800 border-green-200",
          text: "Concluída",
        };
      case "pendente":
        return {
          icon: AlertCircle,
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          text: "Pendente",
        };
      case "cancelada":
      case "cancelado":
        return {
          icon: XCircle,
          color: "bg-red-100 text-red-800 border-red-200",
          text: "Cancelada",
        };
      default:
        return {
          icon: Clock,
          color: "bg-gray-100 text-gray-800 border-gray-200",
          text: status,
        };
    }
  };

  /**
   * Retorna a cor do badge do tipo de avaliação
   */
  const getTipoColor = (tipo: string): string => {
    switch (tipo.toLowerCase()) {
      case "medidas":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "triagem":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "alto_rendimento":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "anamnese":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  /**
   * Formata o nome do tipo de avaliação
   */
  const formatarTipo = (tipo: string): string => {
    const tipos: Record<string, string> = {
      medidas: "Avaliação de Medidas",
      triagem: "Avaliação de Triagem",
      alto_rendimento: "Avaliação de Alto Rendimento",
      anamnese: "Anamnese",
    };
    return tipos[tipo.toLowerCase()] || tipo;
  };

  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="mb-6 border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Informações Gerais da Avaliação
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getTipoColor(tipo)}>{formatarTipo(tipo)}</Badge>
            <Badge className={statusInfo.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusInfo.text}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Datas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            <div>
              <span className="text-sm font-medium text-gray-700">
                Data de Criação:
              </span>
              <p className="text-sm text-gray-600">{formatarData(criadoEm)}</p>
            </div>
          </div>

          {atualizadoEm && atualizadoEm !== criadoEm && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Última Atualização:
                </span>
                <p className="text-sm text-gray-600">
                  {formatarData(atualizadoEm)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pessoas envolvidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {usuario && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Avaliado:
                </span>
                <p className="text-sm text-gray-600">{usuario.nome}</p>
                <p className="text-xs text-gray-500">{usuario.email}</p>
              </div>
            </div>
          )}

          {professor && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Professor:
                </span>
                <p className="text-sm text-gray-600">{professor.nome}</p>
                <p className="text-xs text-gray-500">{professor.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Informações adicionais */}
        {(objetivoClassificado || validade) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            {objetivoClassificado && (
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Objetivo:
                </span>
                <Badge variant="outline" className="ml-2">
                  {objetivoClassificado}
                </Badge>
              </div>
            )}

            {validade && (
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Validade:
                </span>
                <span className="ml-2 text-sm text-gray-600">
                  {formatarData(validade)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Observações */}
        {observacoes && (
          <div className="pt-2 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-700">
              Observações:
            </span>
            <p className="text-sm text-gray-600 mt-1">{observacoes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
