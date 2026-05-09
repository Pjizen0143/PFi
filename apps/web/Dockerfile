FROM node:22-alpine AS deps

WORKDIR /web

COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder

WORKDIR /web

COPY --from=deps /web/node_modules ./node_modules
COPY . .

RUN npm run build
RUN npm prune --omit=dev

FROM node:22-alpine AS runner

WORKDIR /web

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /web/package.json ./package.json
COPY --from=builder /web/node_modules ./node_modules
COPY --from=builder /web/.next ./.next
COPY --from=builder /web/public ./public

EXPOSE 3000

CMD ["npm", "run", "start", "--", "-p", "3000"]
