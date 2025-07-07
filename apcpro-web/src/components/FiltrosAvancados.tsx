"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Filter,
  X,
  Search,
  CalendarDays,
  Users,
  TrendingUp,
} from "lucide-react";

export interface FiltrosAvancadosProps {
  busca: string;
  onBuscaChange: (busca: string) => void;
  filtros: {
    status: string;
    genero: string;
    idadeMin: string;
    idadeMax: string;
    grupoId: string;
    ultimaAvaliacao: string;
  };
  onFiltrosChange: (filtros: any) => void;
  grupos?: Array<{ id: string; nome: string }>;
  className?: string;
}

export function FiltrosAvancados({
  busca,
  onBuscaChange,
  filtros,
  onFiltrosChange,
  grupos = [],
  className,
}: FiltrosAvancadosProps) {
  const [showFiltros, setShowFiltros] = useState(false);

  const filtrosAtivos = Object.values(filtros).filter(Boolean).length;

  const limparFiltros = () => {
    onFiltrosChange({
      status: "",
      genero: "",
      idadeMin: "",
      idadeMax: "",
      grupoId: "",
      ultimaAvaliacao: "",
    });
  };

  const filtrosPadrao = [
    {
      key: "status",
      label: "Status",
      icon: <TrendingUp className="h-4 w-4" />,
      opcoes: [
        { value: "ativo", label: "Ativo" },
        { value: "inativo", label: "Inativo" },
        { value: "pendente", label: "Pendente" },
      ],
    },
    {
      key: "genero",
      label: "Gênero",
      icon: <Users className="h-4 w-4" />,
      opcoes: [
        { value: "masculino", label: "Masculino" },
        { value: "feminino", label: "Feminino" },
        { value: "outro", label: "Outro" },
      ],
    },
    {
      key: "ultimaAvaliacao",
      label: "Última Avaliação",
      icon: <CalendarDays className="h-4 w-4" />,
      opcoes: [
        { value: "7d", label: "Últimos 7 dias" },
        { value: "30d", label: "Últimos 30 dias" },
        { value: "90d", label: "Últimos 3 meses" },
        { value: "sem_avaliacao", label: "Sem avaliação" },
      ],
    },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barra de busca principal */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar aluno por nome, email ou telefone..."
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Botão de filtros avançados */}
        <Popover open={showFiltros} onOpenChange={setShowFiltros}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {filtrosAtivos > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {filtrosAtivos}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filtros Avançados</h4>
                {filtrosAtivos > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={limparFiltros}
                    className="h-8 px-2"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>

              {/* Filtros de select */}
              {filtrosPadrao.map((filtro) => (
                <div key={filtro.key} className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    {filtro.icon}
                    {filtro.label}
                  </Label>
                  <Select
                    value={filtros[filtro.key as keyof typeof filtros]}
                    onValueChange={(value) =>
                      onFiltrosChange({ ...filtros, [filtro.key]: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Todos ${filtro.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">
                        Todos {filtro.label.toLowerCase()}
                      </SelectItem>
                      {filtro.opcoes.map((opcao) => (
                        <SelectItem key={opcao.value} value={opcao.value}>
                          {opcao.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              {/* Grupo */}
              {grupos.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4" />
                    Grupo/Time
                  </Label>
                  <Select
                    value={filtros.grupoId}
                    onValueChange={(value) =>
                      onFiltrosChange({ ...filtros, grupoId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os grupos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os grupos</SelectItem>
                      {grupos.map((grupo) => (
                        <SelectItem key={grupo.id} value={grupo.id}>
                          {grupo.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Faixa etária */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Faixa Etária</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filtros.idadeMin}
                      onChange={(e) =>
                        onFiltrosChange({ ...filtros, idadeMin: e.target.value })
                      }
                      min="0"
                      max="120"
                    />
                  </div>
                  <span className="flex items-center text-muted-foreground">até</span>
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filtros.idadeMax}
                      onChange={(e) =>
                        onFiltrosChange({ ...filtros, idadeMax: e.target.value })
                      }
                      min="0"
                      max="120"
                    />
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Tags dos filtros ativos */}
      {filtrosAtivos > 0 && (
        <div className="flex flex-wrap gap-1">
          {Object.entries(filtros).map(([key, value]) => {
            if (!value) return null;
            
            let label = value;
            
            // Busca o label amigável para filtros de select
            const filtroConfig = filtrosPadrao.find(f => f.key === key);
            if (filtroConfig) {
              const opcao = filtroConfig.opcoes.find(o => o.value === value);
              if (opcao) label = opcao.label;
            }
            
            // Labels especiais
            if (key === "grupoId" && grupos.length > 0) {
              const grupo = grupos.find(g => g.id === value);
              if (grupo) label = grupo.nome;
            }
            
            if (key === "idadeMin") label = `Idade ≥ ${value}`;
            if (key === "idadeMax") label = `Idade ≤ ${value}`;

            return (
              <Badge
                key={key}
                variant="secondary"
                className="gap-1 pr-1"
              >
                {label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() =>
                    onFiltrosChange({ ...filtros, [key]: "" })
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
