resource "helm_release" "atlas" {
  repository = "oci://ghcr.io/ariga/charts"
  chart      = "atlas-operator"
  version    = "0.4.0"

  name = "atlas"

  namespace        = "cloudnative-pg"
  create_namespace = true

  wait = true
}
