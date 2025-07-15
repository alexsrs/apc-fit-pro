import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Avaliacao } from "./ListaAvaliacoes";

type HistoricoAvaliacoesProps = {
  avaliacoes: Avaliacao[];
  onVer?: (avaliacao: Avaliacao) => void;
};

export function HistoricoAvaliacoes({ avaliacoes, onVer }: HistoricoAvaliacoesProps) {
  if (!avaliacoes.length) return <div>Nenhum histórico de avaliações.</div>;
  return (
    <ul className="divide-y divide-gray-200">
      {avaliacoes.map((a) => {
        let statusReal = a.status;
        if (a.status === 'aprovada' && a.validadeAte) {
          const vencida = new Date(a.validadeAte) < new Date();
          if (vencida) statusReal = 'vencida';
        }
        let badgeClass = "";
        let badgeText = "";
        let badgeIcon = null;
        if (statusReal === "aprovada") {
          badgeClass = "bg-green-100 text-green-700 border border-green-200";
          badgeText = "Aprovada";
          badgeIcon = <CheckCircle className="h-3 w-3" />;
        } else if (statusReal === "reprovada") {
          badgeClass = "bg-red-100 text-red-700 border border-red-200";
          badgeText = "Reprovada";
          badgeIcon = <AlertCircle className="h-3 w-3" />;
        } else if (statusReal === "vencida") {
          badgeClass = "bg-gray-100 text-gray-700 border border-gray-200";
          badgeText = "Vencida";
          badgeIcon = <AlertCircle className="h-3 w-3" />;
        } else {
          badgeClass = "bg-gray-100 text-gray-700 border border-gray-200";
          badgeText = statusReal || "Indefinido";
        }
        return (
          <li
            key={a.id}
            className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
              <span className="font-medium truncate max-w-[120px]">{a.tipo}</span>
              <span className="text-xs text-gray-500">{new Date(a.data).toLocaleDateString('pt-BR')}</span>
              <span className="text-xs text-gray-500">{a.email || a.userPerfil?.user?.email}</span>
            </div>
            <div className="flex items-center gap-2 min-w-fit md:justify-end md:text-right">
              <Badge className={`${badgeClass} flex items-center gap-1`}>
                {badgeIcon}
                {badgeText}
              </Badge>
            </div>
            <Button size="sm" variant="outline" onClick={() => onVer && onVer(a)}>
              Ver
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
