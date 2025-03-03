.PHONY: buf-generate
buf-generate:
	cd ./backend/ && \
		buf generate

.PHONY: sqlc-generate
sqlc-generate:
	cd ./backend/microservices && \
		sqlc generate

.PHONY: compose-up
compose-up:
	cd ./deploy/compose && \
    cue export ./src/ --out yaml > ./out/compose.yaml && \
    docker-compose -f ./out/compose.yaml up -d

.PHONY: compose-down
compose-down:
	cd ./deploy/compose && \
    docker-compose -f ./out/compose.yaml down
