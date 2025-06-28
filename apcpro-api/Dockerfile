# 🐳 Dockerfile para APC FIT PRO API
# Imagem otimizada para produção com Node.js 22 Alpine

# Estágio de build
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Gerar cliente Prisma
RUN npm run prisma:generate

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM node:22-alpine AS production

# Instalar dumb-init para melhor handling de sinais
RUN apk add --no-cache dumb-init

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S apcapi -u 1001

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copiar aplicação buildada
COPY --from=builder --chown=apcapi:nodejs /app/dist ./dist
COPY --from=builder --chown=apcapi:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=apcapi:nodejs /app/prisma ./prisma

# Mudar para usuário não-root
USER apcapi

# Expor porta
EXPOSE 8080

# Comando de inicialização
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); const options = { host: 'localhost', port: 8080, path: '/health', timeout: 2000 }; const req = http.request(options, (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); req.on('error', () => process.exit(1)); req.end();"
