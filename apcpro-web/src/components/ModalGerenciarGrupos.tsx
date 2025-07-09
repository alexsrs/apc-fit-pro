"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ModalPadrao } from "@/components/ui/ModalPadrao";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Search,
  Edit,
  Trash2,
  Save,
  X
} from "lucide-react";
import apiClient from "@/lib/api-client";
import { getInitials, formatDisplayName, formatDisplayEmail } from "@/utils/name-utils";

type Aluno = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  telefone?: string;
  genero?: string;
  dataNascimento?: string | null;
  grupos?: Array<{
    id: string;
    nome: string;
  }>;
};

// Remover do tipo Grupo:
type Grupo = {
  id: string;
  nome: string;
  criadoEm: string;
  membros?: Aluno[];
};

type ModalGerenciarGruposProps = {
  open: boolean;
  onClose: () => void;
  professorId: string;
  onGrupoChange?: () => void;
};

export function ModalGerenciarGrupos({ 
  open, 
  onClose, 
  professorId,
  onGrupoChange 
}: ModalGerenciarGruposProps) {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState<string>("");
  const [alunosSelecionados, setAlunosSelecionados] = useState<string[]>([]);
  const [buscaAluno, setBuscaAluno] = useState("");
  const [loading, setLoading] = useState(false);
  const [editandoGrupo, setEditandoGrupo] = useState<string | null>(null);

  // Carregar dados iniciais
  const carregarDados = useCallback(async () => {
    setLoading(true);
    try {
      const [gruposRes, alunosRes] = await Promise.all([
        apiClient.get(`/api/users/${professorId}/grupos`),
        apiClient.get(`/api/users/${professorId}/alunos`)
      ]);
      
      setGrupos(gruposRes.data || []);
      setAlunos(alunosRes.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }, [professorId]);

  useEffect(() => {
    if (open && professorId) {
      carregarDados();
    }
  }, [open, professorId, carregarDados]);

  const carregarMembrosGrupo = async (grupoId: string) => {
    try {
      const response = await apiClient.get(`/api/users/${professorId}/grupos/${grupoId}/alunos`);
      const membros = response.data || [];
      setGrupos(prev => prev.map(grupo => 
        grupo.id === grupoId ? { ...grupo, membros } : grupo
      ));
    } catch (error) {
      console.error("Erro ao carregar membros do grupo:", error);
    }
  };

  const adicionarAlunosAoGrupo = async () => {
    if (!grupoSelecionado || alunosSelecionados.length === 0) return;
    
    console.log('[Frontend] addStudentToGroup - Parâmetros:', {
      professorId,
      grupoSelecionado,
      alunosSelecionados,
      url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/api/users/${professorId}/grupos/${grupoSelecionado}/alunos/`
    });
    
    setLoading(true);
    try {
      const promises = alunosSelecionados.map(async (alunoId) => {
        const url = `/api/users/${professorId}/grupos/${grupoSelecionado}/alunos/${alunoId}`;
        console.log('[Frontend] Fazendo POST para:', url);
        
        const response = await apiClient.post(url);
        console.log('[Frontend] Resposta recebida para aluno', alunoId, ':', response.data);
        return response;
      });
      
      const results = await Promise.all(promises);
      console.log('[Frontend] ✅ Todos os alunos adicionados com sucesso:', results.map(r => r.data));
      
      await carregarMembrosGrupo(grupoSelecionado);
      setAlunosSelecionados([]);
      
      if (onGrupoChange) onGrupoChange();
    } catch (error) {
      console.error("[Frontend] ❌ Erro ao adicionar alunos ao grupo:", error);
      alert("Erro ao adicionar alunos ao grupo");
    } finally {
      setLoading(false);
    }
  };

  const removerAlunoDoGrupo = async (grupoId: string, alunoId: string) => {
    setLoading(true);
    try {
      await apiClient.delete(`/api/users/${professorId}/grupos/${grupoId}/alunos/${alunoId}`);
      await carregarMembrosGrupo(grupoId);
      
      if (onGrupoChange) onGrupoChange();
    } catch (error) {
      console.error("Erro ao remover aluno do grupo:", error);
      alert("Erro ao remover aluno do grupo");
    } finally {
      setLoading(false);
    }
  };

  const editarGrupo = async (grupoId: string, dados: { nome: string }) => {
    setLoading(true);
    try {
      await apiClient.put(`/api/users/${professorId}/grupos/${grupoId}`, dados);
      await carregarDados();
      setEditandoGrupo(null);
      
      if (onGrupoChange) onGrupoChange();
    } catch (error) {
      console.error("Erro ao editar grupo:", error);
      alert("Erro ao editar grupo");
    } finally {
      setLoading(false);
    }
  };

  const excluirGrupo = async (grupoId: string) => {
    if (!confirm("Tem certeza que deseja excluir este grupo?")) return;
    
    setLoading(true);
    try {
      console.log(`🗑️ Excluindo grupo: ${grupoId}`);
      await apiClient.delete(`/api/users/${professorId}/grupos/${grupoId}`);
      console.log(`✅ Grupo ${grupoId} excluído com sucesso`);
      
      await carregarDados();
      
      if (onGrupoChange) onGrupoChange();
    } catch (error: any) {
      console.error("Erro ao excluir grupo:", error);
      
      // Tratar diferentes tipos de erro
      if (error.response?.status === 404) {
        console.log("⚠️ Grupo não encontrado - atualizando lista");
        // Grupo já foi excluído ou não existe, apenas atualizar a lista
        await carregarDados();
        if (onGrupoChange) onGrupoChange();
      } else if (error.response?.status === 403) {
        alert("Você não tem permissão para excluir este grupo");
      } else {
        alert("Erro ao excluir grupo. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const alunosFiltrados = alunos.filter(aluno =>
    (aluno.name?.toLowerCase().includes(buscaAluno.toLowerCase()) ?? false) ||
    (aluno.email?.toLowerCase().includes(buscaAluno.toLowerCase()) ?? false)
  );

  // Alunos que não estão no grupo selecionado
  const alunosDisponiveis = alunosFiltrados.filter(aluno => {
    const grupo = grupos.find(g => g.id === grupoSelecionado);
    return !grupo?.membros?.some(membro => membro.id === aluno.id);
  });

  // Remove tabs, exibe todos os grupos em cards para seleção
  return (
    <ModalPadrao
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-600" />
          <span>Gerenciar Grupos</span>
        </div>
      }
      description="Organize seus alunos em grupos e equipes"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Lista de grupos em cards para seleção */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {grupos.map(grupo => (
            <Card
              key={grupo.id}
              className={`cursor-pointer border-2 transition-all ${grupoSelecionado === grupo.id ? 'border-blue-600 shadow-lg' : 'border-gray-200'}`}
              onClick={() => {
                setGrupoSelecionado(grupo.id);
                carregarMembrosGrupo(grupo.id);
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {editandoGrupo === grupo.id ? (
                      <form
                        className="space-y-2"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const form = e.target as HTMLFormElement;
                          const nome = (form.elements.namedItem('nome') as HTMLInputElement).value;
                          await editarGrupo(grupo.id, { nome });
                        }}
                      >
                        <Input
                          name="nome"
                          defaultValue={grupo.nome}
                          placeholder="Nome do grupo"
                          className="mb-1"
                          required
                          maxLength={50}
                          autoFocus
                        />
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" type="submit" variant="default">
                            <Save className="h-4 w-4 mr-1" /> Salvar
                          </Button>
                          <Button size="sm" type="button" variant="ghost" onClick={e => { e.stopPropagation(); setEditandoGrupo(null); }}>
                            <X className="h-4 w-4" /> Cancelar
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <CardTitle className="text-lg">{grupo.nome}</CardTitle>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={e => { e.stopPropagation(); setEditandoGrupo(editandoGrupo === grupo.id ? null : grupo.id); }}
                    >
                      {editandoGrupo === grupo.id ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={e => { e.stopPropagation(); excluirGrupo(grupo.id); }}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{grupo.membros?.length || 0} membros</span>
                  <Badge variant="outline" className="ml-auto">
                    {new Date(grupo.criadoEm).toLocaleDateString('pt-BR')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {grupos.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Nenhum grupo criado ainda.</p>
            </CardContent>
          </Card>
        )}

        {/* Gerenciamento de membros do grupo selecionado */}
        {grupoSelecionado && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Lista de alunos disponíveis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Adicionar Alunos
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar aluno..."
                    value={buscaAluno}
                    onChange={(e) => setBuscaAluno(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                {alunosDisponiveis.map(aluno => (
                  <div key={aluno.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                    <Checkbox
                      checked={alunosSelecionados.includes(aluno.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAlunosSelecionados([...alunosSelecionados, aluno.id]);
                        } else {
                          setAlunosSelecionados(alunosSelecionados.filter(id => id !== aluno.id));
                        }
                      }}
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={aluno.image || undefined} />
                      <AvatarFallback className="text-xs">
                        {getInitials(aluno.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{formatDisplayName(aluno.name)}</p>
                      <p className="text-xs text-gray-500 truncate">{formatDisplayEmail(aluno.email)}</p>
                    </div>
                  </div>
                ))}
                {alunosDisponiveis.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    {buscaAluno ? "Nenhum aluno encontrado" : "Todos os alunos já estão no grupo"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Membros do grupo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Membros do Grupo ({grupos.find(g => g.id === grupoSelecionado)?.membros?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                {grupos.find(g => g.id === grupoSelecionado)?.membros?.map(membro => (
                  <div key={membro.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={membro.image || undefined} />
                        <AvatarFallback className="text-xs">
                          {getInitials(membro.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{formatDisplayName(membro.name)}</p>
                        <p className="text-xs text-gray-500 truncate">{formatDisplayEmail(membro.email)}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removerAlunoDoGrupo(grupoSelecionado, membro.id)}
                      disabled={loading}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                )) || []}
                {(!grupos.find(g => g.id === grupoSelecionado)?.membros?.length) && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhum membro no grupo
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        {grupoSelecionado && alunosSelecionados.length > 0 && (
          <div className="flex justify-end mt-4">
            <Button onClick={adicionarAlunosAoGrupo} disabled={loading}>
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar {alunosSelecionados.length} aluno(s)
            </Button>
          </div>
        )}
      </div>
    </ModalPadrao>
  );
}
