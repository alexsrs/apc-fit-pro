// Componente de evolução de massa magra/peso
import { ArrowUpRight } from "lucide-react";
import React from "react";

type CardEvolucaoProps = {
  label: string;
  valor: number;
  unidade?: string;
};

export function CardEvolucao({
  label,
  valor,
  unidade = "kg",
}: CardEvolucaoProps) {
  const positivo = valor > 0;

  return (
    <div className="flex items-center gap-2 p-4 bg-white rounded shadow">
      <span className="font-medium text-gray-700">{label}</span>
      <span
        className={`flex items-center gap-1 font-bold ${
          positivo ? "text-green-600" : "text-red-600"
        }`}
      >
        {positivo && "+"}
        {valor}
        {unidade}
        {positivo && <ArrowUpRight className="w-4 h-4" aria-label="Aumento" />}
      </span>
    </div>
  );
}
