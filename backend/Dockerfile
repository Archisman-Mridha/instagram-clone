# -- Download dependencies --
FROM oven/bun:1-alpine AS dependencies

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# -- Build --
FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src

RUN bun run build

# -- Package --
FROM oven/bun:1-alpine AS packager

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

USER bun

CMD ["bun", "dist/main"]
