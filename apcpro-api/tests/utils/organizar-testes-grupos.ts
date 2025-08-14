/**
 * Script para organizar e limpar os testes de grupos
 * Remove arquivos temporários de debug e organiza a estrutura de testes
 */

import { unlink, stat } from 'fs/promises';
import { join } from 'path';

async function limparArquivosTemporarios() {
  const arquivosParaRemover = [
    '../src/utils/debug-grupos.ts',
    '../docs/script-teste-grupos.js',
    '../docs/verificar-grupos.sql',
  ];

  console.log('🧹 Limpando arquivos temporários de debug...');

  for (const arquivo of arquivosParaRemover) {
    try {
      const caminhoCompleto = join(__dirname, arquivo);
      await stat(caminhoCompleto);
      await unlink(caminhoCompleto);
      console.log(`✅ Removido: ${arquivo}`);
  } catch {
      console.log(`⚠️  Arquivo não encontrado: ${arquivo}`);
    }
  }
}

async function organizarTestesGrupos() {
  console.log('📂 Organizando testes de grupos...');

  // Verificar se os testes existem
  const testesParaVerificar = [
    './unit/grupos-refatorado.test.ts',
    './integration/grupos-corrigido.test.ts',
  ];

  for (const teste of testesParaVerificar) {
    try {
      const caminhoCompleto = join(__dirname, teste);
      await stat(caminhoCompleto);
      console.log(`✅ Teste encontrado: ${teste}`);
  } catch {
      console.log(`❌ Teste não encontrado: ${teste}`);
    }
  }
}

async function removerEndpointDebug() {
  console.log('🚫 Lembre-se de remover o endpoint de debug:');
  console.log('   - Arquivo: ../src/routes.ts');
  console.log('   - Linha: app.use("/debug", debugRoutes);');
  console.log('   - E qualquer importação relacionada ao debug');
}

async function main() {
  console.log('🏗️  Iniciando organização dos testes de grupos...\n');

  await limparArquivosTemporarios();
  console.log();

  await organizarTestesGrupos();
  console.log();

  await removerEndpointDebug();
  console.log();

  console.log('📋 Próximos passos:');
  console.log('1. ✅ Remover scripts temporários de debug');
  console.log('2. ✅ Organizar testes em pastas apropriadas');
  console.log('3. 🔄 Executar testes automatizados com Jest');
  console.log('4. 🧪 Validar cobertura de testes');
  console.log('5. 📚 Atualizar documentação');
  console.log();

  console.log('🚀 Para executar os testes:');
  console.log('   npm test                    # Todos os testes');
  console.log('   npm test grupos             # Apenas testes de grupos');
  console.log('   npm run test:coverage       # Com cobertura');
  console.log();

  console.log('✅ Organização concluída! Os testes estão prontos para uso.');
}

if (require.main === module) {
  main().catch(console.error);
}

export { limparArquivosTemporarios, organizarTestesGrupos };
