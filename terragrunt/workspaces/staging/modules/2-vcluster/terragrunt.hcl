include "root" {
  path= find_in_parent_folders("root.terragrunt.hcl")
}

include "development_root" {
  path= find_in_parent_folders("development.terragrunt.hcl")
}

dependency "local_k3d_cluster" {
  config_path= "../1-local-k3d-cluster/"
  skip_outputs= true
}

terraform {
  source = "${get_parent_terragrunt_dir("root")}/modules/vcluster"
}

inputs= {
  kubeconfig= yamldecode(file(find_in_parent_folders("kubeconfig.yaml")))

  vcluster_name= "dev"
  vcluster_namespace= "vcluster-dev"
}