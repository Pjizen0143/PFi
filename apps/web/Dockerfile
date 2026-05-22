FROM node:22-alpine AS base

WORKDIR /web

RUN apk add --no-cache libc6-compat python3 make g++

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9 --activate

FROM base AS deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder

COPY --from=deps /web/node_modules ./node_modules
COPY . .

RUN pnpm run build
RUN pnpm prune --prod

FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /web/package.json ./package.json
COPY --from=builder /web/node_modules ./node_modules
COPY --from=builder /web/.next ./.next
COPY --from=builder /web/public ./public

EXPOSE 3000

CMD ["pnpm", "start"]