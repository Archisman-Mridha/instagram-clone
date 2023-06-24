include "root" {
  path= find_in_parent_folders("root.terragrunt.hcl")
}

include "development_root" {
  path= find_in_parent_folders("development.terragrunt.hcl")
}

terraform {
  source = "${get_parent_terragrunt_dir("root")}/modules/local-k3d-cluster"
}