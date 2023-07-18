protoc-gen:
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

act:
	act --secret-file act.secrets.env

get-argocd-ui-password:
	kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Generates a TLS certificate (along with the required key),
# which is used by Bitnami sealed secrets to encrypt and decrypt Kubernete secrets.
gen-sealed-secrets-cert:
	openssl req \
		-x509 -days 365 -nodes -newkey \
		rsa:4096 \
		-keyout sealed-secrets.tls.key -out sealed-secrets.tls.crt \
		-subj "/CN=sealed-secret/O=sealed-secret"

gen-sealed-secrets:
	chmod +x ./scripts/generate-sealed-secrets.sh && \
		./scripts/generate-sealed-secrets.sh

sqlc-gen:
	sqlc generate