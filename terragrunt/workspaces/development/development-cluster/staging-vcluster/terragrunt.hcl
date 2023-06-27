include "root" {
  path= find_in_parent_folders("root.terragrunt.hcl")
}

include "development_root" {
  path= find_in_parent_folders("development.terragrunt.hcl")
}

dependency "development_cluster" {
  config_path= "../"
  skip_outputs= true
}

terraform {
  source = "./"
}