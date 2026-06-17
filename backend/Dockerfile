# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS deps

WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

RUN pnpm install --frozen-lockfile

FROM deps AS build

COPY backend ./backend

RUN pnpm --filter edupath-backend prisma:generate
RUN pnpm --filter edupath-backend deploy --prod /prod/backend

FROM node:22-alpine AS runtime

WORKDIR /app/backend
ENV NODE_ENV=production
ENV PORT=4000

RUN apk add --no-cache openssl
COPY --from=build /prod/backend ./

EXPOSE 4000

CMD ["node", "src/index.js"]
