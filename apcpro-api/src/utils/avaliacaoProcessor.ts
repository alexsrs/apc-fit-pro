type ObjetivoDominante =
  | "Controle de Doença"
  | "Saúde e Bem-estar"
  | "Estética / Hipertrofia";

interface ResultadoAnamnese {
  bloco2: {
    doencaDiagnosticada: boolean;
    medicacaoContinua: boolean;
    cirurgiaRecente: boolean;
  };
  bloco3: {
    praticaAtividade: boolean;
    frequencia: "1-2x" | "3-4x" | "5x ou mais";
  };
  bloco4: {
    objetivo:
      | "Melhorar ou controlar uma doença crônica"
      | "Melhorar minha disposição, qualidade de vida e envelhecer com saúde"
      | "Reduzir gordura corporal, melhorar a estética ou ganhar massa muscular";
  };
  bloco5: {
    qualidadeSono: number; // 1 a 5
    nivelEstresse: "Baixo" | "Moderado" | "Alto";
  };
  cintura?: number;
  pescoco?: number;
  quadril?: number;
  altura?: number;
  sexo?: "Masculino" | "Feminino";
  percentualGordura?: number;
  classificacaoGordura?: string;
}

function calcularPercentualGorduraMarinha({
  cintura,
  pescoco,
  quadril,
  altura,
  sexo,
}: {
  cintura: number;
  pescoco: number;
  quadril: number;
  altura: number;
  sexo: "Masculino" | "Feminino";
}): number {
  // Fórmula do método da Marinha dos EUA para cálculo do percentual de gordura
  if (sexo === "Masculino") {
    return (
      86.01 * Math.log10(cintura - pescoco) -
      70.041 * Math.log10(altura) +
      36.76
    );
  } else {
    return (
      163.205 * Math.log10(cintura + quadril - pescoco) -
      97.684 * Math.log10(altura) -
      78.387
    );
  }
}

function classificarPercentualGordura(
  percentual: number,
  sexo: "Masculino" | "Feminino"
): string {
  // Classificação do percentual de gordura
  if (sexo === "Masculino") {
    if (percentual < 6) return "Abaixo do normal";
    if (percentual < 24) return "Normal";
    if (percentual < 31) return "Sobrepeso";
    return "Obesidade";
  } else {
    if (percentual < 16) return "Abaixo do normal";
    if (percentual < 30) return "Normal";
    if (percentual < 36) return "Sobrepeso";
    return "Obesidade";
  }
}

export function classificarObjetivoAnamnese(
  resultado: ResultadoAnamnese
): ObjetivoDominante {
  let score = {
    "Controle de Doença": 0,
    "Saúde e Bem-estar": 0,
    "Estética / Hipertrofia": 0,
  };

  // Bloco 2 – Estado de Saúde e Histórico Médico
  if (resultado.bloco2.doencaDiagnosticada) {
    score["Controle de Doença"] += 3;
  } else {
    score["Saúde e Bem-estar"] += 1;
  }

  if (resultado.bloco2.medicacaoContinua) {
    score["Controle de Doença"] += 2;
  } else {
    score["Saúde e Bem-estar"] += 1;
  }

  if (resultado.bloco2.cirurgiaRecente) {
    score["Controle de Doença"] += 1;
  }

  // Bloco 3 – Nível de Atividade
  if (!resultado.bloco3.praticaAtividade) {
    score["Controle de Doença"] += 2;
  } else {
    score["Saúde e Bem-estar"] += 1;
    switch (resultado.bloco3.frequencia) {
      case "1-2x":
        score["Saúde e Bem-estar"] += 1;
        break;
      case "3-4x":
        score["Estética / Hipertrofia"] += 2;
        break;
      case "5x ou mais":
        score["Estética / Hipertrofia"] += 3;
        break;
    }
  }

  // Bloco 4 – Objetivo Declarado (Peso máximo)
  switch (resultado.bloco4.objetivo) {
    case "Melhorar ou controlar uma doença crônica":
      score["Controle de Doença"] += 10;
      break;
    case "Melhorar minha disposição, qualidade de vida e envelhecer com saúde":
      score["Saúde e Bem-estar"] += 10;
      break;
    case "Reduzir gordura corporal, melhorar a estética ou ganhar massa muscular":
      score["Estética / Hipertrofia"] += 10;
      break;
  }

  // Bloco 5 – Bem-estar
  if (resultado.bloco5.qualidadeSono <= 2) {
    score["Controle de Doença"] += 1;
  } else if (resultado.bloco5.qualidadeSono <= 4) {
    score["Saúde e Bem-estar"] += 1;
  } else {
    score["Estética / Hipertrofia"] += 1;
  }

  switch (resultado.bloco5.nivelEstresse) {
    case "Alto":
      score["Controle de Doença"] += 1;
      break;
    case "Moderado":
      score["Saúde e Bem-estar"] += 1;
      break;
    case "Baixo":
      score["Estética / Hipertrofia"] += 1;
      break;
  }

  // Exemplo de uso do método da Marinha dos EUA
  const percentualGordura = calcularPercentualGorduraMarinha({
    cintura: resultado.cintura ?? 0,
    pescoco: resultado.pescoco ?? 0,
    quadril: resultado.quadril ?? 0,
    altura: resultado.altura ?? 0,
    sexo: resultado.sexo ?? "Masculino",
  });
  const classificacaoGordura = classificarPercentualGordura(
    percentualGordura,
    resultado.sexo ?? "Masculino"
  );

  resultado.percentualGordura = percentualGordura;
  resultado.classificacaoGordura = classificacaoGordura;

  // Ranking final
  const maiorPontuacao = Math.max(...Object.values(score));
  const categoriasComMaiorPontuacao = Object.entries(score)
    .filter(([_, v]) => v === maiorPontuacao)
    .map(([k]) => k as ObjetivoDominante);

  // Desempate: usa o objetivo declarado (Bloco 4)
  if (categoriasComMaiorPontuacao.length > 1) {
    switch (resultado.bloco4.objetivo) {
      case "Melhorar ou controlar uma doença crônica":
        return "Controle de Doença";
      case "Melhorar minha disposição, qualidade de vida e envelhecer com saúde":
        return "Saúde e Bem-estar";
      case "Reduzir gordura corporal, melhorar a estética ou ganhar massa muscular":
        return "Estética / Hipertrofia";
    }
  }

  return categoriasComMaiorPontuacao[0];
}
