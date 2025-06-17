import React, { useState } from "react";

// Classificação OMS/CDC
const classificacoes = [
  { min: 0, max: 18.49, label: "Abaixo do peso" },
  { min: 18.5, max: 24.99, label: "Peso normal" },
  { min: 25, max: 29.99, label: "Pré-obesidade" },
  { min: 30, max: 34.99, label: "Obesidade I" },
  { min: 35, max: 39.99, label: "Obesidade II" },
  { min: 40, max: Infinity, label: "Obesidade III" },
];

function classificarImc(imc: number): string {
  const item = classificacoes.find((c) => imc >= c.min && imc <= c.max);
  return item ? item.label : "-";
}

/**
 * Calculadora de IMC conforme OMS/CDC
 * @returns JSX.Element
 */
export function ImcCalculator() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [imc, setImc] = useState<number | null>(null);
  const [detalhes, setDetalhes] = useState(false);
  const [validacao, setValidacao] = useState(false);

  function calcularImc(e: React.FormEvent) {
    e.preventDefault();
    const pesoNum = parseFloat(peso.replace(",", "."));
    const alturaNum = parseFloat(altura.replace(",", "."));
    if (!pesoNum || !alturaNum || alturaNum <= 0) {
      setImc(null);
      return;
    }
    const valor = pesoNum / (alturaNum * alturaNum);
    setImc(Number(valor.toFixed(2)));
  }

  return (
    <section className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Calculadora de IMC</h2>
      <form
        onSubmit={calcularImc}
        className="space-y-4"
        aria-label="Formulário de cálculo de IMC"
      >
        <div>
          <label htmlFor="peso" className="block text-sm font-medium">
            Peso (kg)
          </label>
          <input
            id="peso"
            name="peso"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="altura" className="block text-sm font-medium">
            Altura (m)
          </label>
          <input
            id="altura"
            name="altura"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
            aria-required="true"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring"
          aria-label="Calcular IMC"
        >
          Calcular IMC
        </button>
      </form>

      {imc !== null && (
        <div className="mt-6">
          <p className="text-lg">
            Seu IMC: <span className="font-bold">{imc}</span>
          </p>
          <p className="text-md">
            Classificação:{" "}
            <span className="font-semibold">{classificarImc(imc)}</span>
          </p>
        </div>
      )}

      <div className="flex gap-2 mt-6">
        <button
          type="button"
          className="py-1 px-3 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          onClick={() => setDetalhes(true)}
          aria-label="Ver detalhes da classificação do IMC"
        >
          Detalhes
        </button>
        <button
          type="button"
          className="py-1 px-3 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          onClick={() => setValidacao(true)}
          aria-label="Ver validação científica"
        >
          Validação científica
        </button>
      </div>

      {/* Modal Detalhes */}
      {detalhes && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">
              Classificação do IMC (OMS/CDC)
            </h3>
            <ul className="mb-4 text-sm">
              <li>{"< 18,5: Abaixo do peso"}</li>
              <li>{"18,5–24,9: Peso normal"}</li>
              <li>{"25–29,9: Pré-obesidade"}</li>
              <li>{"30–34,9: Obesidade I"}</li>
              <li>{"35–39,9: Obesidade II"}</li>
              <li>{">= 40: Obesidade III"}</li>
            </ul>
            <button
              className="py-1 px-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              onClick={() => setDetalhes(false)}
              aria-label="Fechar detalhes"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal Validação */}
      {validacao && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">
              Validação científica do IMC
            </h3>
            <p className="text-sm mb-2">
              Cortes padronizados pela OMS/CDC. O IMC é útil para triagem
              populacional, mas possui limitações: não diferencia massa magra de
              gordura, não avalia distribuição de gordura e pode variar conforme
              etnia, idade e nível de atividade física.
            </p>
            <ul className="mb-2 text-xs list-disc pl-4">
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
                  href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4869763/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  NCBI - Limitações do IMC
                </a>
              </li>
              <li>
                <a
                  href="https://www.verywellhealth.com/body-mass-index-bmi-5184776"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Verywell Health - BMI
                </a>
              </li>
            </ul>
            <p className="text-xs text-gray-500">
              Limitações: massa magra x gordura, distribuição de gordura,
              diferenças étnicas, idade e nível de atividade física.
            </p>
            <button
              className="py-1 px-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm mt-2"
              onClick={() => setValidacao(false)}
              aria-label="Fechar validação"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// Para uso: <ImcCalculator />
