FROM golang:1.20-alpine AS builder
WORKDIR /app

RUN go work init
COPY go.work.sum .

COPY ./backend/shared/go.mod ./backend/shared/go.sum \
  ./backend/shared/
RUN go work use ./backend/shared && \
  cd ./backend/shared/ && go mod download

COPY ./backend/proto/generated/go.mod ./backend/proto/generated/go.sum \
  ./backend/proto/generated/
RUN go work use ./backend/proto/generated && \
  cd ./backend/proto/generated/ && go mod download

COPY ./backend/services/authentication/go.mod ./backend/services/authentication/go.sum \
  ./backend/services/authentication/
RUN go work use ./backend/services/authentication && \
  cd ./backend/services/authentication && go mod download

COPY ./backend/shared ./backend/shared
COPY ./backend/proto/generated ./backend/proto/generated
COPY ./backend/services/authentication ./backend/services/authentication

RUN go build -o authentication-service ./backend/services/authentication/main.go

#*--

FROM scratch as packager
WORKDIR /

COPY --from=builder /app/authentication-service .

ENTRYPOINT [ "./authentication-service" ]