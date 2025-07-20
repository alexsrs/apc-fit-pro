/**
 * Componente moderno de Dobras Cutâneas
 * Integrado com a nova API de protocolos independentes
 */

import React, { useState, useEffect } from 'react';

import { calcularIdade } from '@/utils/idade';
import { formatarDataValidade } from '@/utils/idade';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Calculator, Users, Target, Clock } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { useUserProfile } from '@/contexts/UserProfileContext';
import type { 
  AvaliacaoCompleta, 
  Medidas, 
  ProtocoloInfo 
} from '@/types/dobras-cutaneas';

// Unificação: garantir que DadosPessoais tenha todos os campos necessários
// ...existing code...

// Unificação: garantir que DadosPessoais tenha todos os campos necessários
interface DadosPessoais {
  genero?: 'masculino' | 'feminino';
  peso?: string;
  idade?: string;
  altura?: string;
  dataNascimento?: string;
  nome?: string;
  image?: string;
}



export interface DobrasCutaneasModernasProps {
  userPerfilId: string;
  resultado: AvaliacaoCompleta | null;
  onResultado: (resultado: any) => void;
  modoCalculoApenas?: boolean;
  className?: string;
}

/**
 * Normaliza o nome da dobra para o formato esperado pelo backend.
 * Corrige especificamente o caso de "Axilar Média" para "axilarmedia".
 */
function normalizarDobra(nome: string): string {
  let normalizado = nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-zA-Z0-9]/g, '')    // remove espaços e caracteres especiais
    .toLowerCase();

  // Corrige especificamente o caso da axilar média
  if (normalizado === "axiliarmedia") {
    normalizado = "axilarmedia";
  }
  return normalizado;
}

const dobrasInfo = {
  triceps: {
    nome: 'Tríceps',
    descricao: 'Dobra vertical na face posterior do braço, no ponto médio entre o acrômio e o olécrano'
  },
  subescapular: {
    nome: 'Subescapular',
    descricao: 'Dobra oblíqua logo abaixo do ângulo inferior da escápula'
  },
  suprailiaca: {
    nome: 'Supra-ilíaca',
    descricao: 'Dobra oblíqua imediatamente acima da crista ilíaca anterossuperior'
  },
  bicipital: {
    nome: 'Bicipital',
    descricao: 'Dobra vertical na face anterior do braço, sobre o músculo bíceps'
  },
  peitoral: {
    nome: 'Peitoral',
    descricao: 'Dobra diagonal no peito, entre a linha axilar anterior e o mamilo'
  },
  abdominal: {
    nome: 'Abdominal',
    descricao: 'Dobra vertical ao lado do umbigo, aproximadamente 2 cm lateralmente'
  },
  axilarmedia: {
    nome: 'Axilar Média',
    descricao: 'Dobra vertical na linha axilar média, ao nível do processo xifoide'
  },
  coxa: {
    nome: 'Coxa',
    descricao: 'Dobra vertical na face anterior da coxa, no ponto médio'
  },
  biceps: {
    nome: 'Bíceps',
    descricao: 'Dobra vertical sobre o ponto de maior volume do músculo bíceps'
  },
  panturrilha: {
    nome: 'Panturrilha',
    descricao: 'Dobra vertical na face medial da panturrilha, no nível de maior circunferência'
  },
  torax: {
    nome: 'Tórax',
    descricao: 'Dobra diagonal no peito, entre a linha axilar anterior e o mamilo'
  }
};

export function DobrasCutaneasModernas({
  resultado,
  onResultado,
  modoCalculoApenas = false,
  className
}: DobrasCutaneasModernasProps) {
  const { profile } = useUserProfile();
  // Verificação de role: só permite avaliação se não for aluno
  const isAluno = profile?.role === 'aluno';
  // Debug visual removido

  // Função utilitária para garantir que o gênero seja sempre 'masculino' ou 'feminino'
  function getGeneroValido(genero?: string): 'masculino' | 'feminino' | undefined {
    if (!genero) return undefined;
    const lower = genero.trim().toLowerCase();
    if (lower === 'masculino' || lower === 'm') return 'masculino';
    if (lower === 'feminino' || lower === 'f') return 'feminino';
    return undefined;
  }

  // Estado para gênero via API removido (não utilizado)

  const peso = resultado?.aluno?.peso;
  const altura = resultado?.aluno?.altura;
  const dataNascimentoValida = resultado?.aluno?.dataNascimento;
  const idadeCalculada = dataNascimentoValida ? calcularIdade(dataNascimentoValida) : undefined;
  const idade = idadeCalculada && idadeCalculada > 0 ? idadeCalculada : undefined;

  const genero = getGeneroValido(resultado?.aluno?.genero);
  const dataNascimento = dataNascimentoValida;

  // infoAluno removido (não utilizado)

  const [protocolos, setProtocolos] = useState<ProtocoloInfo[]>([]);
  const [protocoloSelecionado, setProtocoloSelecionado] = useState<string>(resultado?.protocolo ?? '');
  const [dadosPessoais, setDadosPessoais] = useState<DadosPessoais>({
    genero,
    idade: idade ? String(idade) : undefined,
    peso: peso ? String(peso) : undefined,
    altura: altura ? String(altura) : undefined,
    dataNascimento,
    nome: resultado?.aluno?.name,
    image: resultado?.aluno?.image
  });
  const [medidas, setMedidas] = useState<Medidas>({});
  const [resultadoState, setResultadoState] = useState<AvaliacaoCompleta | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProtocolos, setLoadingProtocolos] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [debugPayload, setDebugPayload] = useState<any>(null);
  // dobraAtiva removido (não utilizado)

  useEffect(() => {
    // Se faltar qualquer dado pessoal, exibe erro e bloqueia
    if (!resultado?.aluno?.id || !resultado?.aluno?.genero || !resultado?.aluno?.peso || !resultado?.aluno?.altura || !resultado?.aluno?.dataNascimento) {
      setErrors(["Selecione um aluno válido e com todos os dados pessoais preenchidos (gênero, peso, altura, data de nascimento) para realizar a avaliação física."]);
      setDadosPessoais({});
      return;
    }
    setDadosPessoais({
      genero: getGeneroValido(resultado?.aluno?.genero),
      idade: idade ? String(idade) : undefined,
      peso: peso ? String(peso) : undefined,
      altura: altura ? String(altura) : undefined,
      dataNascimento,
      nome: resultado?.aluno?.name,
      image: resultado?.aluno?.image
    });
    setErrors([]);
  }, [resultado, idade, peso, altura, dataNascimento]);

  // Carregar protocolos disponíveis apenas uma vez ao montar o componente
  useEffect(() => {
    carregarProtocolos();
  }, []);

  const carregarProtocolos = async () => {
    try {
      const response = await apiClient.get('/api/dobras-cutaneas/protocolos');
      const data = response.data?.data || [];
      if (Array.isArray(data)) {
        setProtocolos(data);
      } else {
        console.error('Dados de protocolos inválidos:', data);
        setErrors(['Formato de dados de protocolos inválido']);
        setProtocolos([]);
      }
      setLoadingProtocolos(false);
    } catch (error) {
      console.error('Erro ao carregar protocolos:', error);
      setErrors(['Erro ao carregar protocolos disponíveis']);
      setProtocolos([]);
      setLoadingProtocolos(false);
    }
  };

  // Obter informações do protocolo selecionado
  const protocoloInfo = protocolos.find(p => p.id === protocoloSelecionado);

  // Validar se todas as medidas necessárias foram preenchidas (usando chaves normalizadas)
  const dobrasFaltando: string[] = [];
  const medidasCompletas = () => {
    if (!protocoloInfo) return false;
    let completo = true;
    dobrasFaltando.length = 0;
    protocoloInfo.dobrasNecessarias.forEach(dobra => {
      const chave = normalizarDobra(dobra);
      const valor = medidas[chave as keyof Medidas];
      if (!valor || valor <= 0) {
        completo = false;
        dobrasFaltando.push(dobra);
      }
    });
    return completo;
  } 

  // Validar dados pessoais
  const dadosValidos = () => {
    if (!dadosPessoais.genero || !dadosPessoais.peso || !dadosPessoais.altura || !dadosPessoais.idade) return false;
    if (Number(dadosPessoais.peso) <= 0) return false;
    if (Number(dadosPessoais.altura) <= 0) return false;
    if (protocoloInfo?.requerIdade && Number(dadosPessoais.idade) <= 0) return false;
    return true;
  };

  // Atualizar medida
  const atualizarMedida = (dobra: string, valor: string) => {
    const numeroValor = valor ? parseFloat(valor) : undefined;
    const chaveNormalizada = normalizarDobra(dobra);
    setMedidas(prev => ({
      ...prev,
      [chaveNormalizada]: numeroValor
    }));
    setErrors([]);
  };

  // Função para montar dados pessoais - sempre do aluno selecionado
  function montarDadosPessoais(): DadosPessoais {
    return {
      genero: getGeneroValido(resultado?.aluno?.genero),
      idade: idade ? String(idade) : undefined,
      peso: peso ? String(peso) : undefined,
      altura: altura ? String(altura) : undefined,
      dataNascimento,
      nome: resultado?.aluno?.name,
      image: resultado?.aluno?.image
    };
  }

  // Calcular protocolo com validação de compatibilidade de gênero
  const calcular = async () => {
    if (!protocoloSelecionado || !dadosValidos() || !medidasCompletas()) {
      let mensagem = 'Preencha todos os dados obrigatórios antes de calcular';
      if (!medidasCompletas() && protocoloInfo) {
        mensagem += `\nDobras faltando: ${dobrasFaltando.join(', ')}`;
      }
      setErrors([mensagem]);
      return;
    }

    // Validação de compatibilidade de gênero com o protocolo
    if (protocoloInfo) {
      // Exemplo: se o nome do protocolo contém "(homens)" ou "(mulheres)", valida o gênero
      const nomeProt = protocoloInfo.nome.toLowerCase();
      if (nomeProt.includes('homem') && dadosPessoais.genero !== 'masculino') {
        setErrors([`O protocolo selecionado é exclusivo para homens. Altere o protocolo ou o gênero do aluno.`]);
        return;
      }
      if (nomeProt.includes('mulher') && dadosPessoais.genero !== 'feminino') {
        setErrors([`O protocolo selecionado é exclusivo para mulheres. Altere o protocolo ou o gênero do aluno.`]);
        return;
      }
    }

    // LOG DETALHADO PARA DEBUG
    if (protocoloInfo) {
      const dobrasEsperadas = protocoloInfo.dobrasNecessarias;
      const dobrasPresentes = Object.keys(medidas).filter(k => medidas[k as keyof Medidas] && medidas[k as keyof Medidas]! > 0);
      const faltando = dobrasEsperadas.filter(d => !(dobrasPresentes.includes(d)));
      console.log('[DEBUG][tifurico] Protocolo selecionado:', protocoloSelecionado);
      console.log('[DEBUG][tifurico] Dobras esperadas:', dobrasEsperadas);
      console.log('[DEBUG][tifurico] Dobras presentes no payload:', dobrasPresentes);
      console.log('[DEBUG][tifurico] Dobras faltando:', faltando);
      console.log('[DEBUG][tifurico] Medidas enviadas:', medidas);
    }

    setLoading(true);
    setErrors([]);

    try {
      // Normalizar as chaves das medidas para garantir compatibilidade com o backend
      const medidasNormalizadas: Record<string, number> = {};
      Object.entries(medidas).forEach(([chave, valor]) => {
        if (valor !== undefined && valor !== null && valor > 0) {
          medidasNormalizadas[normalizarDobra(chave)] = valor;
        }
      });

      const payload = {
        ...resultado,
        protocolo: protocoloSelecionado,
        dadosPessoais: montarDadosPessoais(),
        medidas: medidasNormalizadas,
        observacoes: `Avaliação realizada em ${new Date().toLocaleDateString()}`,
        userPerfilId: resultado?.aluno?.id // Garante que o id do perfil do aluno vai para o backend
      };

      setDebugPayload(payload); // Salva para debug visual
      console.log('[DEBUG][tifurico] Payload enviado para API:', payload);

      const endpoint = modoCalculoApenas ? '/api/dobras-cutaneas/calcular' : '/api/dobras-cutaneas';
      const response = await apiClient.post(endpoint, payload);

      const avaliacaoCompleta = response.data.data;
      // Se vier um campo resultado, prioriza ele, senão usa o objeto inteiro
      setResultadoState(avaliacaoCompleta?.resultado ?? avaliacaoCompleta);

      if (onResultado) {
        onResultado(avaliacaoCompleta?.resultado ?? avaliacaoCompleta);
      }

      setDebugPayload(null); // Limpa debug se sucesso
    } catch (error: unknown) {
      console.error('Erro ao calcular:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erro ao realizar cálculo';
      setErrors([errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Limpar formulário
  const limpar = () => {
    setMedidas({});
    setResultadoState(null);
    setErrors([]);
    // setDobraAtiva removido
  };

  // Debug extra para idade
  console.log('[DEBUG] Data de nascimento recebida:', resultado?.aluno?.dataNascimento);
  const debugIdade = (
    <div className="mb-2 p-2 bg-orange-50 border border-orange-300 rounded">
      <strong>Debug Idade:</strong>
      <div>Data de nascimento: <span className="font-mono">{resultado?.aluno?.dataNascimento ?? '-'}</span></div>
      <div>Idade calculada: <span className="font-mono">{idade}</span></div>
    </div>
  );

  if (loadingProtocolos) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Carregando protocolos...</span>
        </CardContent>
      </Card>
    );
  }

  // Bloqueio para role aluno
  if (isAluno) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Alunos não podem realizar avaliações físicas. Selecione um perfil de professor ou personal trainer para acessar este formulário.
        </AlertDescription>
      </Alert>
    );
  }

  // Bloqueio se não houver dados do aluno selecionado
  if (!resultado?.aluno || !resultado?.aluno?.id || !resultado?.aluno?.genero || !resultado?.aluno?.peso || !resultado?.aluno?.altura || !resultado?.aluno?.dataNascimento) {
    // Identificar campos ausentes
    const camposFaltando: string[] = [];
    if (!resultado?.aluno) camposFaltando.push('aluno');
    if (!resultado?.aluno?.id) camposFaltando.push('id');
    if (!resultado?.aluno?.genero) camposFaltando.push('genero');
    if (!resultado?.aluno?.peso) camposFaltando.push('peso');
    if (!resultado?.aluno?.altura) camposFaltando.push('altura');
    if (!resultado?.aluno?.dataNascimento) camposFaltando.push('dataNascimento');
    if (!resultado?.aluno?.name) camposFaltando.push('name');
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Nenhum aluno selecionado ou dados incompletos.<br />
          <span className="font-semibold">Campos ausentes:</span>
          <ul className="mt-2 mb-2 ml-2 list-disc text-red-700 text-sm">
            {camposFaltando.map((campo) => (
              <li key={campo} className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-red-500" /> {campo}
              </li>
            ))}
          </ul>
          Selecione um aluno válido e com todos os dados pessoais preenchidos para realizar a avaliação física.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Debug visual de idade */}
      {debugIdade}
      {/* Alerta idade inválida */}
      {/* Seleção do Protocolo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Protocolo de Avaliação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="protocolo">Protocolo</Label>
              <Select value={protocoloSelecionado} onValueChange={setProtocoloSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um protocolo" />
                </SelectTrigger>
                <SelectContent>
                  {protocolos && protocolos.length > 0 ? protocolos.map(protocolo => (
                    <SelectItem key={protocolo.id} value={protocolo.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{protocolo.nome}</span>
                        <span className="text-xs text-muted-foreground">
                          {protocolo.numDobras} dobras • {protocolo.tempoMedio}
                        </span>
                      </div>
                    </SelectItem>
                  )) : (
                    <SelectItem value="none" disabled>
                      Nenhum protocolo disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {protocoloInfo && (
              <div className="space-y-2">
                <Label>Informações do Protocolo</Label>
                <div className="p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="font-medium">{protocoloInfo.nome}</p>
                  <p className="text-blue-700">{protocoloInfo.descricao}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {protocoloInfo.tempoMedio}
                    </Badge>
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      {protocoloInfo.recomendado}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dados Pessoais do Aluno */}
      {protocoloSelecionado && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Dados do Aluno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Gênero</Label>
                <div className="text-sm text-gray-700">{dadosPessoais.genero === 'masculino' ? 'Masculino' : dadosPessoais.genero === 'feminino' ? 'Feminino' : <span className="text-red-500">Faltando</span>}</div>
              </div>
              <div>
                <Label>Peso</Label>
                <div className="text-sm text-gray-700">{dadosPessoais.peso ? `${dadosPessoais.peso} kg` : <span className="text-red-500">Faltando</span>}</div>
              </div>
              <div>
                <Label>Idade</Label>
                <div className="text-sm text-gray-700">{dadosPessoais.idade ? dadosPessoais.idade : <span className="text-red-500">Faltando</span>}</div>
              </div>
              <div>
                <Label>Altura</Label>
                <div className="text-sm text-gray-700">{dadosPessoais.altura ? `${dadosPessoais.altura} cm` : <span className="text-red-500">Faltando</span>}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medidas das Dobras */}
      {protocoloSelecionado && protocoloInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Medidas das Dobras Cutâneas
              <span className="text-sm text-muted-foreground ml-auto">
                {Object.keys(medidas).filter(k => medidas[k as keyof Medidas]).length}/{protocoloInfo.numDobras}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {protocoloInfo && protocoloInfo.dobrasNecessarias && protocoloInfo.dobrasNecessarias.length > 0 && (
                <>
                  {protocoloInfo.dobrasNecessarias.map(dobra => {
                    const chave = normalizarDobra(dobra);
                    const info = dobrasInfo[chave as keyof typeof dobrasInfo];
                    const valor = medidas[chave as keyof Medidas];
                    if (!info) {
                      console.warn(`Informação não encontrada para dobra: ${dobra} (chave normalizada: ${chave})`);
                      return null;
                    }
                    return (
                      <div key={dobra} className="space-y-2">
                        <Label htmlFor={dobra}>{info.nome}</Label>
                        <div className="text-xs text-muted-foreground mb-1">{info.descricao}</div>
                        <Input
                          id={dobra}
                          type="number"
                          min={0}
                          step={0.1}
                          value={valor ?? ''}
                          onChange={e => atualizarMedida(dobra, e.target.value)}
                          placeholder="mm"
                          className="w-full"
                          aria-label={`Valor da dobra ${info.nome}`}
                        />
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultado */}
      {resultadoState && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Resultado da Avaliação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {resultadoState.resultados?.percentualGordura?.toFixed(1)}%
                </div>
                <div className="text-sm text-blue-700">Percentual de Gordura</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {resultadoState.resultados?.massaMagra?.toFixed(1)}kg
                </div>
                <div className="text-sm text-green-700">Massa Magra</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {resultadoState.resultados?.massaGorda?.toFixed(1)}kg
                </div>
                <div className="text-sm text-orange-700">Massa Gorda</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">
                  {resultadoState.resultados?.classificacao}
                </div>
                <div className="text-sm text-purple-700">Classificação</div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Detalhes da Avaliação</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Protocolo:</strong> {resultadoState.metadata?.validadeFormula ?? '-'}
                </div>
                <div>
                  <strong>Data:</strong> {resultadoState.metadata?.dataAvaliacao ? formatarDataValidade(resultadoState.metadata.dataAvaliacao) : '-'}
                </div>
                <div>
                  <strong>Soma das dobras:</strong> {resultadoState.resultados?.somaTotal?.toFixed(1)}mm
                </div>
                {resultadoState.resultados?.densidadeCorporal && (
                  <div>
                    <strong>Densidade corporal:</strong> {resultadoState.resultados?.densidadeCorporal?.toFixed(4)}g/cm³
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exibição de erro + debug do payload */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errors.join(' | ')}
            {debugPayload && (
              <>
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-800">
                  <strong>Payload enviado:</strong>
                  <pre className="overflow-x-auto whitespace-pre-wrap">{JSON.stringify(debugPayload, null, 2)}</pre>
                  <strong>Chaves das medidas:</strong> {Object.keys(debugPayload.medidas || {}).join(', ')}
                </div>
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Botões de ação */}
      <div className="flex justify-between">
        <Button
          onClick={calcular}
          disabled={loading || !protocoloSelecionado}
          variant="outline"
        >
          <Calculator className="h-4 w-4 mr-2" />
          {loading ? "Calculando..." : "Calcular"}
        </Button>
        <Button
          onClick={limpar}
          disabled={loading}
          variant="ghost"
        >
          Limpar
        </Button>
      </div>
    </div>
  );
}

