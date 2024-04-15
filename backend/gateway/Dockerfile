# syntax=docker/dockerfile:1

## --- STAGE 1 - Building the application --- ##

FROM golang:1.21 AS build
WORKDIR /src

COPY ./backend/gateway/go.mod go.mod
COPY ./backend/gateway/go.sum go.sum

# Download dependencies as a separate step to take advantage of Docker's caching. Leverage a cache
# mount to /go/pkg/mod/ to speed up subsequent builds.
RUN --mount=type=cache,target=/go/pkg/mod/ \
    go mod download

# Build the application.
RUN --mount=type=cache,target=/go/pkg/mod/ \
    --mount=type=bind,source=./backend/gateway,target=. \
    CGO_ENABLED=0 go build -o /bin/server .

## --- STAGE 2 - Running the application --- ##

FROM scratch AS final

# Copy the executable from the "build" stage.
COPY --from=build /bin/server /bin/

# What the container should run when it is started.
ENTRYPOINT [ "/bin/server" ]