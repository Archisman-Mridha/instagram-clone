data "upcloud_kubernetes_cluster" "main" {
  id = upcloud_kubernetes_cluster.main.id
}

resource "local_file" "kubeconfig" {
  filename = "${path.module}/outputs/kubeconfig.yaml"
  content = data.upcloud_kubernetes_cluster.main.kubeconfig
}