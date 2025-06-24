/**
 * Utilitário para determinar a cor do badge de acordo com a classificação.
 * Aceita array de objetos com label, color e opcionalmente min/max para faixas numéricas.
 */
// Tipos para classificação de badge
export type BadgeClassificacao =
  | { label: string; color: string; keywords?: string[] }
  | { min: number; max: number; label: string; color: string };

// Função auxiliar para identificar faixas numéricas
function isRangeClassificacao(
  c: BadgeClassificacao
): c is { min: number; max: number; label: string; color: string } {
  return (
    typeof (c as any).min === "number" && typeof (c as any).max === "number"
  );
}

// Função para obter a cor do badge conforme a classificação
export function getBadgeColor(
  classificacao: string | number,
  classificacoes: BadgeClassificacao[]
): string {
  if (typeof classificacao === "number") {
    const faixa = classificacoes.find(
      (c) =>
        isRangeClassificacao(c) &&
        classificacao >= c.min &&
        classificacao <= c.max
    );
    if (faixa) return faixa.color;
  } else if (typeof classificacao === "string") {
    const texto = classificacao
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const exato = classificacoes.find(
      (c) =>
        "label" in c &&
        c.label
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") === texto
    );
    if (exato) return exato.color;
    const porKeyword = classificacoes.find(
      (c) =>
        "keywords" in c &&
        Array.isArray(c.keywords) &&
        c.keywords.some((kw) => texto.includes(kw.toLowerCase()))
    );
    if (porKeyword) return porKeyword.color;
    const parcial = classificacoes.find(
      (c) =>
        "label" in c &&
        texto.includes(
          c.label
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        )
    );
    if (parcial) return parcial.color;
  }
  return "bg-zinc-100 text-zinc-700 border border-zinc-200";
}

/**
 * Função para obter a cor do badge conforme o texto.
 * Centraliza a lógica de cores de badges em um único lugar.
 * @param text Texto a ser avaliado
 * @returns Classe CSS da cor do badge
 */
export function getBadgeColorByText(text: string): string {
  const t = text.toLowerCase();
  if (
    t.includes("baixo peso") ||
    t.includes("abaixo do ideal") ||
    t.includes("muito aumentado") ||
    t.includes("alto risco") ||
    t.includes("ruim") ||
    t.includes("obesidade") ||
    t.includes("sobrepeso")
  ) {
    return "bg-red-100 text-red-700 border border-red-200";
  }
  if (
    t.includes("ideal") ||
    t.includes("bom") ||
    t.includes("normal") ||
    t.includes("desejável") ||
    t.includes("adequado")
  ) {
    return "bg-green-100 text-green-700 border border-green-200";
  }
  if (
    t.includes("moderado") ||
    t.includes("atenção") ||
    t.includes("limítrofe")
  ) {
    return "bg-yellow-100 text-yellow-800 border border-yellow-200";
  }
  return "bg-zinc-100 text-zinc-700 border border-zinc-200";
}

// Função para renderizar o badge de classificação
import React from "react";
import { Badge } from "@/components/ui/badge";

/**
 * Renderiza um badge de classificação.
 * @param classificacao Valor da classificação (string, number, null ou undefined)
 * @param classificacoes Lista de classificações possíveis
 * @returns Elemento React do badge ou null
 */
export function renderBadge(
  classificacao: string | number | null | undefined,
  classificacoes: BadgeClassificacao[]
): React.ReactElement | null {
  if (classificacao === null || classificacao === undefined) return null;
  const corBadge = getBadgeColor(classificacao ?? "", classificacoes);
  const textoBadge =
    String(classificacao).trim() !== ""
      ? String(classificacao)
      : "Sem classificação";
  return <Badge className={corBadge}>{textoBadge}</Badge>;
}
