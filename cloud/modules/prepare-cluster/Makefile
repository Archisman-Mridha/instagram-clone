## Generates a TLS certificate which is used by Bitnami sealed secrets to encrypt and decrypt
## Kubernete secrets.
## For simplicity, I am keeping the generated TLS certificate and its corresponding private key
## in this repository. But in real-world scenarios, please keep these in a safe place, not
## accessible by everyone.
gen-sealed-secrets-cert:
	openssl req \
		-x509 -days 365 -nodes -newkey \
		rsa:4096 \
		-keyout sealed-secrets.key -out sealed-secrets.crt \
		-subj "/CN=sealed-secret/O=sealed-secret"