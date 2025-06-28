#!/bin/bash

# Script para corrigir problema do Rollup no Azure App Service
# Usado para contornar bug: https://github.com/npm/cli/issues/4828

echo "🔧 Iniciando build Azure com correção Rollup..."

# Limpar dependências problemáticas
echo "🧹 Removendo node_modules e package-lock.json..."
rm -rf node_modules package-lock.json

# Instalar dependências principais (sem opcionais)
echo "📦 Instalando dependências principais..."
npm install --no-optional --production=false

# Instalar dependências opcionais separadamente
echo "🔧 Instalando dependências opcionais do Rollup..."
npm install --optional

# Gerar Prisma
echo "🎯 Gerando cliente Prisma..."
npm run prisma:generate

# Build final
echo "🚀 Executando build..."
npm run build

echo "✅ Build Azure concluído com sucesso!"
