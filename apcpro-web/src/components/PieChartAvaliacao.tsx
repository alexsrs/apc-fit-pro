// Adiciona suporte ao gráfico de pizza para exibir percentual de gordura, massa magra, massa gorda e músculo esquelético
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export interface PieChartAvaliacaoProps {
  percentualGordura: number;
  massaMagra: number;
  massaGorda: number;
  massaMuscular?: number;
  musculoEsqueletico?: number;
}

const COLORS = ['#2563eb', '#22c55e', '#f59e42', '#a21caf', '#16a34a'];

export const PieChartAvaliacao: React.FC<PieChartAvaliacaoProps> = ({
  percentualGordura,
  massaMagra,
  massaGorda,
  massaMuscular,
  musculoEsqueletico
}) => {
  // Monta os dados para o gráfico
  const data = [
    { name: 'Gordura (%)', value: percentualGordura },
    { name: 'Massa Magra (kg)', value: massaMagra },
    { name: 'Massa Gorda (kg)', value: massaGorda },
  ];
  
  if (massaMuscular !== undefined) {
    data.push({ name: 'Massa Muscular (kg)', value: massaMuscular });
  }
  
  if (musculoEsqueletico !== undefined) {
    data.push({ name: 'Músculo Esquelético (kg)', value: musculoEsqueletico });
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => {
              const isPercent = name.toLowerCase().includes('%');
              return [`${value.toFixed(1)}${isPercent ? '%' : 'kg'}`, name];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-gray-700">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
