cornucopia-generate:
	cornucopia \
		-q ./backend/sql/queries \
		-d ./backend/sql/mod.rs \
		schema ./backend/sql/schema.sql

graphql-generate:
	cd backend/gateway && \
		go run github.com/99designs/gqlgen generate && \
		go mod tidy

buf-generate:
	buf generate && \
		cd backend/gateway/generated/grpc && \
		mv grpc_generated/* . && \
		rm -rf grpc_generated && \
		go mod tidy