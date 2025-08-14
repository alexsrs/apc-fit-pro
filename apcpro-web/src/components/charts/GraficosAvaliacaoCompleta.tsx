import React from 'react';
import { EvolucaoPesoChart } from './EvolucaoPesoChart';
import { ComposicaoCorporalCharts } from './ComposicaoCorporalCharts';
import { MedidasPorRegiaoCharts } from './MedidasPorRegiaoCharts';
import { DobrasCutaneasChart } from './DobrasCutaneasChart';

export interface DadosCompletos {
  // Dados básicos
  peso: number;
  altura: number;
  
  // Composição corporal
  composicao: {
    massaGorda: number;
    massaMagra: number;
    massaMuscular: number;
    musculoEsqueletico: number;
    massaOssea?: number;
    massaResidual?: number;
  };
  
  // Medidas corporais
  medidas: {
    tronco: {
      torax: number;
      cintura: number;
      abdome: number;
      quadril: number;
    };
    membrosSuperiores: {
      bracoEsquerdo: number;
      bracoEsquerdoContraido?: number;
      bracoDireito: number;
      bracoDireitoContraido?: number;
      anteBracoEsquerdo: number;
      anteBracoDireito: number;
    };
    membrosInferiores: {
      coxaEsquerda: number;
      coxaDireita: number;
      panturrilhaEsquerda: number;
      panturrilhaDireita: number;
    };
  };
  
  // Dobras cutâneas
  dobras: {
    [key: string]: number;
  };
  
  // Evolução do peso (opcional)
  evolucaoPeso?: Array<{
    data: string;
    peso: number;
    meta?: number;
  }>;
  
  // Metadados
  dataAvaliacao?: string;
}

interface GraficosAvaliacaoCompletaProps {
  dados: DadosCompletos;
  mostrarEvolucao?: boolean;
  mostrarComposicaoCompleta?: boolean;
}

export function GraficosAvaliacaoCompleta({
  dados,
  mostrarEvolucao = false,
  mostrarComposicaoCompleta = true
}: GraficosAvaliacaoCompletaProps) {

  return (
    <div className="space-y-8">
      {/* Título da seção */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📊 Análise Visual Completa
        </h2>
        <p className="text-gray-600">
          Gráficos baseados nos dados da sua avaliação física
        </p>
      </div>

      {/* Evolução do Peso (opcional) */}
      {mostrarEvolucao && dados.evolucaoPeso && dados.evolucaoPeso.length > 1 && (
        <EvolucaoPesoChart
          dados={dados.evolucaoPeso}
          pesoAtual={dados.peso}
          altura={dados.altura}
        />
      )}

      {/* Composição Corporal - Múltiplos gráficos */}
      <ComposicaoCorporalCharts
        dados={dados.composicao}
        peso={dados.peso}
        mostrarTodas={mostrarComposicaoCompleta}
      />

      {/* Medidas por Região */}
      <MedidasPorRegiaoCharts
        tronco={dados.medidas.tronco}
        membrosSuperiores={dados.medidas.membrosSuperiores}
        membrosInferiores={dados.medidas.membrosInferiores}
      />

      {/* Dobras Cutâneas */}
      <DobrasCutaneasChart
        dobras={dados.dobras}
        orientacao="horizontal"
      />

      {/* Resumo dos dados */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          📋 Resumo dos Indicadores
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {dados.peso.toFixed(1)} kg
            </div>
            <div className="text-sm text-gray-600">Peso Corporal</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {((dados.composicao.massaGorda / dados.peso) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Gordura Corporal</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {dados.composicao.massaMagra.toFixed(1)} kg
            </div>
            <div className="text-sm text-gray-600">Massa Magra</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {dados.composicao.massaMuscular.toFixed(1)} kg
            </div>
            <div className="text-sm text-gray-600">Massa Muscular</div>
          </div>
        </div>
        
        {/* Observações importantes */}
        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-2">💡 Observações Importantes:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Os gráficos mostram sua composição corporal atual detalhada</li>
            <li>• Compare as medidas bilaterais para identificar assimetrias</li>
            <li>• As dobras cutâneas indicam distribuição de gordura subcutânea</li>
            <li>• Acompanhe a evolução regular para monitorar seu progresso</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Hook para preparar dados a partir de uma avaliação do sistema
export function useDadosGraficosCompletos(avaliacao: any) {
  const dados: DadosCompletos = {
    peso: avaliacao.peso,
    altura: avaliacao.altura,
    
    composicao: {
      massaGorda: avaliacao.resultados?.massaGorda || 0,
      massaMagra: avaliacao.resultados?.massaMagra || 0,
      massaMuscular: avaliacao.resultados?.massaMuscular || 0,
      musculoEsqueletico: avaliacao.resultados?.musculoEsqueletico || 0,
    },
    
    medidas: {
      tronco: {
        torax: avaliacao.medidas?.torax || 0,
        cintura: avaliacao.medidas?.cintura || 0,
        abdome: avaliacao.medidas?.abdome || 0,
        quadril: avaliacao.medidas?.quadril || 0,
      },
      membrosSuperiores: {
        bracoEsquerdo: avaliacao.medidas?.bracoEsquerdo || 0,
        bracoDireito: avaliacao.medidas?.bracoDireito || 0,
        anteBracoEsquerdo: avaliacao.medidas?.anteBracoEsquerdo || 0,
        anteBracoDireito: avaliacao.medidas?.anteBracoDireito || 0,
      },
      membrosInferiores: {
        coxaEsquerda: avaliacao.medidas?.coxaEsquerda || 0,
        coxaDireita: avaliacao.medidas?.coxaDireita || 0,
        panturrilhaEsquerda: avaliacao.medidas?.panturrilhaEsquerda || 0,
        panturrilhaDireita: avaliacao.medidas?.panturrilhaDireita || 0,
      },
    },
    
    dobras: avaliacao.dobras || {},
    
    dataAvaliacao: avaliacao.dataAvaliacao ? 
      new Date(avaliacao.dataAvaliacao).toLocaleDateString('pt-BR') : 
      'Data não informada'
  };
  
  return dados;
}
