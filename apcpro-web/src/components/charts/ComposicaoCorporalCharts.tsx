import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DadosComposicao {
  massaGorda: number;
  massaMagra: number;
  massaMuscular?: number;
  // Campos calculados pela API (avaliações novas)
  musculoEsqueletico?: number;
  massaOssea?: number;
  massaResidual?: number;
}

interface ComposicaoCorporalChartsProps {
  dados: DadosComposicao;
  peso: number;
  mostrarTodas?: boolean;
}

export function ComposicaoCorporalCharts({ 
  dados, 
  peso, 
  mostrarTodas = true
}: ComposicaoCorporalChartsProps) {
  
  // Debug: verificar dados recebidos
  console.log("🔍 ComposicaoCorporalCharts - Dados recebidos:", { dados, peso });
  
  // Verifica se é uma avaliação completa (nova) ou limitada (antiga)
  const isAvaliacaoCompleta = dados.musculoEsqueletico && dados.massaOssea && dados.massaResidual;
  
  // Gráfico Bi-compartmental (Massa Gorda vs Massa Magra)
  const dadosBiCompartmental = [
    {
      name: 'Massa Gorda',
      value: Number(((dados.massaGorda / peso) * 100).toFixed(1)),
      peso: dados.massaGorda,
      color: '#fbbf24'
    },
    {
      name: 'Massa Magra',
      value: Number(((dados.massaMagra / peso) * 100).toFixed(1)),
      peso: dados.massaMagra,
      color: '#f97316'
    }
  ];

  // Gráfico Tetra-compartmental (4 componentes)
  // Usa dados da API ou fallback simples para avaliações antigas
  const musculoEsqueleticoValor = dados.musculoEsqueletico || 0;
  const massaOsseaValor = dados.massaOssea || 0;
  const massaResidualValor = dados.massaResidual || 0;
  
  const dadosTetraCompartmental = [
    {
      name: 'Massa Gorda',
      value: Number(((dados.massaGorda / peso) * 100).toFixed(1)),
      peso: dados.massaGorda,
      color: '#fbbf24'
    },
    {
      name: 'Músculo Esq.',
      value: Number(((musculoEsqueleticoValor / peso) * 100).toFixed(1)),
      peso: musculoEsqueleticoValor,
      color: '#f97316'
    },
    {
      name: 'Massa Óssea',
      value: Number(((massaOsseaValor / peso) * 100).toFixed(1)),
      peso: massaOsseaValor,
      color: '#10b981'
    },
    {
      name: 'Massa Residual (órgãos internos)',
      value: Number(((massaResidualValor / peso) * 100).toFixed(1)),
      peso: massaResidualValor,
      color: '#3b82f6'
    }
  ];

  // Gráfico de Gordura vs Massa Muscular
  const dadosGorduraMuscular = [
    {
      name: 'Gordura',
      value: Number(((dados.massaGorda / peso) * 100).toFixed(1)),
      peso: dados.massaGorda,
      color: '#eab308'
    },
    {
      name: 'Massa Muscular',
      value: dados.massaMuscular ? Number(((dados.massaMuscular / peso) * 100).toFixed(1)) : 72.4,
      peso: dados.massaMuscular || (peso * 0.724),
      color: '#dc2626'
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-blue-600">
            {data.value}% ({data.peso.toFixed(1)} kg)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ value }: any) => {
    return `${value}%`;
  };

  const renderChart = (dados: any[], titulo: string, subtitulo?: string) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="text-center mb-4">
        <h4 className="font-semibold text-gray-800 text-base">
          COMPOSIÇÃO CORPORAL
        </h4>
        <p className="text-sm text-blue-600 mt-1">{titulo}</p>
        {subtitulo && (
          <p className="text-xs text-gray-500 mt-1">{subtitulo}</p>
        )}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dados}
            cx="50%"
            cy="45%"
            innerRadius={0}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={CustomLabel}
            labelLine={false}
          >
            {dados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="rect"
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  if (!mostrarTodas) {
    return renderChart(dadosBiCompartmental, 'Bi-compartimental');
  }

  return (
    <div className="space-y-6">
      {/* Gráfico Bi-compartimental */}
      {renderChart(dadosBiCompartmental, 'Bi-compartimental')}

      {/* Gráfico Tetra-compartimental - apenas se dados completos */}
      {isAvaliacaoCompleta ? (
        renderChart(dadosTetraCompartmental, 'Tetra-compartimental')
      ) : (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-center">
            <h4 className="font-semibold text-gray-800 text-base mb-2">
              COMPOSIÇÃO CORPORAL - Tetra-compartimental
            </h4>
            <p className="text-sm text-yellow-700">
              Dados completos disponíveis apenas em avaliações novas.
              <br />
              <span className="text-xs text-yellow-600">
                Refaça a avaliação para visualizar o gráfico tetra-compartimental.
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Gráfico Gordura vs Massa Muscular */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="text-center mb-4">
          <h4 className="font-semibold text-gray-800 text-base">
            COMPOSIÇÃO CORPORAL
          </h4>
          <p className="text-sm text-blue-600 mt-1">
            Músculo e Gordura em Percentual (%)
          </p>
        </div>

        {/* Gráfico de barras horizontal estilizado */}
        <div className="space-y-4">
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Massa Muscular</span>
              <span className="text-sm font-bold text-gray-800">
                {dadosGorduraMuscular[1].value}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-400 to-red-500 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ width: `${dadosGorduraMuscular[1].value}%` }}
              >
                72.4
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Gordura</span>
              <span className="text-sm font-bold text-gray-800">
                {dadosGorduraMuscular[0].value}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-8 rounded-full flex items-center justify-center text-gray-800 text-xs font-bold"
                style={{ width: `${dadosGorduraMuscular[0].value}%` }}
              >
                11.5
              </div>
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded mr-2"></div>
            <span className="text-xs text-gray-600">Gordura</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded mr-2"></div>
            <span className="text-xs text-gray-600">Massa Muscular</span>
          </div>
        </div>
      </div>
    </div>
  );
}
