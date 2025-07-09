// Teste do endpoint via curl/fetch
const dadosTeste = {
  peso: 70,
  altura: 175,
  idade: 25,
  genero: "masculino", // ou usar o enum correto
  cintura: 80,
  pescoco: 38,
  quadril: 95,
  abdomen: 82,
  dobras: {
    triceps: 10,
    biceps: 8,
    subescapular: 12,
    suprailiaca: 14,
    abdominal: 16,
    coxa: 15,
    panturrilha: 10
  }
};

async function testarAPI() {
  try {
    console.log("🚀 Testando endpoint /api/calcular-medidas");
    console.log("Dados enviados:", JSON.stringify(dadosTeste, null, 2));
    
    const response = await fetch("http://localhost:3333/api/calcular-medidas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosTeste),
    });

    console.log("Status:", response.status);
    
    if (response.ok) {
      const resultado = await response.json();
      console.log("✅ Sucesso! Resultado:");
      console.log(JSON.stringify(resultado, null, 2));
    } else {
      const erro = await response.text();
      console.log("❌ Erro:", erro);
    }
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
  }
}

// Executar teste
testarAPI();
