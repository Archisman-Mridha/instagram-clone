FROM golang:1.20-alpine AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o build

#--

FROM scratch AS packager
WORKDIR /

COPY --from=builder /app/build .

ENTRYPOINT [ "/build" ]