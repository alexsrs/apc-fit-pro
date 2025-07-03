@echo off
REM Script otimizado para deploy no Azure App Service
echo 🔧 Iniciando build Azure otimizado...

REM Verificar se node_modules existe
if exist node_modules (
    echo 📂 node_modules encontrado, removendo...
    rmdir /s /q node_modules
)

REM Verificar se package-lock.json existe
if exist package-lock.json (
    echo 📂 package-lock.json encontrado, removendo...
    del package-lock.json
)

REM Instalar dependências com timeout maior
echo � Instalando dependências...
npm ci --production=false --timeout=300000

REM Gerar Prisma Client
echo 🎯 Gerando cliente Prisma...
npx prisma generate

REM Build da aplicação
echo 🚀 Executando build...
npm run build

echo ✅ Build Azure concluído com sucesso!
