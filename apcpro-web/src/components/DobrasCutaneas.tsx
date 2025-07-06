import React, { useState } from "react";
import { Input } from "../components/ui/input";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import apiClient from "../lib/api-client";
import "../styles/dobras-cutaneas.css";

// Interface para as dobras cutâneas (7 pontos)
interface DobrasCutaneas {
  triceps: number;          // mm
  subescapular: number;     // mm
  suprailiaca: number;      // mm
  abdominal: number;        // mm
  coxa: number;             // mm
  axilarMedia: number;      // mm
  panturrilhaMedial: number; // mm
}

// Interfaces para os resultados dos protocolos
interface ResultadoProtocolo {
  percentualGordura: number;
  classificacao: string;
  massaGorda: number;
  massaMagra: number;
}

interface ResultadosProtocolos {
  faulkner?: ResultadoProtocolo;
  pollock?: ResultadoProtocolo;
  guedes?: ResultadoProtocolo;
}

// Props do componente
interface DobrasCutaneasProps {
  peso: number;
  idade: number;
  sexo: 'masculino' | 'feminino';
  onResultados: (resultados: ResultadosProtocolos) => void;
  className?: string;
}

// Lista das dobras com suas informações
const dobrasList = [
  {
    id: "triceps",
    label: "Tríceps",
    tooltip: "Dobra vertical na face posterior do braço, no ponto médio entre o acrômio e o olécrano.",
  },
  {
    id: "subescapular",
    label: "Subescapular",
    tooltip: "Dobra oblíqua logo abaixo do ângulo inferior da escápula, seguindo a linha natural da pele.",
  },
  {
    id: "suprailiaca",
    label: "Supra-ilíaca",
    tooltip: "Dobra oblíqua imediatamente acima da crista ilíaca anterossuperior, na linha axilar média.",
  },
  {
    id: "abdominal",
    label: "Abdominal",
    tooltip: "Dobra vertical ao lado do umbigo, aproximadamente 2 cm lateralmente.",
  },
  {
    id: "coxa",
    label: "Coxa",
    tooltip: "Dobra vertical na face anterior da coxa, no ponto médio entre a prega inguinal e a borda superior da patela.",
  },
  {
    id: "axilarMedia",
    label: "Axilar Média",
    tooltip: "Dobra vertical na linha axilar média, ao nível do processo xifoide do esterno.",
  },
  {
    id: "panturrilhaMedial",
    label: "Panturrilha Medial",
    tooltip: "Dobra vertical na face medial da panturrilha, no nível de maior circunferência.",
  },
] as const;

export function DobrasCutaneas({ peso, idade, sexo, onResultados, className }: DobrasCutaneasProps) {
  const [dobras, setDobras] = useState<Partial<DobrasCutaneas>>({});
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState<ResultadosProtocolos>({});
  const [calculado, setCalculado] = useState(false);
  const [dobraAtiva, setDobraAtiva] = useState<string>(''); // Para destacar na silhueta

  // Atualiza os valores das dobras
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    const newDobras = {
      ...dobras,
      [id]: value ? Number(value) : undefined
    };
    setDobras(newDobras);
    
    // Verificar se todas as dobras foram preenchidas para mostrar feedback visual
    const todasPreenchidas = dobrasList.every(dobra => 
      newDobras[dobra.id as keyof DobrasCutaneas] && 
      newDobras[dobra.id as keyof DobrasCutaneas]! > 0
    );
    
    if (todasPreenchidas && !calculado) {
      // Pequena vibração/feedback quando todas as dobras estão preenchidas
      setTimeout(() => {
        const button = document.querySelector('[data-calculate-button]') as HTMLButtonElement;
        if (button) {
          button.style.animation = 'bounce 0.5s ease-in-out';
          setTimeout(() => {
            button.style.animation = '';
          }, 500);
        }
      }, 100);
    }
  }

  // Valida se todas as dobras foram preenchidas
  function validarDobras(): boolean {
    const dobraKeys = dobrasList.map(d => d.id);
    return dobraKeys.every(key => dobras[key] && dobras[key]! > 0);
  }

  // Calcula os protocolos via API
  async function calcularProtocolos() {
    if (!validarDobras()) {
      alert("Preencha todas as 7 dobras cutâneas antes de calcular.");
      return;
    }

    setLoading(true);
    
    try {
      // Prepara os dados para enviar à API
      const medidasCompletas = {
        peso,
        altura: 175, // Valor padrão - será usado só para IMC se necessário
        idade,
        sexo,
        dobrasCutaneas: dobras as DobrasCutaneas,
      };

      // Chama a API do backend que calcula todos os protocolos
      const response = await apiClient.post('/api/calcular-medidas', medidasCompletas);
      
      if (response.data && response.data.dobrasCutaneas) {
        const resultadosCalculados = response.data.dobrasCutaneas;
        setResultados(resultadosCalculados);
        setCalculado(true);
        onResultados(resultadosCalculados);
      } else {
        console.error('Resposta inesperada da API:', response.data);
        alert('Erro ao calcular os protocolos. Verifique os dados inseridos.');
      }
    } catch (error) {
      console.error('Erro ao calcular protocolos:', error);
      alert('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  // Função utilitária para renderizar label com tooltip
  function LabelWithTooltip({
    htmlFor,
    label,
    tooltip,
  }: {
    htmlFor: string;
    label: string;
    tooltip?: string;
  }) {
    return (
      <label className="block text-sm font-medium mb-1" htmlFor={htmlFor}>
        {label}
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ml-1 text-xs text-muted-foreground cursor-help">
                  ⓘ
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </label>
    );
  }

  // Função para obter cor da classificação
  function getClassificacaoCor(classificacao: string): string {
    const classificacaoLower = classificacao.toLowerCase();
    if (classificacaoLower.includes('excelente') || classificacaoLower.includes('atleta')) {
      return 'bg-green-100 text-green-800';
    }
    if (classificacaoLower.includes('bom') || classificacaoLower.includes('muito baixo')) {
      return 'bg-blue-100 text-blue-800';
    }
    if (classificacaoLower.includes('médio') || classificacaoLower.includes('baixo')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (classificacaoLower.includes('ruim') || classificacaoLower.includes('alto')) {
      return 'bg-orange-100 text-orange-800';
    }
    if (classificacaoLower.includes('muito ruim') || classificacaoLower.includes('muito alto')) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  }

  // Componente da silhueta humana interativa
  function SilhuetaHumana() {
    const handlePontoClick = (dobraId: string) => {
      setDobraAtiva(dobraId);
      // Focar no input correspondente
      const input = document.getElementById(dobraId) as HTMLInputElement;
      if (input) {
        input.focus();
      }
    };

    return (
      <div className="silhueta-container">
        <svg
          width="220"
          height="450"
          viewBox="0 0 220 450"
          className="drop-shadow-sm"
        >
          {/* Gradiente para dar profundidade */}
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#3B82F6" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#60A5FA" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.65" />
            </linearGradient>
            <linearGradient id="limbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.7" />
            </linearGradient>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#1E3A8A" floodOpacity="0.3"/>
            </filter>
          </defs>
          
          {/* Corpo da silhueta - mais anatômico */}
          <g fill="url(#bodyGradient)" stroke="#1E3A8A" strokeWidth="1.5" filter="url(#shadow)">
            {/* Cabeça mais realista */}
            <ellipse cx="110" cy="45" rx="22" ry="28" />
            
            {/* Pescoço */}
            <path d="M 95 70 L 125 70 L 122 85 L 98 85 Z" />
            
            {/* Tronco anatômico - peito e cintura */}
            <path d="M 98 85 
                     C 75 95, 65 120, 70 140
                     C 72 160, 75 180, 80 200
                     C 85 220, 90 240, 95 250
                     L 125 250
                     C 130 240, 135 220, 140 200
                     C 145 180, 148 160, 150 140
                     C 155 120, 145 95, 122 85
                     Z" />
            
            {/* Ombros mais definidos */}
            <ellipse cx="70" cy="100" rx="8" ry="15" />
            <ellipse cx="150" cy="100" rx="8" ry="15" />
            
            {/* Braços superiores */}
            <ellipse cx="58" cy="125" rx="10" ry="30" transform="rotate(-10 58 125)" fill="url(#limbGradient)" />
            <ellipse cx="162" cy="125" rx="10" ry="30" transform="rotate(10 162 125)" fill="url(#limbGradient)" />
            
            {/* Antebraços */}
            <ellipse cx="52" cy="170" rx="8" ry="25" transform="rotate(-5 52 170)" fill="url(#limbGradient)" />
            <ellipse cx="168" cy="170" rx="8" ry="25" transform="rotate(5 168 170)" fill="url(#limbGradient)" />
            
            {/* Mãos */}
            <ellipse cx="50" cy="200" rx="6" ry="12" fill="url(#limbGradient)" />
            <ellipse cx="170" cy="200" rx="6" ry="12" fill="url(#limbGradient)" />
            
            {/* Quadril mais anatômico */}
            <path d="M 95 250
                     C 88 255, 85 265, 90 275
                     C 95 285, 100 290, 110 295
                     L 110 295
                     C 120 290, 125 285, 130 275
                     C 135 265, 132 255, 125 250
                     Z" />
            
            {/* Coxas */}
            <ellipse cx="95" cy="330" rx="13" ry="45" fill="url(#limbGradient)" />
            <ellipse cx="125" cy="330" rx="13" ry="45" fill="url(#limbGradient)" />
            
            {/* Joelhos */}
            <ellipse cx="95" cy="375" rx="8" ry="8" fill="url(#limbGradient)" />
            <ellipse cx="125" cy="375" rx="8" ry="8" fill="url(#limbGradient)" />
            
            {/* Panturrilhas */}
            <ellipse cx="95" cy="405" rx="11" ry="25" fill="url(#limbGradient)" />
            <ellipse cx="125" cy="405" rx="11" ry="25" fill="url(#limbGradient)" />
            
            {/* Pés */}
            <ellipse cx="95" cy="435" rx="8" ry="10" fill="url(#limbGradient)" />
            <ellipse cx="125" cy="435" rx="8" ry="10" fill="url(#limbGradient)" />
          </g>
          
          {/* Pontos de medição das dobras - posições atualizadas */}
          {/* Tríceps - braço direito */}
          <circle
            cx="162"
            cy="125"
            r="8"
            fill={dobraAtiva === 'triceps' ? '#EF4444' : dobras.triceps ? '#10B981' : '#6B7280'}
            stroke={dobraAtiva === 'triceps' ? '#DC2626' : dobras.triceps ? '#059669' : '#4B5563'}
            strokeWidth="2"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handlePontoClick('triceps')}
          />
          
          {/* Subescapular - costas/escápula */}
          <circle
            cx="135"
            cy="130"
            r="8"
            fill={dobraAtiva === 'subescapular' ? '#EF4444' : dobras.subescapular ? '#10B981' : '#6B7280'}
            stroke={dobraAtiva === 'subescapular' ? '#DC2626' : dobras.subescapular ? '#059669' : '#4B5563'}
            strokeWidth="2"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handlePontoClick('subescapular')}
          />
          
          {/* Supra-ilíaca - lateral do quadril */}
          <circle
            cx="135"
            cy="210"
            r="8"
            fill={dobraAtiva === 'suprailiaca' ? '#EF4444' : dobras.suprailiaca ? '#10B981' : '#6B7280'}
            stroke={dobraAtiva === 'suprailiaca' ? '#DC2626' : dobras.suprailiaca ? '#059669' : '#4B5563'}
            strokeWidth="2"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handlePontoClick('suprailiaca')}
          />
          
          {/* Abdominal - lateral do abdômen */}
          <circle
            cx="125"
            cy="180"
            r="8"
            fill={dobraAtiva === 'abdominal' ? '#EF4444' : dobras.abdominal ? '#10B981' : '#6B7280'}
            stroke={dobraAtiva === 'abdominal' ? '#DC2626' : dobras.abdominal ? '#059669' : '#4B5563'}
            strokeWidth="2"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handlePontoClick('abdominal')}
          />
          
          {/* Coxa - frente da coxa */}
          <circle
            cx="125"
            cy="310"
            r="8"
            fill={dobraAtiva === 'coxa' ? '#EF4444' : dobras.coxa ? '#10B981' : '#6B7280'}
            stroke={dobraAtiva === 'coxa' ? '#DC2626' : dobras.coxa ? '#059669' : '#4B5563'}
            strokeWidth="2"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handlePontoClick('coxa')}
          />
          
          {/* Axilar Média - lateral do tórax */}
          <circle
            cx="130"
            cy="140"
            r="8"
            fill={dobraAtiva === 'axilarMedia' ? '#EF4444' : dobras.axilarMedia ? '#10B981' : '#6B7280'}
            stroke={dobraAtiva === 'axilarMedia' ? '#DC2626' : dobras.axilarMedia ? '#059669' : '#4B5563'}
            strokeWidth="2"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handlePontoClick('axilarMedia')}
          />
          
          {/* Panturrilha Medial - parte interna da panturrilha */}
          <circle
            cx="115"
            cy="405"
            r="8"
            fill={dobraAtiva === 'panturrilhaMedial' ? '#EF4444' : dobras.panturrilhaMedial ? '#10B981' : '#6B7280'}
            stroke={dobraAtiva === 'panturrilhaMedial' ? '#DC2626' : dobras.panturrilhaMedial ? '#059669' : '#4B5563'}
            strokeWidth="2"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handlePontoClick('panturrilhaMedial')}
          />
          
          {/* Labels estáticos para os pontos ativos */}
          {dobraAtiva === 'triceps' && (
            <text x="175" y="130" fill="#DC2626" fontSize="12" fontWeight="bold">
              Tríceps
            </text>
          )}
          {dobraAtiva === 'subescapular' && (
            <text x="145" y="135" fill="#DC2626" fontSize="12" fontWeight="bold">
              Subescapular
            </text>
          )}
          {dobraAtiva === 'suprailiaca' && (
            <text x="145" y="215" fill="#DC2626" fontSize="12" fontWeight="bold">
              Supra-ilíaca
            </text>
          )}
          {dobraAtiva === 'abdominal' && (
            <text x="135" y="185" fill="#DC2626" fontSize="12" fontWeight="bold">
              Abdominal
            </text>
          )}
          {dobraAtiva === 'coxa' && (
            <text x="135" y="315" fill="#DC2626" fontSize="12" fontWeight="bold">
              Coxa
            </text>
          )}
          {dobraAtiva === 'axilarMedia' && (
            <text x="140" y="145" fill="#DC2626" fontSize="12" fontWeight="bold">
              Axilar Média
            </text>
          )}
          {dobraAtiva === 'panturrilhaMedial' && (
            <text x="125" y="410" fill="#DC2626" fontSize="12" fontWeight="bold">
              Panturrilha
            </text>
          )}
        </svg>
        
        {/* Legenda interativa */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
          <div className="text-xs text-center space-y-2">
            <div className="font-semibold text-gray-700">Pontos de Medição</div>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-gray-600">Não medido</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Medido</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">Selecionado</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Clique nos pontos ou nos campos para navegar
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Seção de entrada das dobras com silhueta */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Dobras Cutâneas (7 pontos)</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {Object.keys(dobras).filter(key => dobras[key as keyof DobrasCutaneas]).length}/7
              </span>
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(Object.keys(dobras).filter(key => dobras[key as keyof DobrasCutaneas]).length / 7) * 100}%` 
                  }}
                />
              </div>
            </div>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Insira as medidas das 7 dobras cutâneas em milímetros (mm). 
            Use um plicômetro calibrado e siga as técnicas padronizadas.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Silhueta humana */}
            <div className="flex justify-center">
              <SilhuetaHumana />
            </div>
            
            {/* Formulário das dobras */}
            <div className="space-y-4">
              {dobrasList.map((dobra) => (
                <div key={dobra.id} className="space-y-2">
                  <LabelWithTooltip
                    htmlFor={dobra.id}
                    label={dobra.label}
                    tooltip={dobra.tooltip}
                  />
                  <Input
                    id={dobra.id}
                    type="number"
                    step="0.1"
                    min="1"
                    max="50"
                    placeholder="mm"
                    value={dobras[dobra.id as keyof DobrasCutaneas] || ''}
                    onChange={handleChange}
                    onFocus={() => setDobraAtiva(dobra.id)}
                    onBlur={() => setDobraAtiva('')}
                    className={`w-full transition-all duration-200 ${
                      dobraAtiva === dobra.id ? 'ring-2 ring-red-500 border-red-500' : ''
                    } ${
                      dobras[dobra.id as keyof DobrasCutaneas] ? 'border-green-500' : ''
                    }`}
                  />
                </div>
              ))}
              
              <div className="flex justify-center mt-6">
                <Button 
                  data-calculate-button
                  onClick={calcularProtocolos}
                  disabled={loading || !validarDobras()}
                  className={`w-full transition-all duration-300 ${
                    validarDobras() ? 'bg-green-600 hover:bg-green-700 animate-pulse' : ''
                  }`}
                >
                  {loading ? "Calculando..." : validarDobras() ? "✓ Calcular Protocolos" : "Calcular Protocolos"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção de resultados */}
      {calculado && Object.keys(resultados).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resultados dos Protocolos</CardTitle>
            <p className="text-sm text-muted-foreground">
              Percentual de gordura corporal calculado pelos diferentes protocolos científicos.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Protocolo Faulkner */}
              {resultados.faulkner && (
                <div className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-semibold text-center">Protocolo Faulkner</h4>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {resultados.faulkner.percentualGordura.toFixed(1)}%
                    </div>
                    <Badge className={getClassificacaoCor(resultados.faulkner.classificacao)}>
                      {resultados.faulkner.classificacao}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Massa Gorda:</span>
                      <span className="font-medium">{resultados.faulkner.massaGorda.toFixed(1)} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Massa Magra:</span>
                      <span className="font-medium">{resultados.faulkner.massaMagra.toFixed(1)} kg</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Protocolo Pollock */}
              {resultados.pollock && (
                <div className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-semibold text-center">Protocolo Pollock</h4>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {resultados.pollock.percentualGordura.toFixed(1)}%
                    </div>
                    <Badge className={getClassificacaoCor(resultados.pollock.classificacao)}>
                      {resultados.pollock.classificacao}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Massa Gorda:</span>
                      <span className="font-medium">{resultados.pollock.massaGorda.toFixed(1)} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Massa Magra:</span>
                      <span className="font-medium">{resultados.pollock.massaMagra.toFixed(1)} kg</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Protocolo Guedes */}
              {resultados.guedes && (
                <div className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-semibold text-center">Protocolo Guedes</h4>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {resultados.guedes.percentualGordura.toFixed(1)}%
                    </div>
                    <Badge className={getClassificacaoCor(resultados.guedes.classificacao)}>
                      {resultados.guedes.classificacao}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Massa Gorda:</span>
                      <span className="font-medium">{resultados.guedes.massaGorda.toFixed(1)} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Massa Magra:</span>
                      <span className="font-medium">{resultados.guedes.massaMagra.toFixed(1)} kg</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Informação adicional */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Informação:</strong> Os diferentes protocolos utilizam equações específicas 
                baseadas em população e objetivos distintos. A comparação entre os valores pode 
                fornecer uma visão mais abrangente da composição corporal.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default DobrasCutaneas;
