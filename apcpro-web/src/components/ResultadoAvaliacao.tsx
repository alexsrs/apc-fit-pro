import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Utilitário para formatar nomes de campos
function formatLabel(label: string) {
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/_/g, " ")
    .replace("Gc", "Gordura corporal")
    .replace("Lee", " (Lee)")
    .replace("Deurenberg", " (Deurenberg)")
    .replace("Marinha", " (Marinha)");
}

type KeyValueData = Record<string, string | number | null | undefined>;
type IndicesData = Record<string, string | number | undefined | null>;

function KeyValueList({ data }: { data: KeyValueData }) {
  const entries = Object.entries(data).filter(
    ([, v]) => v !== null && v !== undefined
  );
  if (entries.length === 0) return null;
  return (
    <div className="grid grid-cols-2 items-center">
      {entries.map(([k, v]) => {
        let unidade = "";
        const keyLower = k.toLowerCase();

        // Identifica campos de medida linear e aplica 'cm'
        if (isCampoMedidaCm(k)) {
          unidade = "cm";
        } else if (keyLower.includes("peso")) {
          unidade = "kg";
        } else if (
          keyLower.includes("percentual") ||
          keyLower.includes("índice") ||
          keyLower.includes("indice")
        ) {
          unidade = "%";
        }

        // Formatação de campo de data para dd/mm/aaaa
        if (
          keyLower.includes("data") &&
          typeof v === "string" &&
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v)
        ) {
          const dataObj = new Date(v);
          const dataFormatada = !isNaN(dataObj.getTime())
            ? `${dataObj.getDate().toString().padStart(2, "0")}/${(
                dataObj.getMonth() + 1
              )
                .toString()
                .padStart(2, "0")}/${dataObj.getFullYear()}`
            : v;
          return (
            <React.Fragment key={k}>
              <span className="text-zinc-500 text-xs font-sans">
                {formatLabel(k)}
              </span>
              <span className="text-zinc-900 text-xs font-mono font-semibold">
                {dataFormatada}
              </span>
            </React.Fragment>
          );
        }
        // Formatação para idade sem casas decimais
        if (keyLower === "idade" && typeof v === "number") {
          return (
            <React.Fragment key={k}>
              <span className="text-zinc-500 text-xs font-sans">
                {formatLabel(k)}
              </span>
              <span className="text-zinc-900 text-xs font-mono font-semibold">
                {Math.round(v)}
              </span>
            </React.Fragment>
          );
        }
        return (
          <React.Fragment key={k}>
            <span className="text-zinc-500 text-xs font-sans">
              {formatLabel(k)}
            </span>
            <span className="text-zinc-900 text-xs font-mono font-semibold">
              {typeof v === "number"
                ? `${v.toFixed(2)}${unidade ? ` ${unidade}` : ""}`
                : String(v)}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function getBadgeColor(text: string): string {
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

function Classificacoes({ resultado }: { resultado: KeyValueData }) {
  const classificacoes = Object.entries(resultado)
    .filter(
      ([k]) =>
        k.toLowerCase().includes("classificacao") ||
        k.toLowerCase().includes("percentual")
    )
    .filter(([, v]) => v !== null && v !== undefined);

  if (classificacoes.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 font-sans">
      {classificacoes.map(([k, v]) => (
        <Badge
          key={k}
          className={cn(
            "text-xs font-semibold font-sans px-2 py-0.5 rounded border",
            getBadgeColor(String(v))
          )}
        >
          {formatLabel(k)}: {String(v)}
        </Badge>
      ))}
    </div>
  );
}

// Função para normalizar as chaves (remove espaços, parênteses, acentos e deixa minúsculo)
function normalizeKey(key: string) {
  return key
    .normalize("NFD") // separa acentos das letras
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/\s+/g, "") // remove todos os espaços
    .replace(/[()]/g, "") // remove todos os parênteses
    .replace(/[^a-zA-Z0-9]/g, "") // remove outros caracteres especiais
    .toLowerCase();
}

// Função utilitária para identificar campos de medidas lineares (cm)
function isCampoMedidaCm(label: string) {
  const l = label.toLowerCase();
  return (
    l.includes("circunferencia") ||
    l.includes("perimetro") ||
    l.includes("comprimento") ||
    l.includes("altura") ||
    l.includes("panturrilha") ||
    l.includes("coxa") ||
    l.includes("braco") ||
    l.includes("antebraco") ||
    l.includes("torax") ||
    l.includes("abdomen") ||
    l.includes("quadril") ||
    l.includes("biceps") || // Adicionado para pegar bíceps
    l.includes("cintura") || // Adicionado para pegar cintura
    l.includes("pescoco")
  );
}

function IndicesColunasAgrupados({ data }: { data: IndicesData }) {
  const ordem: [string, string, string?][] = [
    ["Ca", "Classificacao C A"],
    ["Imc", "Classificacao I M C"],
    ["Rcq", "Classificacao R C Q"],
    ["Percentual G C (Gomez)", "Classificacao G C (Gomez)", "%"],
    ["Percentual G C (Marinha)", "Classificacao G C (Marinha)", "%"],
    ["Percentual G C (Deurenberg)", "Classificacao G C (Deurenberg)", "%"],
    ["Massa Muscular (Lee)", "Massa Muscular (Doupe)"],
  ];

  // Normaliza todas as chaves do data para facilitar busca
  const dataNormalizado: Record<string, string | number | null | undefined> =
    {};
  Object.entries(data).forEach(([k, v]) => {
    dataNormalizado[normalizeKey(k)] = v;
  });

  const usados = new Set(
    ordem
      .flat()
      .filter((k): k is string => typeof k === "string")
      .map(normalizeKey)
  );

  const linhas = ordem.map(([indice, classificacao, unidade]) => {
    const valor = dataNormalizado[normalizeKey(indice)];
    const valorClassificacao = dataNormalizado[normalizeKey(classificacao)];
    const isDoupe =
      normalizeKey(classificacao) === normalizeKey("Massa Muscular (Doupe)");
    const isMedidaCm = isCampoMedidaCm(indice);

    return (
      <React.Fragment key={indice}>
        <span className="text-zinc-500 text-xs font-sans px-2">
          {formatLabel(indice)}
        </span>
        <span className="text-zinc-900 text-xs font-mono font-bold px-2">
          {valor !== undefined && valor !== null
            ? typeof valor === "number"
              ? `${valor.toFixed(2)}${
                  isMedidaCm ? " cm" : unidade ? ` ${unidade}` : ""
                }`
              : valor
            : "--"}
        </span>
        <span className="text-zinc-500 text-xs font-sans px-2">
          {formatLabel(classificacao)}
        </span>
        {valorClassificacao !== undefined &&
        valorClassificacao !== null &&
        valorClassificacao !== "" ? (
          isDoupe ? (
            <span className="text-zinc-900 text-xs font-mono font-bold">
              {String(valorClassificacao)}
            </span>
          ) : (
            <Badge
              className={cn(
                "ml-2 text-xs font-semibold font-sans px-2 py-0.5 rounded border",
                getBadgeColor(String(valorClassificacao))
              )}
            >
              {String(valorClassificacao)}
            </Badge>
          )
        ) : (
          <span className="text-zinc-400 text-xs font-sans">--</span>
        )}
      </React.Fragment>
    );
  });

  // Mostra os índices extras (não previstos na ordem)
  const extras = Object.entries(dataNormalizado)
    .filter(([k, v]) => !usados.has(k) && v !== undefined && v !== null)
    .flatMap(([k, v]) => [
      <span key={k + "-label"} className="text-zinc-500 text-xs font-sans px-2">
        {formatLabel(k)}
      </span>,
      <span
        key={k + "-valor"}
        className="text-zinc-900 text-xs font-mono font-bold px-2"
      >
        {typeof v === "number" ? v.toFixed(2) : String(v)}
      </span>,
      <span key={k + "-empty1"} />,
      <span key={k + "-empty2"} />,
    ]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-x-2 gap-y-2 items-center">
        {linhas}
        {extras}
      </div>
    </div>
  );
}

// Legenda das siglas dos índices
const legendaSiglas: Record<string, string> = {
  Ca: "Circunferência abdominal",
  Rcq: "Relação cintura x quadril",
  Imc: "Índice de Massa Corporal",
  GC: "Gordura Corporal",

  // Adicione outras siglas conforme necessário
};

interface ResultadoAvaliacaoProps {
  resultado: KeyValueData;
  inModal?: boolean;
}

export function ResultadoAvaliacao({ resultado }: ResultadoAvaliacaoProps) {
  if (!resultado || typeof resultado !== "object") return null;

  // Separar campos primitivos e objetos
  const dadosGerais: KeyValueData = {};
  const grupos: Record<string, KeyValueData> = {};
  let indices: KeyValueData | null = null;

  Object.entries(resultado).forEach(([k, v]) => {
    if (v === null || v === undefined) return;
    if (typeof v === "object" && !Array.isArray(v)) {
      if (k.toLowerCase() === "indices") {
        indices = v as KeyValueData;
      } else {
        grupos[k] = v as KeyValueData;
      }
    } else if (
      !k.toLowerCase().includes("classificacao") &&
      !k.toLowerCase().includes("percentual")
    ) {
      dadosGerais[k] = v as string | number;
    }
  });

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <Card className="mb-0 bg-zinc-50 border-none shadow-none">
      <CardHeader className="py-0 px-1 min-h-0">
        <CardTitle className="text-sm font-bold font-sans leading-tight py-0 my-0">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="font-sans pt-0 mt-0">{children}</CardContent>
    </Card>
  );

  return (
    <div className="space-y-1">
      <Classificacoes resultado={resultado} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {Object.keys(dadosGerais).length > 0 && (
          <Section title="Dados Gerais">
            <KeyValueList data={dadosGerais} />
          </Section>
        )}
        {grupos.Tronco && Object.keys(grupos.Tronco).length > 0 && (
          <Section title="Tronco">
            <KeyValueList data={grupos.Tronco} />
          </Section>
        )}
        {Object.entries(grupos).map(
          ([nome, grupo]) =>
            nome !== "Tronco" &&
            Object.keys(grupo).length > 0 && (
              <Section title={formatLabel(nome)} key={nome}>
                <KeyValueList data={grupo} />
              </Section>
            )
        )}
      </div>
      {indices && Object.keys(indices).length > 0 && (
        <Section title="Índices">
          <IndicesColunasAgrupados data={indices} />
          {/* Legenda das siglas */}
          <div className="pt-4 text-[11px] text-zinc-400">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-1 list-none pl-0 justify-center items-center">
              {Object.entries(legendaSiglas).map(([sigla, desc]) => (
                <li key={sigla} className="flex items-center justify-center">
                  <span className="text-zinc-400">{sigla} -</span>
                  <span className="text-zinc-400">{desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}
    </div>
  );
}
