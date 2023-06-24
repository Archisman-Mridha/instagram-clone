resource "helm_release" "vcluster" {
  name = var.vcluster_name

  namespace = var.vcluster_namespace
  create_namespace = true

  repository = "https://charts.loft.sh"
  chart = "vcluster"
  version = "0.15.2"

  values = [ file("${path.module}/vcluster.values.yaml") ]

  wait = true
}