import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface DobrasCutaneasData {
  [key: string]: number;
}

interface DobrasCutaneasChartProps {
  dobras: DobrasCutaneasData;
  orientacao?: 'horizontal' | 'vertical';
}

export function DobrasCutaneasChart({
  dobras,
  orientacao = 'horizontal'
}: DobrasCutaneasChartProps) {

  // Mapeamento das dobras com cores específicas
  const dobrasCores: { [key: string]: string } = {
    'triceps': '#8b5cf6',
    'biceps': '#fbbf24', 
    'peitoral': '#3b82f6',
    'axilarMedia': '#f97316',
    'subescapular': '#ef4444',
    'abdominal': '#10b981',
    'suprailiaca': '#06b6d4',
    'coxa': '#ec4899',
    'panturrilha': '#f59e0b'
  };

  // Mapeamento dos nomes das dobras para exibição
  const nomesdobras: { [key: string]: string } = {
    'triceps': 'Tríceps',
    'biceps': 'Bíceps', 
    'peitoral': 'Peitoral',
    'axilarMedia': 'Axilar Média',
    'subescapular': 'Subescapular',
    'abdominal': 'Abdominal',
    'suprailiaca': 'Supra-ilíaca',
    'coxa': 'Coxa',
    'panturrilha': 'Panturrilha'
  };

  // Preparar dados para o gráfico
  const dadosGrafico = Object.entries(dobras)
  .filter(([, valor]) => valor > 0) // Filtrar apenas dobras com valores
    .map(([nome, valor]) => ({
      nome: nomesdobras[nome] || nome,
      nomeOriginal: nome,
      valor: Number(valor.toFixed(1)),
      cor: dobrasCores[nome] || '#6b7280'
    }))
    .sort((a, b) => b.valor - a.valor); // Ordenar por valor decrescente

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            {payload[0].value} mm
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ value }: any) => {
    return (
      <text 
        x={0} 
        y={0} 
        dy={4} 
        textAnchor="middle" 
        fill="#374151" 
        fontSize="11"
        fontWeight="600"
      >
        {value}
      </text>
    );
  };

  if (orientacao === 'horizontal') {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="text-center mb-4">
          <h4 className="font-semibold text-gray-800 text-base">
            DOBRAS CUTÂNEAS
          </h4>
          <p className="text-sm text-orange-600 mt-1">
            Evolução das Dobras Cutâneas em Milímetros (mm)
          </p>
        </div>

        <div className="space-y-3">
          {dadosGrafico.map((dobra) => {
            const maxValor = Math.max(...dadosGrafico.map(d => d.valor));
            const larguraPercent = (dobra.valor / maxValor) * 100;
            
            return (
              <div key={dobra.nomeOriginal} className="flex items-center">
                {/* Nome da dobra */}
                <div className="w-24 text-right pr-3">
                  <span className="text-xs text-gray-600 font-medium">
                    {dobra.nome}
                  </span>
                </div>

                {/* Barra horizontal */}
                <div className="flex-1 relative">
                  <div className="w-full bg-gray-100 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-300"
                      style={{ 
                        width: `${Math.max(larguraPercent, 15)}%`, // Mínimo 15% para mostrar o valor
                        backgroundColor: dobra.cor 
                      }}
                    >
                      {dobra.valor}
                    </div>
                  </div>
                </div>

                {/* Valor em mm */}
                <div className="w-16 text-left pl-3">
                  <span className="text-xs text-gray-500">
                    {dobra.valor} mm
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legenda de cores */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
          {dadosGrafico.slice(0, 9).map((dobra) => (
            <div key={dobra.nomeOriginal} className="flex items-center">
              <div 
                className="w-3 h-3 rounded mr-2"
                style={{ backgroundColor: dobra.cor }}
              ></div>
              <span className="text-gray-600">{dobra.nome}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Gráfico vertical (Bar Chart)
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="text-center mb-4">
        <h4 className="font-semibold text-gray-800 text-base">
          DOBRAS CUTÂNEAS
        </h4>
        <p className="text-sm text-orange-600 mt-1">
          Evolução das Dobras Cutâneas em Milímetros (mm)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={dadosGrafico}
          margin={{ top: 30, right: 30, left: 20, bottom: 80 }}
          barCategoryGap="10%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          
          <XAxis 
            dataKey="nome"
            tick={{ fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
          />
          
          <YAxis 
            tick={{ fontSize: 12 }}
            domain={[0, 'dataMax + 20']}
            label={{ 
              value: 'Milímetros (mm)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fontSize: '12px' }
            }}
          />

          <Bar 
            dataKey="valor" 
            radius={[4, 4, 0, 0]}
            label={<CustomLabel />}
          >
            {dadosGrafico.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.cor} />
            ))}
          </Bar>

          <Tooltip content={<CustomTooltip />} />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}
