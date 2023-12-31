// Create a Kubernetes Secret containing the TLS certificate for Bitnami Sealed Secrets. Bitnami
// Sealed Secrets will use this TLS certificate to encrypt and decrypt Kubernetes Secrets.
resource "kubernetes_secret" "sealed_secrets_key" {
  type = "kubernetes.io/tls"

  metadata {
    name = "sealed-secrets-key"
    namespace = "kube-system"

    labels = {
      "sealedsecrets.bitnami.com/sealed-secrets-key" = "active"
    }
  }

  data = {
    "tls.crt" = file("${path.module}/sealed-secrets.crt")
    "tls.key" = file("${path.module}/sealed-secrets.key")
  }
}