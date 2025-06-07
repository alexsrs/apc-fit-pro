// src/components/MetricCard.tsx
import React from "react";

type MetricCardProps = {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  variacao?: string;
  cor?: string;
  descricao?: string;
  description?: string;
  acao?: React.ReactNode;
  indicator?: React.ReactNode;
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
  indicatorText
}: MetricCardProps) {
  const displayDescricao = descricao || description;

  return (
    <div className="rounded-xl shadow-md p-4 flex flex-col bg-white min-h-[180px] h-full">
      {/* Topo: ícone e título */}
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-base font-medium text-zinc-700 truncate">
          {title}
        </span>
      </div>
      {/* Valor principal, indicador e botão à direita */}
      <div className="flex flex-row items-center justify-between flex-1 w-full">
        <span className="text-2xl font-bold font-mono text-zinc-900">
          {value}
        </span>
        <div className="flex flex-col items-end ml-2 gap-2">
          {(variacao || indicatorText) && (
            <div className="flex flex-col items-end">
              {variacao && (
                <span className={cor + " font-medium"}>{variacao}</span>
              )}
              {indicatorText && (
                <span className={indicatorColor + " font-medium"}>
                  {indicatorText}
                </span>
              )}
              {indicator && <span className={indicatorColor}>{indicator}</span>}
            </div>
          )}
        </div>
      </div>
      {/* Botão sempre à direita, abaixo do valor */}
      {acao && <div className="flex justify-end w-full mt-2">{acao}</div>}
      {/* Rodapé: descrição sempre no final */}
      {displayDescricao && (
        <p className="mt-auto pt-2 text-xs text-zinc-500 w-full text-left truncate">
          {displayDescricao}
        </p>
      )}
    </div>
  );
}
