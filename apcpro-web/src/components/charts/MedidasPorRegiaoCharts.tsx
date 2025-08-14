import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface MedidasTronco {
  torax: number;
  cintura: number;
  abdome: number;
  quadril: number;
}

interface MedidasMembros {
  bracoEsquerdo: number;
  bracoEsquerdoContraido?: number;
  bracoDireito: number;
  bracoDireitoContraido?: number;
  anteBracoEsquerdo: number;
  anteBracoDireito: number;
}

interface MedidasMembrosInferiores {
  coxaEsquerda: number;
  coxaDireita: number;
  panturrilhaEsquerda: number;
  panturrilhaDireita: number;
}

interface MedidasPorRegiaoChartsProps {
  tronco: MedidasTronco;
  membrosSuperiores: MedidasMembros;
  membrosInferiores: MedidasMembrosInferiores;
}

export function MedidasPorRegiaoCharts({
  tronco,
  membrosSuperiores,
  membrosInferiores
}: MedidasPorRegiaoChartsProps) {

  // Dados para gráfico do tronco (Line Chart)
  const dadosTronco = [
    { regiao: 'Tórax', valor: tronco.torax, color: '#3b82f6' },
    { regiao: 'Cintura', valor: tronco.cintura, color: '#f97316' },
    { regiao: 'Abdome', valor: tronco.abdome, color: '#10b981' },
    { regiao: 'Quadril', valor: tronco.quadril, color: '#8b5cf6' }
  ];

  // Dados para membros superiores (Bar Chart comparativo)
  const dadosMembrosSuperiores = [
    {
      categoria: 'Braço E.',
      esquerdo: membrosSuperiores.bracoEsquerdo,
      direito: membrosSuperiores.bracoDireito,
      contraídoE: membrosSuperiores.bracoEsquerdoContraido || 0,
      contraídoD: membrosSuperiores.bracoDireitoContraido || 0
    },
    {
      categoria: 'Antebraço E.',
      esquerdo: membrosSuperiores.anteBracoEsquerdo,
      direito: membrosSuperiores.anteBracoDireito,
      contraídoE: 0,
      contraídoD: 0
    }
  ];

  // Dados para membros inferiores (Bar Chart comparativo)
  const dadosMembrosInferiores = [
    {
      categoria: 'Coxa E.',
      esquerdo: membrosInferiores.coxaEsquerda,
      direito: membrosInferiores.coxaDireita
    },
    {
      categoria: 'Panturrilha E.',
      esquerdo: membrosInferiores.panturrilhaEsquerda,
      direito: membrosInferiores.panturrilhaDireita
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value} cm
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Gráfico do Tronco - Line Chart */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="text-center mb-4">
          <h4 className="font-semibold text-gray-800 text-base">
            MEDIDAS DO TRONCO
          </h4>
          <p className="text-sm text-orange-600 mt-1">
            Evolução das medidas em Centímetros (cm)
          </p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={dadosTronco}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            
            <XAxis 
              dataKey="regiao"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            
            <YAxis 
              domain={['dataMin - 5', 'dataMax + 5']}
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Centímetros (cm)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: '12px' }
              }}
            />

            <Line
              type="monotone"
              dataKey="valor"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ 
                fill: '#3b82f6', 
                strokeWidth: 2, 
                r: 8
              }}
              label={{ 
                position: 'top',
                fill: '#1f2937',
                fontSize: 12,
                fontWeight: 600
              }}
            />

            <Tooltip content={<CustomTooltip />} />
          </LineChart>
        </ResponsiveContainer>

        {/* Legenda personalizada */}
        <div className="flex justify-center mt-4 space-x-6 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span>Tórax</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
            <span>Cintura</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span>Abdome</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
            <span>Quadril</span>
          </div>
        </div>
      </div>

      {/* Gráfico Membros Superiores - Bar Chart */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="text-center mb-4">
          <h4 className="font-semibold text-gray-800 text-base">
            MEMBROS SUPERIORES
          </h4>
          <p className="text-sm text-orange-600 mt-1">
            Evolução das medidas em Centímetros (cm)
          </p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={dadosMembrosSuperiores}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            
            <XAxis 
              dataKey="categoria"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            
            <YAxis 
              tick={{ fontSize: 12 }}
              domain={[0, 50]}
            />

            <Bar dataKey="esquerdo" fill="#6b7280" name="Esquerdo" />
            <Bar dataKey="direito" fill="#10b981" name="Direito" />
            {membrosSuperiores.bracoEsquerdoContraido && (
              <>
                <Bar dataKey="contraídoE" fill="#3b82f6" name="Contraído E." />
                <Bar dataKey="contraídoD" fill="#8b5cf6" name="Contraído D." />
              </>
            )}

            <Tooltip content={<CustomTooltip />} />
          </BarChart>
        </ResponsiveContainer>

        {/* Legenda */}
        <div className="flex justify-center mt-4 space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded mr-1"></div>
            <span>Braço E.</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded mr-1"></div>
            <span>Antebraço E.</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
            <span>Braço D.</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-600 rounded mr-1"></div>
            <span>Antebraço D.</span>
          </div>
        </div>
      </div>

      {/* Gráfico Membros Inferiores - Bar Chart */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="text-center mb-4">
          <h4 className="font-semibold text-gray-800 text-base">
            MEMBROS INFERIORES
          </h4>
          <p className="text-sm text-orange-600 mt-1">
            Evolução das medidas em Centímetros (cm)
          </p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={dadosMembrosInferiores}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            
            <XAxis 
              dataKey="categoria"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            
            <YAxis 
              tick={{ fontSize: 12 }}
              domain={[0, 80]}
            />

            <Bar dataKey="esquerdo" fill="#6b7280" name="Esquerdo" />
            <Bar dataKey="direito" fill="#10b981" name="Direito" />

            <Tooltip content={<CustomTooltip />} />
          </BarChart>
        </ResponsiveContainer>

        {/* Legenda */}
        <div className="flex justify-center mt-4 space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded mr-1"></div>
            <span>Coxa E.</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded mr-1"></div>
            <span>Panturrilha E.</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
            <span>Coxa D.</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-600 rounded mr-1"></div>
            <span>Panturrilha D.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
