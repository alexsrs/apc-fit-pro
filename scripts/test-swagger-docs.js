#!/usr/bin/env node

/**
 * Script para testar a documentação Swagger atualizada
 * Execute: node scripts/test-swagger-docs.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testando documentação Swagger v2.0...\n');

// Verificar se os arquivos existem
const files = [
  'apcpro-api/src/swagger.ts',
  'apcpro-api/src/swagger-docs.ts',
  'docs/swagger-update-v2.md'
];

console.log('📁 Verificando arquivos:');
files.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - ARQUIVO NÃO ENCONTRADO`);
  }
});

// Verificar se o swagger.ts tem as atualizações
console.log('\n🔍 Verificando atualizações no swagger.ts:');
const swaggerPath = path.join(__dirname, '..', 'apcpro-api/src/swagger.ts');
if (fs.existsSync(swaggerPath)) {
  const swaggerContent = fs.readFileSync(swaggerPath, 'utf8');
  
  const checks = [
    { name: 'Versão 2.0.0', pattern: '"version": "2.0.0"' },
    { name: 'Schema DobrasCutaneas', pattern: 'DobrasCutaneas:' },
    { name: 'Schema Grupo', pattern: 'Grupo:' },
    { name: 'Schema DashboardMetrics', pattern: 'DashboardMetrics:' },
    { name: 'Arquivo swagger-docs.ts', pattern: './src/swagger-docs.ts' },
    { name: 'CSS atualizado', pattern: 'linear-gradient' },
    { name: 'Banner contextual', pattern: 'DESENVOLVIMENTO LOCAL' }
  ];
  
  checks.forEach(check => {
    if (swaggerContent.includes(check.pattern)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name} - NÃO ENCONTRADO`);
    }
  });
} else {
  console.log('❌ Arquivo swagger.ts não encontrado');
}

// Verificar schemas no swagger-docs.ts
console.log('\n📚 Verificando documentação dos endpoints:');
const docsPath = path.join(__dirname, '..', 'apcpro-api/src/swagger-docs.ts');
if (fs.existsSync(docsPath)) {
  const docsContent = fs.readFileSync(docsPath, 'utf8');
  
  const endpoints = [
    '/health',
    '/api/auth/sessions',
    '/api/users',
    '/api/dobras-cutaneas/protocolos',
    '/api/dobras-cutaneas/calcular',
    '/api/metrics'
  ];
  
  endpoints.forEach(endpoint => {
    if (docsContent.includes(endpoint)) {
      console.log(`✅ ${endpoint}`);
    } else {
      console.log(`❌ ${endpoint} - NÃO DOCUMENTADO`);
    }
  });
} else {
  console.log('❌ Arquivo swagger-docs.ts não encontrado');
}

console.log('\n🎯 Resultado do teste:');
console.log('Para testar a documentação completa:');
console.log('1. Execute o servidor: cd apcpro-api && npm run dev');
console.log('2. Acesse: http://localhost:3333/api/docs');
console.log('3. Verifique se todos os endpoints estão documentados');
console.log('4. Teste alguns endpoints com dados válidos');

console.log('\n📊 Funcionalidades documentadas:');
console.log('• Sistema completo de dobras cutâneas');
console.log('• Gestão de usuários e grupos');
console.log('• Métricas de dashboard');
console.log('• Autenticação JWT');
console.log('• Avaliações físicas e evolução');

console.log('\n✨ Swagger v2.0 - Documentação de nível enterprise!');
