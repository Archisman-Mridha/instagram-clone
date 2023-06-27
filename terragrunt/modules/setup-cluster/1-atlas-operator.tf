resource "helm_release" "atlas_operator" {
  name = "atlas-operator"

  namespace = "default"
  create_namespace = true

  repository = "oci://ghcr.io/ariga/charts"
  chart = "atlas-operator"

  wait = true
}