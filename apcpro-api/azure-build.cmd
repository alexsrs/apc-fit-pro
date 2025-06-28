@echo off
REM Script para corrigir problema do Rollup no Azure App Service
REM Usado para contornar bug: https://github.com/npm/cli/issues/4828

echo 🔧 Iniciando build Azure com correção Rollup...

REM Limpar dependências problemáticas
echo 🧹 Removendo node_modules e package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

REM Instalar dependências principais (sem opcionais)
echo 📦 Instalando dependências principais...
npm install --no-optional --production=false

REM Instalar dependências opcionais separadamente
echo 🔧 Instalando dependências opcionais do Rollup...
npm install --optional

REM Gerar Prisma
echo 🎯 Gerando cliente Prisma...
npm run prisma:generate

REM Build final
echo 🚀 Executando build...
npm run build

echo ✅ Build Azure concluído com sucesso!
