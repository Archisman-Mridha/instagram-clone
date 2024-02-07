include "root" {
  path = find_in_parent_folders("root.terragrunt.hcl")
}

terraform {
	source = "${get_parent_terragrunt_dir( )}/modules//upcloud"
}