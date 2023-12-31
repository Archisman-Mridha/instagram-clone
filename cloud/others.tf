variable "args" {
  type = object({
    digitalocean = object({
      token = string
      region = string
    })
  })
}

locals {
  kubeconfig_path = "./outputs/kubeconfig.yaml"
}

resource "local_file" "kubeconfig" {
  filename = "./outputs/kubeconfig.yaml"

  // Only owner can perform read, write and execute operations on the file.
  file_permission = "700"

  content = digitalocean_kubernetes_cluster.default.kube_config.0.raw_config
}