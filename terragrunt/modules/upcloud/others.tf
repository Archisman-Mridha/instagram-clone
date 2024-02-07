variable "args" {
  type = object({

    upcloud = object({
      username = string
      password = string
    })
  })
}

locals {
  project = "instagram-clone"
  zone    = "de-fra1"

  kubeconfig_path    = "${path.module}/outputs/kubeconfig.yaml"
  kubeconfig_context = "instagram-clone-admin@instagram-clone"
}
