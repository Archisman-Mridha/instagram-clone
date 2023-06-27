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
  source = "${get_parent_terragrunt_dir("root")}/modules/setup-cluster/sealed-secrets"
}

inputs= {
  kubeconfig= {
		path= "~/.kube/config"

		context= "k3d-instagram-clone-dev"
		username= "admin@k3d-instagram-clone-dev"
	}
}