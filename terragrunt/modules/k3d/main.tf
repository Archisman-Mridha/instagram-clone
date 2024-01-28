provider "kubernetes" {
  config_path    = local.kubeconfig_path
  config_context = local.kubeconfig_context
}

provider "helm" {
  kubernetes {
    config_path    = local.kubeconfig_path
    config_context = local.kubeconfig_context
  }
}

resource "null_resource" "create_k3d_cluster" {
  provisioner "local-exec" {
    when    = create
    command = "k3d cluster create instagram-clone"
  }

  provisioner "local-exec" {
    when    = destroy
    command = "k3d cluster delete instagram-clone"
  }
}

module "prepare_cluster" {
  source = "../prepare-cluster"

  args = {
    workspace = "dev"

    kubeconfig = {
      path    = local.kubeconfig_path
      context = local.kubeconfig_context
    }
  }

  depends_on = [null_resource.create_k3d_cluster]
}
