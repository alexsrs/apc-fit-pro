/**
 * Exemplo de página de dashboard usando os novos componentes de loading
 * Este arquivo demonstra as melhores práticas para aplicar loading states
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Loading, { LoadingInline, LoadingButton, LoadingSkeleton } from '@/components/ui/Loading';
import { Users, TrendingUp, Calendar, Search, Plus, RefreshCw } from 'lucide-react';

// Tipos de exemplo
interface Usuario {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
  status: 'ativo' | 'inativo';
  ultimoAcesso: string;
}

interface Metrica {
  titulo: string;
  valor: string;
  variacao: string;
  tipo: 'positiva' | 'negativa' | 'neutra';
}

export function ExemploDashboardLoading() {
  // Estados de loading
  const [loadingPagina, setLoadingPagina] = useState(true);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [loadingMetricas, setLoadingMetricas] = useState(false);
  const [salvandoConfig, setSalvandoConfig] = useState(false);
  const [atualizandoDados, setAtualizandoDados] = useState(false);

  // Estados de dados
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [metricas, setMetricas] = useState<Metrica[]>([]);
  const [busca, setBusca] = useState('');

  // Simular carregamento inicial da página
  useEffect(() => {
    const carregarDados = async () => {
      setLoadingPagina(true);
      
      // Simular delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Carregar dados mock
      setMetricas([
        { titulo: 'Usuários Ativos', valor: '1,234', variacao: '+12%', tipo: 'positiva' },
        { titulo: 'Avaliações', valor: '567', variacao: '+8%', tipo: 'positiva' },
        { titulo: 'Taxa de Conclusão', valor: '89%', variacao: '-2%', tipo: 'negativa' },
        { titulo: 'Satisfação', valor: '4.8', variacao: '+0.3', tipo: 'positiva' },
      ]);

      setUsuarios([
        { id: '1', nome: 'João Silva', email: 'joao@email.com', status: 'ativo', ultimoAcesso: '2 min' },
        { id: '2', nome: 'Maria Santos', email: 'maria@email.com', status: 'ativo', ultimoAcesso: '1 hora' },
        { id: '3', nome: 'Pedro Oliveira', email: 'pedro@email.com', status: 'inativo', ultimoAcesso: '2 dias' },
      ]);

      setLoadingPagina(false);
    };

    carregarDados();
  }, []);

  // Função para simular refresh de dados
  const atualizarDados = async () => {
    setAtualizandoDados(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAtualizandoDados(false);
  };

  // Função para simular busca de usuários
  const buscarUsuarios = async () => {
    setLoadingUsuarios(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoadingUsuarios(false);
  };

  // Função para simular atualização de métricas
  const atualizarMetricas = async () => {
    setLoadingMetricas(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoadingMetricas(false);
  };

  // Função para simular salvamento
  const salvarConfiguracoes = async () => {
    setSalvandoConfig(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setSalvandoConfig(false);
  };

  // Loading da página inteira
  if (loadingPagina) {
    return <Loading mode="fullscreen" text="Carregando dashboard..." />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header com ações */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={atualizarDados}
            disabled={atualizandoDados}
          >
            {atualizandoDados ? (
              <LoadingInline size="sm" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Atualizar</span>
          </Button>
          <Button onClick={salvarConfiguracoes} disabled={salvandoConfig}>
            {salvandoConfig ? (
              <LoadingButton text="Salvando..." size="sm" />
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Novo Item
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loadingMetricas ? (
          // Skeleton para métricas
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <LoadingSkeleton variant="card" lines={2} />
            </Card>
          ))
        ) : (
          metricas.map((metrica, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metrica.titulo}
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrica.valor}</div>
                <p className={`text-xs ${
                  metrica.tipo === 'positiva' ? 'text-green-600' : 
                  metrica.tipo === 'negativa' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {metrica.variacao} desde último mês
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Seção de Usuários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Usuários */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usuários Recentes
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={atualizarMetricas}
                disabled={loadingMetricas}
              >
                {loadingMetricas ? (
                  <LoadingInline size="sm" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Buscar usuários..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="flex-1"
              />
              <Button onClick={buscarUsuarios} disabled={loadingUsuarios}>
                {loadingUsuarios ? (
                  <LoadingInline size="sm" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingUsuarios ? (
              <LoadingSkeleton variant="list" lines={5} showAvatar />
            ) : (
              <div className="space-y-4">
                {usuarios
                  .filter(usuario => 
                    usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
                    usuario.email.toLowerCase().includes(busca.toLowerCase())
                  )
                  .map((usuario) => (
                    <div key={usuario.id} className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={usuario.avatar} />
                        <AvatarFallback>
                          {usuario.nome.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{usuario.nome}</p>
                        <p className="text-sm text-muted-foreground">{usuario.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={usuario.status === 'ativo' ? 'default' : 'secondary'}>
                          {usuario.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {usuario.ultimoAcesso}
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </CardContent>
        </Card>

        {/* Atividades Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {atualizandoDados ? (
              <LoadingSkeleton variant="list" lines={4} />
            ) : (
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium">Nova avaliação criada</p>
                    <p className="text-sm text-muted-foreground">João Silva - há 5 min</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium">Treino concluído</p>
                    <p className="text-sm text-muted-foreground">Maria Santos - há 1 hora</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium">Avaliação pendente</p>
                    <p className="text-sm text-muted-foreground">Pedro Oliveira - há 2 horas</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Demonstração de Loading States */}
      <Card>
        <CardHeader>
          <CardTitle>Demonstração de Loading States</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button onClick={() => setLoadingUsuarios(!loadingUsuarios)}>
              Toggle Lista Loading
            </Button>
            <Button onClick={() => setLoadingMetricas(!loadingMetricas)}>
              Toggle Métricas Loading
            </Button>
            <Button onClick={() => setAtualizandoDados(!atualizandoDados)}>
              Toggle Atividades Loading
            </Button>
            <Button onClick={() => setSalvandoConfig(!salvandoConfig)}>
              Toggle Salvamento
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
