resource "helm_release" "strimzi" {
  repository = "oci://quay.io/strimzi-helm"
  chart      = "strimzi-kafka-operator"
  version    = "0.39.0"

  name = "strimzi"

  namespace        = "strimzi"
  create_namespace = true

  wait = true
}
