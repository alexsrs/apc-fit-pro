"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSkeleton } from "@/components/ui/Loading";
import {
  AlertCircle,
  Users,
  UserRoundPlus,
  CalendarSync,
  CalendarCheck,
} from "lucide-react";

/**
 * Exemplo completo do Dashboard com todos os skeletons aplicados
 * Demonstra o estado de loading de todas as seções do dashboard
 */
export function ExemploDashboardCompleto() {
  const [loadingMetricas, setLoadingMetricas] = useState(true);
  const [loadingAlertas, setLoadingAlertas] = useState(true);
  const [loadingAlunos, setLoadingAlunos] = useState(true);

  const toggleLoading = () => {
    setLoadingMetricas(!loadingMetricas);
    setLoadingAlertas(!loadingAlertas);
    setLoadingAlunos(!loadingAlunos);
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard - Exemplo Completo</h1>
        <Button onClick={toggleLoading} variant="outline">
          {loadingMetricas ? "Exibir Dados" : "Exibir Loading"}
        </Button>
      </div>

      {/* Cards de métricas com skeleton loading */}
      <div className="grid gap-4 md:grid-cols-4 mt-2">
        {loadingMetricas ? (
          <>
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">+5% do mês passado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Novos Alunos</CardTitle>
                <UserRoundPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 este mês</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
                <CalendarSync className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">38</div>
                <p className="text-xs text-muted-foreground">84% de retenção</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Treinos Concluídos</CardTitle>
                <CalendarCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">139</div>
                <p className="text-xs text-muted-foreground">+4.5% do mês passado</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Seção de alertas e avaliações pendentes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
        {/* Alertas com skeleton */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" /> 
              Alertas Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAlertas ? (
              <div className="space-y-3">
                <LoadingSkeleton variant="list" />
                <LoadingSkeleton variant="list" />
                <LoadingSkeleton variant="list" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">3 alunos sem avaliação há mais de 30 dias</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">5 treinos aguardando feedback</span>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Meta mensal: 87% atingida</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Avaliações pendentes */}
        <Card>
          <CardHeader>
            <CardTitle>Avaliações Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAlertas ? (
              <div className="space-y-3">
                <LoadingSkeleton variant="list" />
                <LoadingSkeleton variant="list" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  2 avaliações aguardando análise
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Ver Todas
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs com lista de alunos */}
      <Tabs defaultValue="ativos">
        <TabsList>
          <TabsTrigger value="ativos">Alunos Ativos</TabsTrigger>
          <TabsTrigger value="inativos">Inativos</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ativos">
          {loadingAlunos ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <LoadingSkeleton variant="profile" showAvatar />
              <LoadingSkeleton variant="profile" showAvatar />
              <LoadingSkeleton variant="profile" showAvatar />
              <LoadingSkeleton variant="profile" showAvatar />
              <LoadingSkeleton variant="profile" showAvatar />
              <LoadingSkeleton variant="profile" showAvatar />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {/* Exemplos de cards de alunos */}
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full mb-2 flex items-center justify-center">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <CardTitle className="text-center text-lg font-semibold">
                        Aluno {i + 1}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm flex flex-col items-center">
                    <p className="text-center">aluno{i + 1}@email.com</p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Ver detalhes
                      </Button>
                      <Button variant="default" size="sm" className="flex-1">
                        Nova Avaliação
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="inativos">
          <p className="mt-4 text-sm text-muted-foreground">
            Nenhum aluno inativo no momento.
          </p>
        </TabsContent>
        
        <TabsContent value="pendentes">
          <p className="mt-4 text-sm text-muted-foreground">
            3 alunos aguardando avaliação inicial.
          </p>
        </TabsContent>
      </Tabs>

      {/* Seção explicativa */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>📋 Como usar os Skeletons no Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm">🔹 Cards de Métricas:</h4>
            <p className="text-sm text-muted-foreground">
              Use <code className="bg-gray-100 px-1 rounded">LoadingSkeleton variant=&quot;card&quot;</code> 
              para cada card de métrica durante o carregamento.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">🔹 Alertas e Listas:</h4>
            <p className="text-sm text-muted-foreground">
              Use <code className="bg-gray-100 px-1 rounded">LoadingSkeleton variant=&quot;list&quot;</code> 
              para itens de alertas, notificações e listas simples.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">🔹 Perfis de Alunos:</h4>
            <p className="text-sm text-muted-foreground">
              Use <code className="bg-gray-100 px-1 rounded">LoadingSkeleton variant=&quot;profile&quot; showAvatar</code> 
              para cards de alunos com avatar e informações pessoais.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">💡 Dica:</h4>
            <p className="text-sm text-muted-foreground">
              Estados de loading independentes permitem que diferentes seções carreguem 
              em velocidades diferentes, melhorando a percepção de performance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
