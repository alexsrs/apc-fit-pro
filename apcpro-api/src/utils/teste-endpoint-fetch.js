// Teste simples do endpoint
function testarEndpoint() {
  const dados = {
    peso: 70,
    altura: 175,
    idade: 25,
    genero: "masculino",
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

  console.log("🧪 Testando endpoint /api/calcular-medidas");
  console.log("📤 Enviando dados:", JSON.stringify(dados, null, 2));

  fetch("http://localhost:3333/api/calcular-medidas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dados)
  })
  .then(response => {
    console.log(`📊 Status: ${response.status}`);
    if (!response.ok) {
      return response.text().then(text => {
        console.log("❌ Erro:", text);
        throw new Error(`HTTP ${response.status}: ${text}`);
      });
    }
    return response.json();
  })
  .then(resultado => {
    console.log("✅ Sucesso!");
    console.log("📋 Resultado:", JSON.stringify(resultado, null, 2));
  })
  .catch(error => {
    console.error("❌ Erro ao testar endpoint:", error.message);
  });
}

// Executar teste
testarEndpoint();
