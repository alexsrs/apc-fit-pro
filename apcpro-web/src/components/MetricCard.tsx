// src/components/MetricCard.tsx
import { ReactNode } from "react";

type MetricCardProps = {
  icon: ReactNode;
  title: string;
  value: string | number;
  variacao?: string;
  cor?: string;
  descricao?: string;
  description?: string;
  acao?: ReactNode;
  // Props para compatibilidade com dashboard do professor
  indicator?: ReactNode;
  indicatorColor?: string;
  indicatorText?: string;
  subtitle?: string;
};

export function MetricCard({
  icon,
  title,
  value,
  variacao,
  cor,
  descricao,
  description,
  acao,
  indicator,
  indicatorColor,
  indicatorText,
  subtitle,
}: MetricCardProps) {
  // Unifica para 'title' e 'value' como padrão
  const displayDescricao = descricao || description;

  return (
    <div className="rounded-xl shadow-md p-4 flex flex-col items-center bg-white max-w-full">
      <div className="flex items-center gap-1 w-full justify-between">
        <span className="flex items-center gap-1 min-w-0">
          {icon}
          <span className="text-sm font-medium text-muted-foreground truncate max-w-[120px] md:max-w-[140px]">
            {title}
          </span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-2xl font-bold whitespace-nowrap">{value}</span>
          {variacao && (
            <span className={`ml-2 text-sm ${cor ?? ""}`}>{variacao}</span>
          )}
          {indicator && <span className={indicatorColor}>{indicator}</span>}
        </span>
      </div>
      {(variacao || indicatorText || subtitle) && (
        <div className="flex justify-between items-center w-full mt-2">
          {variacao && <span className={cor + " font-medium"}>{variacao}</span>}
          {indicatorText && (
            <span className={indicatorColor + " font-medium"}>
              {indicatorText}
            </span>
          )}
          {subtitle && (
            <span className="text-sm text-muted-foreground truncate max-w-[100px] md:max-w-[140px]">
              {subtitle}
            </span>
          )}
        </div>
      )}
      {displayDescricao && (
        <p className="mt-1 text-xs text-muted-foreground w-full text-left truncate max-w-full">
          {displayDescricao}
        </p>
      )}
      {/* Ação (ex: botão) sempre abaixo de tudo */}
      {acao && <div className="w-full flex justify-end mt-2">{acao}</div>}
    </div>
  );
}
