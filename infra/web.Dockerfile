FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* ./
COPY apps/web/package.json ./apps/web/
RUN npm install --workspace apps/web --omit=dev

FROM base AS builder
COPY . .
RUN npm install --workspaces
RUN npm run build --workspace apps/web

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/package.json .
COPY --from=builder /app/apps/web/node_modules ./node_modules
CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]
