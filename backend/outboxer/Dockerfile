FROM golang:1.20-alpine AS builder
WORKDIR /app

RUN go work init
COPY go.work.sum .

COPY ./backend/shared/go.mod ./backend/shared/go.sum \
  ./backend/shared/
RUN go work use ./backend/shared && \
  cd ./backend/shared/ && go mod download

COPY ./backend/outboxer/go.mod ./backend/outboxer/go.sum \
  ./backend/outboxer/
RUN go work use ./backend/outboxer && \
  cd ./backend/outboxer && go mod download

COPY ./backend/shared ./backend/shared
COPY ./backend/outboxer ./backend/outboxer

RUN go build -o outboxer ./backend/outboxer/main.go

#*--

FROM scratch AS packager
WORKDIR /

COPY --from=builder /app/outboxer .

ENTRYPOINT [ "/outboxer" ]