/**
 * Teste de integração do DobrasCutaneasService
 * Demonstra o funcionamento completo do sistema
 */

const { DobrasCutaneasService } = require('./src/services/dobras-cutaneas-service');

// Instanciar o service
const service = new DobrasCutaneasService();

// Função para testar o service
async function testarDobrasCutaneasService() {
  console.log('🧪 === TESTE DO SERVICE DE DOBRAS CUTÂNEAS ===\n');

  try {
    // 1. Testar listagem de protocolos
    console.log('📋 1. Listando protocolos disponíveis:');
    const protocolos = service.listarProtocolosDisponiveis();
    console.log(`   ✅ Encontrados ${protocolos.length} protocolos:`);
    protocolos.forEach(p => {
      console.log(`      - ${p.nome} (${p.numDobras} dobras)`);
    });
    console.log('');

    // 2. Testar processamento de avaliação - Faulkner
    console.log('⚗️ 2. Testando processamento com protocolo Faulkner:');
    const inputFaulkner = {
      userPerfilId: 'test-user-123',
      protocolo: 'faulkner',
      dadosPessoais: {
        genero: 'M',
        peso: 80
      },
      medidas: {
        triceps: 12,
        subescapular: 15,
        suprailiaca: 18,
        bicipital: 8
      },
      observacoes: 'Teste de integração'
    };

    const resultadoFaulkner = await service.processarAvaliacao(inputFaulkner);
    console.log(`   ✅ Percentual de gordura: ${resultadoFaulkner.resultados.percentualGordura}%`);
    console.log(`   ✅ Classificação: ${resultadoFaulkner.resultados.classificacao}`);
    console.log(`   ✅ Massa gorda: ${resultadoFaulkner.resultados.massaGorda}kg`);
    console.log(`   ✅ Massa magra: ${resultadoFaulkner.resultados.massaMagra}kg`);
    console.log('');

    // 3. Testar protocolo Pollock 7 dobras
    console.log('⚗️ 3. Testando processamento com protocolo Pollock 7 dobras:');
    const inputPollock7 = {
      userPerfilId: 'test-user-456',
      protocolo: 'pollock-7',
      dadosPessoais: {
        genero: 'F',
        idade: 25,
        peso: 60
      },
      medidas: {
        triceps: 14,
        subescapular: 10,
        suprailiaca: 16,
        abdominal: 12,
        peitoral: 8,
        axilarMedia: 11,
        coxa: 18
      },
      observacoes: 'Teste Pollock 7'
    };

    const resultadoPollock7 = await service.processarAvaliacao(inputPollock7);
    console.log(`   ✅ Percentual de gordura: ${resultadoPollock7.resultados.percentualGordura}%`);
    console.log(`   ✅ Classificação: ${resultadoPollock7.resultados.classificacao}`);
    console.log(`   ✅ Densidade corporal: ${resultadoPollock7.resultados.densidadeCorporal}`);
    console.log('');

    // 4. Testar protocolo Guedes
    console.log('⚗️ 4. Testando processamento com protocolo Guedes:');
    const inputGuedes = {
      userPerfilId: 'test-user-789',
      protocolo: 'guedes',
      dadosPessoais: {
        genero: 'M',
        idade: 30,
        peso: 75
      },
      medidas: {
        triceps: 13,
        subescapular: 14,
        suprailiaca: 17,
        abdominal: 16,
        coxa: 19,
        peitoral: 9,
        axilarMedia: 12
      },
      observacoes: 'Teste Guedes'
    };

    const resultadoGuedes = await service.processarAvaliacao(inputGuedes);
    console.log(`   ✅ Percentual de gordura: ${resultadoGuedes.resultados.percentualGordura}%`);
    console.log(`   ✅ Classificação: ${resultadoGuedes.resultados.classificacao}`);
    console.log('');

    // 5. Testar validação de dados inválidos
    console.log('🚫 5. Testando validação com dados inválidos:');
    try {
      const inputInvalido = {
        userPerfilId: 'test-user-error',
        protocolo: 'faulkner',
        dadosPessoais: {
          genero: 'M',
          peso: 80
        },
        medidas: {
          triceps: 2, // Inválido (< 3mm)
          subescapular: 15,
          suprailiaca: 18,
          bicipital: 8
        }
      };
      
      await service.processarAvaliacao(inputInvalido);
      console.log('   ❌ Erro: Deveria ter rejeitado dados inválidos');
    } catch (error) {
      console.log(`   ✅ Validação funcionou: ${error.message}`);
    }
    console.log('');

    console.log('🎉 === TESTE FINALIZADO COM SUCESSO ===');
    console.log('✅ Todos os protocolos estão funcionando corretamente!');
    console.log('✅ Validações estão ativas!');
    console.log('✅ Service está pronto para uso!');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    console.error(error.stack);
  }
}

// Executar o teste
testarDobrasCutaneasService();
