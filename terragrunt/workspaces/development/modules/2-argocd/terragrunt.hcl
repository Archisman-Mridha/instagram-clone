include "root" {
  path= find_in_parent_folders("root.terragrunt.hcl")
}

include "development_root" {
  path= find_in_parent_folders("development.terragrunt.hcl")
}

generate "helm_provider" {

  path= "helm.provider.tf"
  if_exists = "overwrite_terragrunt"

  contents= <<EOF
    provider "helm" {
      kubernetes {
        config_path = "~/.kube/config"

        config_context = "k3d-instagram-clone-dev"
        username = "admin@k3d-instagram-clone-dev"
      }
    }
  EOF
}

terraform {
  source = "${get_parent_terragrunt_dir("root")}/modules/argocd"
}

inputs= {
  workspace= "development"
}

dependency "local_k3d_cluster" {
  config_path= "../1-local-k3d-cluster/"
  skip_outputs= true
}