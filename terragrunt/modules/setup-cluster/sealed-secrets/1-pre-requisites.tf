// Create a Kubernetes secret named 'sealed-secrets-tls-key' in the kube-system namespace.
// It contains the TLS certificate and key, which Bitnami sealed secrets controller will use
// to encrypt and decrypt Kubernetes secrets.

data "kubectl_file_documents" "sealed_secrets_tls_key_secret" {
  content = templatefile("${path.module}/tls-key.secret.yaml",
    {
      TLS_CRT: filebase64("${path.module}/tls.crt"),
      TLS_KEY: filebase64("${path.module}/tls.key")
    }
  )
}

resource "kubectl_manifest" "sealed_secrets_tls_key_secret" {

  for_each = data.kubectl_file_documents.sealed_secrets_tls_key_secret.manifests
  yaml_body = each.value

  wait = true
}