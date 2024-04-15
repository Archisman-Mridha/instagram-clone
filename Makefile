cornucopia-generate:
	cornucopia \
		-q ./backend/sql/queries \
		-d ./backend/sql/mod.rs \
		schema ./backend/sql/schema.sql

graphql-generate:
	cd backend/gateway && \
		go run github.com/99designs/gqlgen generate && \
		go mod tidy
# ./scripts/metrics-instrument-graphql-resolvers.sh

# Generate GoLang types from protobuf definitions using 'buf'.
buf-generate:
	buf generate && \
		cd backend/gateway/generated/grpc && \
		mv grpc_generated/* . && \
		rm -rf grpc_generated && \
		go mod tidy

# Generate code for the Kubernetes operator at ./kubernetes/operators
operator-codegen:
	chmod +x ./scripts/operator-codegen.sh && \
		./scripts/operator-codegen.sh

# Generate Bitnami Sealed Secrets from Kubernetes Secret definition files (which have the name
# secret.yaml / *.secret.yaml).
gen-sealed-secrets:
	chmod +x ./scripts/generate-sealed-secrets.sh && \
		./scripts/generate-sealed-secrets.sh

# Generate a token using which we can signin into the Kiali dashboard.
get-kiali-token:
	kubectl -n istio-system create token kiali-service-account

get-argocd-admin-password:
	kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

show-argocd-ui:
	kubectl port-forward svc/argocd-server -n argocd 8080:443