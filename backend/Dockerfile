# ── Stage 1: Install deps ────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --silent

# ── Stage 2: Production image ────────────────────────────────────
FROM node:20-alpine AS production

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY package.json .

USER appuser

EXPOSE 5000
CMD ["node", "src/server.js"]
