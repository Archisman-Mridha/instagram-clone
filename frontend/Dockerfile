# syntax=docker/dockerfile:1

# --- STAGE 1 - Building the application --- #

FROM node:20-alpine AS build
WORKDIR /src

# Install pnpm
RUN npm install -g pnpm

COPY ./frontend/package.json ./package.json
COPY ./frontend/pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./frontend/.npmrc ./npmrc

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN CI=true pnpm install --frozen-lockfile

COPY ./frontend .

# Build the application.
RUN pnpm build && \
	cp -r ./.next/static ./.next/standalone/.next && \
	mv ./.next/standalone /build

# --- STAGE 2 - Running the application --- #

FROM node:20-alpine AS final

# Copy the .next/standalone folder from the "build" stage.
COPY --from=build /build /app

# What the container should run when it is started.
ENTRYPOINT [ "node", "/app/server.js" ]