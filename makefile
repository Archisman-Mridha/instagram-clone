protoc-generate:
	rm -rf ./backend/proto/generated && \
		mkdir ./backend/proto/generated
	protoc \
		--experimental_allow_proto3_optional \
		--go_out=./backend/proto/generated/ --go_opt=paths=source_relative \
    --go-grpc_out=./backend/proto/generated/ --go-grpc_opt=paths=source_relative \
		--proto_path=./backend/proto \
    ./backend/proto/*.proto
	cd ./backend/proto/generated && \
		go mod init github.com/Archisman-Mridha/instagram-clone/backend/proto/generated && \
		go mod tidy
	go work use ./backend/proto/generated && go work sync