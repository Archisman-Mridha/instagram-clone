include "root" {
  path= find_in_parent_folders("root.terragrunt.hcl")
}

include "development_root" {
  path= find_in_parent_folders("development.terragrunt.hcl")
}

dependency "staging_cluster" {
  config_path= "../1-staging-cluster/"
  skip_outputs= true
}

terraform {
  source = "./"
}