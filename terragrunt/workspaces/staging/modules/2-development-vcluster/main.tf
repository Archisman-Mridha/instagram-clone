resource "helm_release" "this" {
  name = "dev"

  namespace = "vcluster-dev"
  create_namespace = true

  repository = "https://charts.loft.sh"
  chart = "vcluster"
  version = "0.15.2"

  values = [file("./dev.vcluster.values.yaml")]

  wait = true
}