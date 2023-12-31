module "prepare_cluster" {
  source = "./modules/prepare-cluster"

  args = {
    workspace = "production"

    kubeconfig = {
      path = "${path.root}/outputs/kubeconfig.yaml"
      context = "do-fra1-main"
    }
  }

  depends_on = [ local_file.kubeconfig ]
}