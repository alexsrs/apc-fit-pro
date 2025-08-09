// Componente modernizado de avaliação de dobras cutâneas (versão reconstruída após corrupção)
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { PieChartAvaliacao } from './PieChartAvaliacao';
import { calcularIdade, formatarDataValidade } from '@/utils/idade';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Calculator, Users, Target, Clock } from 'lucide-react';
import { AvaliacaoCompleta, Medidas, ProtocoloInfo } from '@/types/dobras-cutaneas';
import { useUserProfile } from '@/contexts/UserProfileContext';
import apiClient from '@/lib/api-client';

interface Props {
  resultado: any; // Dados pré-carregados de aluno / avaliação
  onResultado?: (resultado: AvaliacaoCompleta) => void;
  modoCalculoApenas?: boolean;
  className?: string;
}

// Mapa de descrição das dobras (chaves normalizadas).
// Inclui sinônimos normalizados para garantir exibição mesmo se o backend mudar levemente o nome.
// Ex: "tricipital" vs "triceps"; "axilarMedia" -> normaliza para "axilarmedia".
const DOBRAS_INFO: Record<string, { nome: string; descricao: string; sinonimos?: string[] }> = {
  triceps: { nome: 'Tríceps', descricao: 'Face posterior do braço, ponto médio acrômio-olécrano (vertical)', sinonimos: ['tricipital'] },
  tricipital: { nome: 'Tricipital (Tríceps)', descricao: 'Face posterior do braço, ponto médio acrômio-olécrano (vertical)' },
  subescapular: { nome: 'Subescapular', descricao: 'Abaixo da escápula, ~2 cm da borda inferior (diagonal)' },
  suprailiaca: { nome: 'Supra-ilíaca', descricao: 'Logo acima da crista ilíaca, linha axilar média (diagonal)', sinonimos: ['suprailiaca'] },
  abdominal: { nome: 'Abdominal', descricao: 'Ao lado direito do umbigo (vertical)' },
  peitoral: { nome: 'Peitoral', descricao: 'Entre axila e mamilo (diagonal, ângulo depende do sexo)' },
  torax: { nome: 'Tórax', descricao: 'Entre linha axilar anterior e mamilo (oblíqua) - sinônimo de peitoral', sinonimos: ['peitoral'] },
  axilarmedia: { nome: 'Axilar Média', descricao: 'Linha axilar média ao nível do apêndice xifoide (horizontal)', sinonimos: ['axilarmed', 'axilar', 'axilarmedia'] },
  coxa: { nome: 'Coxa', descricao: 'Face anterior, ponto médio entre prega inguinal e patela (vertical)' },
  bicipital: { nome: 'Bicipital', descricao: 'Face anterior do braço sobre o ventre do bíceps (vertical)', sinonimos: ['biceps'] },
  biceps: { nome: 'Bíceps', descricao: 'Face anterior do braço sobre o ventre do bíceps (vertical)' },
  panturrilha: { nome: 'Panturrilha', descricao: 'Face medial na maior circunferência (vertical)' }
};

function obterInfoDobra(normalizada: string) {
  // Primeiro, busca direta
  if (DOBRAS_INFO[normalizada]) return DOBRAS_INFO[normalizada];
  
  // Procura em sinônimos
  for (const key of Object.keys(DOBRAS_INFO)) {
    const item = DOBRAS_INFO[key];
    if (item.sinonimos && item.sinonimos.includes(normalizada)) return item;
  }
  
  // Tentativas de mapeamento manual para casos específicos
  const mapeamentos: Record<string, string> = {
    'axilarmedia': 'axilarmedia',
    'axilarmédia': 'axilarmedia', 
    'axilarmédio': 'axilarmedia',
    'torax': 'torax',
    'tórax': 'torax',
    'biceps': 'biceps',
    'bíceps': 'biceps',
    'triceps': 'triceps',
    'tríceps': 'triceps',
    'suprailíaca': 'suprailiaca',
    'suprailiaca': 'suprailiaca'
  };
  
  if (mapeamentos[normalizada]) {
    return DOBRAS_INFO[mapeamentos[normalizada]];
  }
  
  return undefined;
}

function normalizarDobra(nome: string) {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

export function DobrasCutaneasModernas({ resultado, onResultado, modoCalculoApenas = false, className }: Props) {
  const { profile } = useUserProfile();
  const isAluno = profile?.role === 'aluno';

  // Dados base do aluno
  const peso = resultado?.aluno?.peso;
  const altura = resultado?.aluno?.altura;
  const dataNascimento = resultado?.aluno?.dataNascimento;
  const idadeCalculada = dataNascimento ? calcularIdade(dataNascimento) : undefined;
  const genero = resultado?.aluno?.genero; // já vem normalizado backend? manter

  const [protocolos, setProtocolos] = useState<ProtocoloInfo[]>([]);
  const [protocoloSelecionado, setProtocoloSelecionado] = useState<string>('');
  const [medidas, setMedidas] = useState<Medidas>({});
  const [resultadoState, setResultadoState] = useState<AvaliacaoCompleta | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProtocolos, setLoadingProtocolos] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [debugPayload, setDebugPayload] = useState<any>(null);

  // Carregar protocolos
  useEffect(() => { (async () => {
    try {
      const resp = await apiClient.get('/api/dobras-cutaneas/protocolos');
      let data: ProtocoloInfo[] = resp.data?.data || [];
      if (!data.find(p => p.id === 'pollock9')) {
        data.push({
          id: 'pollock9',
          nome: 'Pollock 9 dobras (atletas)',
            descricao: 'Usa 9 dobras, % gordura pelas 7 tradicionais, mostra soma das 9.',
          numDobras: 9,
          dobrasNecessarias: ['triceps','subescapular','suprailiaca','abdominal','torax','axilarmedia','coxa','biceps','panturrilha'],
          requerIdade: true,
          generoEspecifico: false,
          tempoMedio: '7-10 min',
          recomendado: 'Atletas'
        });
      }
      setProtocolos(data);
    } catch {
      setErrors(['Erro ao carregar protocolos']);
    } finally { setLoadingProtocolos(false); }
  })(); }, []);

  const protocoloInfo = protocolos.find(p => p.id === protocoloSelecionado);

  const medidasFaltando = useMemo(() => {
    if (!protocoloInfo) return [] as string[];
    return protocoloInfo.dobrasNecessarias.filter(d => {
      const chave = normalizarDobra(d);
      const valor = medidas[chave as keyof Medidas];
      return !valor || valor <= 0;
    });
  }, [protocoloInfo, medidas]);

  const dadosPessoaisValidos = !!(resultado?.aluno?.genero && peso && altura && dataNascimento && idadeCalculada);

  function atualizarMedida(dobraOriginal: string, valor: string) {
    const chave = normalizarDobra(dobraOriginal);
    setMedidas(prev => ({ ...prev, [chave]: valor ? parseFloat(valor) : undefined }));
  }

  async function calcular() {
    if (!protocoloSelecionado || !protocoloInfo) { setErrors(['Selecione um protocolo']); return; }
    if (!dadosPessoaisValidos) { setErrors(['Dados pessoais incompletos']); return; }
    if (medidasFaltando.length > 0) { setErrors([`Preencha todas as dobras: faltando ${medidasFaltando.join(', ')}`]); return; }

    setLoading(true); setErrors([]);
    try {
      // Normalizar o protocolo para remover hífens (API espera sem hífen)
      const protocoloNormalizado = protocoloSelecionado.replace(/-/g, '');
      
      const payload = {
        protocolo: protocoloNormalizado,
        dadosPessoais: {
          genero: genero,
          idade: idadeCalculada,
          peso,
          altura
        },
        medidas,
        aluno: resultado?.aluno
      };
      setDebugPayload(payload);
      const endpoint = modoCalculoApenas ? '/api/dobras-cutaneas/calcular' : '/api/dobras-cutaneas';
      const resp = await apiClient.post(endpoint, payload);
      const data: AvaliacaoCompleta = resp.data.data.resultado ?? resp.data.data;
      setResultadoState(data);
      onResultado?.(data);
      setDebugPayload(null);
    } catch (e: any) {
      setErrors([e?.response?.data?.message || 'Falha ao calcular']);
    } finally { setLoading(false); }
  }

  function limpar() {
    setMedidas({}); setResultadoState(null); setErrors([]);
  }

  // Normalização de resultado para exibição (seguro para null)
  const resultados = resultadoState?.resultados;
  const pesoCorporalReferencia = (peso && peso > 0) ? peso : undefined;
  const pesoSomado = resultados ? (resultados.massaGorda + resultados.massaMagra) : undefined;
  const massaMuscular = resultados?.massaMuscular;
  const musculoEsqueletico = resultados?.musculoEsqueletico;

  if (loadingProtocolos) {
    return <Card className={className}><CardContent className="p-6">Carregando protocolos...</CardContent></Card>;
  }

  if (isAluno) {
    return <Alert variant="destructive" className="mb-4"><AlertCircle className="h-4 w-4" /><AlertDescription>Alunos não podem registrar avaliações.</AlertDescription></Alert>;
  }

  if (!dadosPessoaisValidos) {
    return <Alert variant="destructive" className="mb-4"><AlertCircle className="h-4 w-4" /><AlertDescription>Aluno sem dados completos (gênero, peso, altura, data nasc.).</AlertDescription></Alert>;
  }

  return (
    <div className={`space-y-6 ${className ?? ''}`}>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" />Protocolo</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Protocolo</Label>
              <Select value={protocoloSelecionado} onValueChange={setProtocoloSelecionado}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {protocolos.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      <div className="flex flex-col text-left">
                        <span className="font-medium">{p.nome}</span>
                        <span className="text-xs text-muted-foreground">{p.numDobras} dobras • {p.tempoMedio}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {protocoloInfo && (
              <div className="space-y-2">
                <Label>Info</Label>
                <div className="p-3 bg-blue-50 rounded-lg text-xs">
                  <p className="font-medium text-sm mb-1">{protocoloInfo.nome}</p>
                  <p className="text-blue-700 mb-2">{protocoloInfo.descricao}</p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />{protocoloInfo.tempoMedio}</Badge>
                    <Badge variant="outline"><Users className="h-3 w-3 mr-1" />{protocoloInfo.recomendado}</Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {protocoloInfo && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" />Dobras ({protocoloInfo.numDobras})</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {protocoloInfo.dobrasNecessarias.map(dobra => {
                const chave = normalizarDobra(dobra);
                const info = obterInfoDobra(chave) || obterInfoDobra(normalizarDobra(dobra.replace(/media/i,'média')));
                
                // DEBUG: Log para entender o problema
                console.log(`[DEBUG] Dobra original: "${dobra}", normalizada: "${chave}", info encontrada:`, !!info);
                
                return (
                  <div key={dobra} className="space-y-1">
                    <Label htmlFor={dobra}>{info?.nome || dobra}</Label>
                    <div className="text-[11px] text-muted-foreground min-h-[28px]">{info?.descricao || '— Descrição indisponível —'}</div>
                    <Input id={dobra} type="number" min={0} step={0.5} value={medidas[chave as keyof Medidas] ?? ''} onChange={e => atualizarMedida(dobra, e.target.value)} placeholder="mm" />
                  </div>
                );
              })}
            </div>
            {medidasFaltando.length > 0 && <p className="text-xs text-red-600 mt-3">Faltando: {medidasFaltando.join(', ')}</p>}
          </CardContent>
        </Card>
      )}

      {resultadoState && resultados && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" />Resultado</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Metric bloco="bg-blue-50" titulo="% Gordura" valor={`${resultados.percentualGordura.toFixed(1)}%`} destaque="text-blue-600" />
              <Metric bloco="bg-green-50" titulo="Massa Magra" valor={`${resultados.massaMagra.toFixed(1)}kg`} destaque="text-green-600" />
              <Metric bloco="bg-orange-50" titulo="Massa Gorda" valor={`${resultados.massaGorda.toFixed(1)}kg`} destaque="text-orange-600" />
              {massaMuscular !== undefined && <Metric bloco="bg-yellow-50" titulo="Massa Muscular" valor={`${massaMuscular.toFixed(1)}kg`} destaque="text-yellow-600" />}
              {musculoEsqueletico !== undefined && <Metric bloco="bg-pink-50" titulo="Músculo Esquelético" valor={`${musculoEsqueletico.toFixed(1)}kg`} destaque="text-pink-600" />}
              <Metric bloco="bg-purple-50" titulo="Classificação" valor={resultados.classificacao} destaque="text-purple-600 text-lg" />
            </div>
            <PieChartAvaliacao
              percentualGordura={resultados.percentualGordura}
              massaMagra={resultados.massaMagra}
              massaGorda={resultados.massaGorda}
              massaMuscular={massaMuscular}
              musculoEsqueletico={musculoEsqueletico}
            />
            <div className="p-4 bg-gray-50 rounded-md text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong>Protocolo:</strong> {resultadoState.metadata?.validadeFormula || protocoloInfo?.nome || '-'}</div>
              <div><strong>Data:</strong> {resultadoState.metadata?.dataAvaliacao ? formatarDataValidade(resultadoState.metadata.dataAvaliacao) : '-'}</div>
              <div>
                <strong>Soma total:</strong> {resultados.somaTotal?.toFixed(1)} mm
                {protocoloInfo?.id === 'pollock9' && resultados.somaEquacao !== undefined && (
                  <><br /><span className="text-xs text-muted-foreground">Soma 7 equação: {resultados.somaEquacao.toFixed(1)} mm</span></>
                )}
              </div>
              {resultados.densidadeCorporal && <div><strong>Densidade:</strong> {resultados.densidadeCorporal.toFixed(4)}</div>}
              {pesoCorporalReferencia && (
                <div className="col-span-1 md:col-span-2 text-xs text-muted-foreground">
                  Referência de peso usada para estimativas: {pesoCorporalReferencia} kg
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {errors.length > 0 && (
        <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{errors.join(' | ')}</AlertDescription></Alert>
      )}
      {debugPayload && (
        <div className="p-3 bg-gray-100 rounded text-[11px] font-mono overflow-x-auto">
          <strong>Payload:</strong> {JSON.stringify(debugPayload, null, 2)}
        </div>
      )}

      <div className="flex justify-between">
        <Button onClick={calcular} disabled={loading || !protocoloSelecionado} variant="outline">
          <Calculator className="h-4 w-4 mr-2" />{loading ? 'Calculando...' : 'Calcular'}
        </Button>
        <Button onClick={limpar} disabled={loading} variant="ghost">Limpar</Button>
      </div>
    </div>
  );
}

interface MetricProps { bloco: string; titulo: string; valor: string; destaque: string; }
function Metric({ bloco, titulo, valor, destaque }: MetricProps) {
  return (
    <div className={`text-center p-4 rounded-lg ${bloco}`}>
      <div className={`font-bold ${destaque}`}>{valor}</div>
      <div className="text-xs mt-1 text-gray-700 font-medium">{titulo}</div>
    </div>
  );
}

