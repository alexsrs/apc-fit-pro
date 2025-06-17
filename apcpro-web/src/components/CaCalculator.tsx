import React, { useState } from "react";
import { CaInfo } from "./CaInfo";
import { CaClassificacaoModal } from "./CaClassificacaoModal";
import { Button } from "@/components/ui/button";
import type { CircunferenciaAbdominalResultado } from "@/services/ca-service";

export function CaCalculator() {
  const [valor, setValor] = useState("");
  const [genero, setGenero] = useState<"masculino" | "feminino">("masculino");
  const [resultado, setResultado] = useState<CircunferenciaAbdominalResultado | null>(null);
  const [showReferencias, setShowReferencias] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valor || isNaN(Number(valor))) return;
    fetch("/api/avaliar-ca", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valor: Number(valor), genero }),
    })
      .then((res) => res.json())
      .then((data) => setResultado(data.body || data));
  }

  return (
    <section className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">
        Calculadora de Circunferência Abdominal (CA)
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        aria-label="Formulário de cálculo de CA"
      >
        <div>
          <label htmlFor="valor" className="block text-sm font-medium">
            Circunferência abdominal (cm)
          </label>
          <input
            id="valor"
            name="valor"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="genero" className="block text-sm font-medium">
            Gênero
          </label>
          <select
            id="genero"
            name="genero"
            value={genero}
            onChange={(e) =>
              setGenero(e.target.value as "masculino" | "feminino")
            }
            className="mt-1 block w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
            aria-required="true"
          >
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>
        </div>
        <Button type="submit" className="w-full" aria-label="Calcular CA">
          Calcular CA
        </Button>
      </form>

      {resultado && <CaInfo resultado={resultado} />}

      <div className="flex gap-2 mt-6">
        <CaClassificacaoModal
          trigger={
            <button className="py-1 px-3 bg-blue-600 text-white rounded text-sm">
              Ver tabela de classificação
            </button>
          }
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowReferencias(true)}
        >
          Referências científicas
        </Button>
      </div>

      {/* Modal de referências científicas */}
      {showReferencias && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">
              Referências científicas sobre CA
            </h3>
            <ul className="list-disc pl-5 text-sm mb-4">
              <li>
                <a
                  href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  OMS - Obesidade e Sobrepeso
                </a>
              </li>
              <li>
                <a
                  href="https://www.nhlbi.nih.gov/health/educational/lose_wt/risk.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  NIH - Riscos da circunferência abdominal
                </a>
              </li>
              <li>
                <a
                  href="https://www.verywellhealth.com/waist-circumference-5208852"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Verywell Health - Waist Circumference
                </a>
              </li>
            </ul>
            <Button
              className="w-full mt-2"
              onClick={() => setShowReferencias(false)}
            >
              Fechar
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
