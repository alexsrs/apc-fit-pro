import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface DadosEvolucaoPeso {
  data: string;
  peso: number;
  pesoIdeal?: number;
  meta?: number;
}

interface EvolucaoPesoChartProps {
  dados: DadosEvolucaoPeso[];
  pesoAtual: number;
  unidade?: string;
  altura?: number;
}

export function EvolucaoPesoChart({ 
  dados, 
  pesoAtual, 
  unidade = 'kg',
  altura 
}: EvolucaoPesoChartProps) {
  // Calcular faixa de peso ideal baseada no IMC (18.5 - 24.9)
  const pesoIdealMin = altura ? (18.5 * (altura / 100) ** 2) : undefined;
  const pesoIdealMax = altura ? (24.9 * (altura / 100) ** 2) : undefined;

  const formatarData = (dataStr: string) => {
    const data = new Date(dataStr);
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">
            Data: {formatarData(label)}
          </p>
          <p className="text-blue-600">
            Peso: {payload[0].value} {unidade}
          </p>
          {payload[0].payload.meta && (
            <p className="text-green-600">
              Meta: {payload[0].payload.meta} {unidade}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calcular range do gráfico
  const pesos = dados.map(d => d.peso);
  const minPeso = Math.min(...pesos);
  const maxPeso = Math.max(...pesos);
  const margin = (maxPeso - minPeso) * 0.1 || 5;

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          📈 Evolução do Peso Corporal
        </h3>
        <p className="text-sm text-gray-600">
          Lembre-se: Avalie o peso juntamente com os demais indicadores.
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={dados}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            
            <XAxis 
              dataKey="data"
              tickFormatter={formatarData}
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            
            <YAxis 
              domain={[minPeso - margin, maxPeso + margin]}
              tick={{ fontSize: 12 }}
              stroke="#666"
              label={{ 
                value: `PESO (${unidade})`, 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: '12px', fill: '#666' }
              }}
            />

            {/* Faixa de peso ideal */}
            {pesoIdealMin && pesoIdealMax && (
              <>
                <ReferenceLine 
                  y={pesoIdealMin} 
                  stroke="#22c55e" 
                  strokeDasharray="5 5" 
                  opacity={0.7}
                />
                <ReferenceLine 
                  y={pesoIdealMax} 
                  stroke="#22c55e" 
                  strokeDasharray="5 5" 
                  opacity={0.7}
                />
              </>
            )}

            {/* Linha de meta (se definida) */}
            {dados.some(d => d.meta) && (
              <Line
                type="monotone"
                dataKey="meta"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="8 8"
                dot={false}
                name="Meta"
              />
            )}

            {/* Linha principal do peso */}
            <Line
              type="monotone"
              dataKey="peso"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ 
                fill: '#3b82f6', 
                strokeWidth: 2, 
                r: 6,
                stroke: '#fff'
              }}
              activeDot={{ 
                r: 8, 
                fill: '#1d4ed8',
                stroke: '#fff',
                strokeWidth: 2
              }}
              name="Peso"
            />

            <Tooltip content={<CustomTooltip />} />
          </LineChart>
        </ResponsiveContainer>

        {/* Indicador do peso atual */}
        <div className="mt-4 flex items-center justify-center">
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-sm text-blue-600 font-medium">
              Peso Atual: {pesoAtual} {unidade}
            </span>
          </div>
        </div>

        {/* Legenda da faixa ideal */}
        {pesoIdealMin && pesoIdealMax && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            Faixa ideal (IMC 18.5-24.9): {pesoIdealMin.toFixed(1)} - {pesoIdealMax.toFixed(1)} {unidade}
          </div>
        )}
      </div>
    </div>
  );
}
