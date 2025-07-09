/**
 * Componente de exemplo para demonstrar os novos componentes de Loading
 * Este arquivo serve como referência para implementação
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Loading, { LoadingInline, LoadingButton, LoadingSkeleton } from '@/components/ui/Loading';
import Image from "next/image";

export function ExemplosLoading() {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const simularCarregamento = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(true);
    setTimeout(() => setter(false), 3000);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Exemplos de Componentes Loading</h1>
      
      {/* Card com Loading Básico */}
      <Card>
        <CardHeader>
          <CardTitle>Loading Básico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={() => simularCarregamento(setLoading1)}>
              Simular Carregamento
            </Button>
            
            {loading1 ? (
              <Loading text="Carregando dados..." />
            ) : (
              <p>Dados carregados com sucesso!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card com Diferentes Tamanhos */}
      <Card>
        <CardHeader>
          <CardTitle>Diferentes Tamanhos e Cores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="mb-2 text-sm">Small</p>
              <Loading size="sm" />
            </div>
            <div className="text-center">
              <p className="mb-2 text-sm">Medium</p>
              <Loading size="md" color="green" />
            </div>
            <div className="text-center">
              <p className="mb-2 text-sm">Large</p>
              <Loading size="lg" color="purple" />
            </div>
            <div className="text-center">
              <p className="mb-2 text-sm">XL</p>
              <Loading size="xl" color="red" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card com Loading Inline */}
      <Card>
        <CardHeader>
          <CardTitle>Loading Inline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="flex items-center gap-2">
              Sincronizando dados <LoadingInline color="green" />
            </p>
            <p className="flex items-center gap-2">
              Processando <LoadingInline color="blue" size="sm" />
            </p>
            <p className="flex items-center gap-2">
              Enviando email <LoadingInline color="purple" />
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Card com Loading Button */}
      <Card>
        <CardHeader>
          <CardTitle>Loading em Botões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button 
              onClick={() => simularCarregamento(setLoading2)}
              disabled={loading2}
              className="w-full"
            >
              {loading2 ? (
                <LoadingButton text="Salvando dados..." />
              ) : (
                "Salvar"
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => simularCarregamento(setLoading3)}
              disabled={loading3}
              className="w-full"
            >
              {loading3 ? (
                <LoadingButton text="Enviando..." size="sm" />
              ) : (
                "Enviar"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Card com Loading Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>Loading Skeleton - Variações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Button onClick={() => simularCarregamento(setLoading1)}>
              Mostrar Skeletons
            </Button>
            
            {loading1 ? (
              <div className="space-y-6">
                {/* Skeleton Default */}
                <div>
                  <h4 className="font-semibold mb-2">Default (Texto)</h4>
                  <LoadingSkeleton lines={3} />
                </div>

                {/* Skeleton Card */}
                <div>
                  <h4 className="font-semibold mb-2">Card com Imagem</h4>
                  <Card>
                    <LoadingSkeleton variant="card" lines={3} showImage />
                  </Card>
                </div>

                {/* Skeleton List */}
                <div>
                  <h4 className="font-semibold mb-2">Lista com Avatares</h4>
                  <Card>
                    <CardContent className="p-4">
                      <LoadingSkeleton variant="list" lines={4} showAvatar />
                    </CardContent>
                  </Card>
                </div>

                {/* Skeleton Table */}
                <div>
                  <h4 className="font-semibold mb-2">Tabela</h4>
                  <Card>
                    <CardContent className="p-4">
                      <LoadingSkeleton variant="table" lines={5} />
                    </CardContent>
                  </Card>
                </div>

                {/* Skeleton Profile */}
                <div>
                  <h4 className="font-semibold mb-2">Perfil</h4>
                  <Card>
                    <CardContent className="p-4">
                      <LoadingSkeleton variant="profile" lines={4} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Conteúdo Real */}
                <div>
                  <h4 className="font-semibold mb-2">Conteúdo Carregado</h4>
                  <p>Este é um parágrafo de exemplo que seria exibido após o carregamento.</p>
                  <p>Aqui temos mais uma linha de conteúdo para demonstrar o skeleton loading.</p>
                  <p>E uma terceira linha para completar o exemplo.</p>
                </div>

                {/* Card Real */}
                <Card>
                  <CardContent className="p-4">
                    <Image 
                      src="/api/placeholder/400/200" 
                      alt="Exemplo"
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      priority
                    />
                    <h3 className="font-semibold text-lg mb-2">Título do Card</h3>
                    <p>Descrição do conteúdo do card após carregamento.</p>
                    <p>Mais informações sobre este item específico.</p>
                  </CardContent>
                </Card>

                {/* Lista Real */}
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          JS
                        </div>
                        <div>
                          <p className="font-semibold">João Silva</p>
                          <p className="text-sm text-muted-foreground">Aluno ativo</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                          MS
                        </div>
                        <div>
                          <p className="font-semibold">Maria Santos</p>
                          <p className="text-sm text-muted-foreground">Professora</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Exemplos de Cards com Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            {loading1 ? (
              <Loading text="Carregando usuários..." size="md" />
            ) : (
              <div className="space-y-2">
                <div className="p-2 border rounded">João Silva</div>
                <div className="p-2 border rounded">Maria Santos</div>
                <div className="p-2 border rounded">Pedro Oliveira</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatórios</CardTitle>
          </CardHeader>
          <CardContent>
            {loading2 ? (
              <LoadingSkeleton lines={4} />
            ) : (
              <div className="space-y-2">
                <div className="p-2 bg-green-50 rounded">Relatório 1 - Concluído</div>
                <div className="p-2 bg-blue-50 rounded">Relatório 2 - Em andamento</div>
                <div className="p-2 bg-yellow-50 rounded">Relatório 3 - Pendente</div>
                <div className="p-2 bg-gray-50 rounded">Relatório 4 - Aguardando</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
