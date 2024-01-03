# syntax=docker/dockerfile:1

ARG APP_NAME=users-microservice
ARG APP_NAME

ARG PORT=4000
ARG PORT

### --- STAGE 1 - Building the application --- ###

FROM rust:1.70.0-slim-bullseye AS build
WORKDIR /app

RUN apt update -y && \
    apt install -y protobuf-compiler pkg-config libssl-dev

## Build the application.
## Leverage a cache mount to /usr/local/cargo/registry/ for downloaded dependencies and a cache mount
## to /app/target/ for compiled dependencies which will speed up subsequent builds. Once built, copy
## the executable to an output directory before the cache mounted at /app/target is unmounted.
RUN --mount=type=bind,source=backend/microservices/users,target=backend/microservices/users \
	--mount=type=bind,source=backend/lib.rs,target=backend/lib.rs \
	--mount=type=bind,source=backend/sql/mod.rs,target=backend/sql/mod.rs \
    --mount=type=bind,source=build.rs,target=build.rs \
    --mount=type=bind,source=Cargo.toml,target=Cargo.toml \
    --mount=type=bind,source=Cargo.lock,target=Cargo.lock \
    --mount=type=bind,source=backend/protos,target=backend/protos \
    --mount=type=cache,target=/app/target/ \
    --mount=type=cache,target=/usr/local/cargo/registry/ \
    <<EOF
set -e
cargo build --bin users-microservice --locked --release
cp ./target/release/users-microservice /bin/server
EOF

CMD ["/bin/server"]

### --- STAGE 2 - Running the application --- ###

FROM debian AS final

## Create non-privileged user.
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    default
USER default

## Copy the executable from the "build" stage.
COPY --from=build /bin/server /bin/

## Expose the port that the application listens on.
EXPOSE ${PORT}

## What the container should run when it is started.
CMD ["/bin/server"]