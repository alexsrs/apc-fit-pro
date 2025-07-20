/**
 * Página de demonstração do novo sistema de Dobras Cutâneas
 */

'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { DobrasCutaneasModernas } from '@/components/DobrasCutaneasModernas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator, 
  History, 
  BookOpen, 
  Users,
  Target,
  TrendingUp 
} from 'lucide-react';
import type { AvaliacaoCompleta } from '@/types/dobras-cutaneas';

export default function DobrasCutaneasPage() {
  const [resultadoAtual, setResultadoAtual] = useState<AvaliacaoCompleta | null>(null);
  const [historico, setHistorico] = useState<AvaliacaoCompleta[]>([]);

  const handleNovoResultado = (resultado: AvaliacaoCompleta) => {
    setResultadoAtual(resultado);
    
    // Simular adição ao histórico
    setHistorico(prev => [resultado, ...prev]);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dobras Cutâneas</h1>
          <p className="text-muted-foreground">
            Sistema avançado de avaliação da composição corporal com múltiplos protocolos científicos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Protocolos</p>
                <p className="text-2xl font-bold">6</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Calculator className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Precisão</p>
                <p className="text-2xl font-bold">±1.5%</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Populações</p>
                <p className="text-2xl font-bold">Todas</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Tempo Médio</p>
                <p className="text-2xl font-bold">5-12min</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="avaliacao" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="avaliacao" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Nova Avaliação
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Histórico ({historico.length})
            </TabsTrigger>
            <TabsTrigger value="protocolos" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Protocolos
            </TabsTrigger>
            <TabsTrigger value="comparacao" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Comparação
            </TabsTrigger>
          </TabsList>

          {/* Nova Avaliação */}
          <TabsContent value="avaliacao" className="space-y-6">
            <DobrasCutaneasModernas
              userPerfilId="demo-user-123"
              resultado={resultadoAtual}
              onResultado={handleNovoResultado}
              modoCalculoApenas={false}
            />
          </TabsContent>

          {/* Histórico */}
          <TabsContent value="historico" className="space-y-4">
            {historico.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <History className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma avaliação realizada</h3>
                  <p className="text-muted-foreground mb-4">
                    Realize sua primeira avaliação de dobras cutâneas para ver o histórico aqui.
                  </p>
                  <Button 
                    onClick={() => {
                      const element = document.querySelector('[data-state="active"][value="avaliacao"]') as HTMLElement;
                      element?.click();
                    }}
                  >
                    Fazer Avaliação
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {historico.map((avaliacao, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{avaliacao.metadata.validadeFormula}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {new Date(avaliacao.metadata.dataAvaliacao).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {avaliacao.resultados.percentualGordura.toFixed(1)}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Massa Gorda:</span>
                          <p>{avaliacao.resultados.massaGorda.toFixed(1)}kg</p>
                        </div>
                        <div>
                          <span className="font-medium">Massa Magra:</span>
                          <p>{avaliacao.resultados.massaMagra.toFixed(1)}kg</p>
                        </div>
                        <div>
                          <span className="font-medium">Classificação:</span>
                          <p>{avaliacao.resultados.classificacao}</p>
                        </div>
                        <div>
                          <span className="font-medium">Soma Total:</span>
                          <p>{avaliacao.resultados.somaTotal.toFixed(1)}mm</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Protocolos */}
          <TabsContent value="protocolos" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Faulkner */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Faulkner</CardTitle>
                  <Badge variant="outline">4 dobras</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Protocolo clássico para população geral, simples e eficaz.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div><strong>Dobras:</strong> Tríceps, Subescapular, Supra-ilíaca, Bicipital</div>
                    <div><strong>Idade:</strong> Não obrigatória</div>
                    <div><strong>Gênero:</strong> Ambos</div>
                    <div><strong>Tempo:</strong> ~5 minutos</div>
                  </div>
                </CardContent>
              </Card>

              {/* Pollock 3 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pollock 3 dobras</CardTitle>
                  <Badge variant="outline">3 dobras</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Avaliação rápida com dobras específicas por gênero.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div><strong>Homens:</strong> Peitoral, Abdominal, Coxa</div>
                    <div><strong>Mulheres:</strong> Tríceps, Supra-ilíaca, Coxa</div>
                    <div><strong>Idade:</strong> 18-61 anos</div>
                    <div><strong>Tempo:</strong> ~3 minutos</div>
                  </div>
                </CardContent>
              </Card>

              {/* Pollock 7 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pollock 7 dobras</CardTitle>
                  <Badge variant="outline">7 dobras</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Padrão científico com alta precisão e confiabilidade.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div><strong>Dobras:</strong> 7 pontos anatômicos</div>
                    <div><strong>Idade:</strong> 18-61 anos</div>
                    <div><strong>Gênero:</strong> Ambos</div>
                    <div><strong>Tempo:</strong> ~8 minutos</div>
                  </div>
                </CardContent>
              </Card>


              {/* Guedes 3 Dobras */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Guedes 3 dobras (Mulher)</CardTitle>
                  <Badge variant="outline">3 dobras</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Protocolo validado para mulheres brasileiras.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div><strong>Dobras:</strong> Subescapular, Supra-ilíaca, Coxa</div>
                    <div><strong>Idade:</strong> Obrigatória</div>
                    <div><strong>Gênero:</strong> Feminino</div>
                    <div><strong>Tempo:</strong> ~4 minutos</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Guedes 3 dobras (Homem)</CardTitle>
                  <Badge variant="outline">3 dobras</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Protocolo validado para homens brasileiros.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div><strong>Dobras:</strong> Tríceps, Abdominal, Supra-ilíaca</div>
                    <div><strong>Idade:</strong> Obrigatória</div>
                    <div><strong>Gênero:</strong> Masculino</div>
                    <div><strong>Tempo:</strong> ~4 minutos</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Comparação */}
          <TabsContent value="comparacao" className="space-y-4">
            {resultadoAtual ? (
              <Card>
                <CardHeader>
                  <CardTitle>Análise do Resultado Atual</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Dados da Avaliação</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Protocolo:</span>
                          <span className="font-medium">{resultadoAtual.metadata.validadeFormula}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gênero:</span>
                          <span className="font-medium">{resultadoAtual.dadosPessoais.genero === 'M' ? 'Masculino' : 'Feminino'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Peso:</span>
                          <span className="font-medium">{resultadoAtual.dadosPessoais.peso}kg</span>
                        </div>
                        {resultadoAtual.dadosPessoais.idade && (
                          <div className="flex justify-between">
                            <span>Idade:</span>
                            <span className="font-medium">{resultadoAtual.dadosPessoais.idade} anos</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Classificação</h4>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600">
                          {resultadoAtual.resultados.percentualGordura.toFixed(1)}%
                        </div>
                        <div className="text-lg font-medium text-blue-800">
                          {resultadoAtual.resultados.classificacao}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Recomendações</h4>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Importante:</strong> Os resultados devem ser interpretados por um profissional 
                        qualificado considerando o contexto individual, objetivos e histórico de saúde do avaliado.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum resultado para comparar</h3>
                  <p className="text-muted-foreground mb-4">
                    Realize uma avaliação para ver a análise comparativa aqui.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
