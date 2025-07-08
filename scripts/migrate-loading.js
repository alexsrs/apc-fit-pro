#!/usr/bin/env node

/**
 * Script de migração para substituir componentes de loading antigos
 * pelos novos componentes padronizados
 * 
 * Uso: node scripts/migrate-loading.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Padrões de código para substituir
const migrations = [
  {
    name: 'Spinner inline customizado',
    pattern: /<div className="animate-spin rounded-full h-(\d+) w-(\d+) border-b-2 border-([^"]+)"\s*\/>/g,
    replacement: (match, height, width, color) => {
      const sizeMap = {
        '4': 'sm',
        '6': 'sm', 
        '8': 'md',
        '12': 'lg',
        '16': 'xl'
      };
      const size = sizeMap[height] || 'md';
      const colorName = color.includes('blue') ? 'blue' : 
                       color.includes('green') ? 'green' :
                       color.includes('red') ? 'red' : 'blue';
      
      return `<LoadingInline size="${size}" color="${colorName}" />`;
    }
  },
  {
    name: 'Loading com div wrapper',
    pattern: /<div className="flex items-center justify-center py-8">\s*<div className="animate-spin[^>]+><\/div>\s*<\/div>/g,
    replacement: '<Loading />'
  },
  {
    name: 'Estado de loading em texto',
    pattern: /{loading \? "([^"]+)" : "([^"]+)"}/g,
    replacement: (match, loadingText, normalText) => {
      return `{loading ? <LoadingButton text="${loadingText}" size="sm" /> : "${normalText}"}`;
    }
  }
];

// Função para encontrar arquivos TypeScript/JSX
function findFiles() {
  const patterns = [
    'src/**/*.tsx',
    'src/**/*.ts',
    'app/**/*.tsx',
    'app/**/*.ts',
    'components/**/*.tsx'
  ];
  
  let files = [];
  patterns.forEach(pattern => {
    files = files.concat(glob.sync(pattern));
  });
  
  return [...new Set(files)]; // Remove duplicatas
}

// Função para analisar um arquivo
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Verificar se já importa os novos componentes
  const hasNewImports = content.includes('from "@/components/ui/Loading"');
  
  // Procurar padrões antigos
  migrations.forEach(migration => {
    const matches = content.matchAll(migration.pattern);
    for (const match of matches) {
      issues.push({
        type: migration.name,
        line: content.substring(0, match.index).split('\n').length,
        match: match[0],
        suggestion: typeof migration.replacement === 'function' 
          ? migration.replacement(...match) 
          : migration.replacement
      });
    }
  });
  
  // Procurar estados de loading
  const loadingStates = content.match(/const \[[^,]+loading[^,]*,\s*set[^,]+loading[^\]]*\]/g);
  if (loadingStates) {
    loadingStates.forEach(state => {
      issues.push({
        type: 'Estado de loading encontrado',
        match: state,
        suggestion: 'Considere usar o novo componente Loading'
      });
    });
  }
  
  return {
    filePath,
    hasNewImports,
    issues
  };
}

// Função para gerar relatório
function generateReport(results) {
  console.log('\n🔄 RELATÓRIO DE MIGRAÇÃO DE LOADING\n');
  console.log('=====================================\n');
  
  let totalIssues = 0;
  let filesWithIssues = 0;
  
  results.forEach(result => {
    if (result.issues.length > 0) {
      filesWithIssues++;
      totalIssues += result.issues.length;
      
      console.log(`📁 ${result.filePath}`);
      console.log(`   Importa novos componentes: ${result.hasNewImports ? '✅' : '❌'}`);
      console.log(`   Issues encontrados: ${result.issues.length}\n`);
      
      result.issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue.type}`);
        if (issue.line) console.log(`      Linha: ${issue.line}`);
        console.log(`      Código atual: ${issue.match}`);
        console.log(`      Sugestão: ${issue.suggestion}\n`);
      });
      
      console.log('   ---\n');
    }
  });
  
  console.log('\n📊 RESUMO:');
  console.log(`   Arquivos analisados: ${results.length}`);
  console.log(`   Arquivos com issues: ${filesWithIssues}`);
  console.log(`   Total de issues: ${totalIssues}`);
  
  if (totalIssues > 0) {
    console.log('\n💡 PRÓXIMOS PASSOS:');
    console.log('   1. Adicione o import: import Loading, { LoadingInline, LoadingButton, LoadingSkeleton } from "@/components/ui/Loading";');
    console.log('   2. Substitua os padrões identificados pelas sugestões');
    console.log('   3. Teste os componentes para garantir que funcionam corretamente');
    console.log('   4. Consulte o guia: docs/loading-components-guide.md');
  } else {
    console.log('\n🎉 Nenhum issue encontrado! Sua aplicação já está usando os novos componentes.');
  }
}

// Função principal
function main() {
  console.log('🔍 Procurando arquivos...');
  const files = findFiles();
  console.log(`📄 Encontrados ${files.length} arquivos para analisar\n`);
  
  const results = files.map(analyzeFile);
  generateReport(results);
}

// Executar script
if (require.main === module) {
  main();
}

module.exports = { analyzeFile, generateReport };
