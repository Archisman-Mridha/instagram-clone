include "root" {
  path= find_in_parent_folders("root.terragrunt.hcl")
}

include "development_root" {
  path= find_in_parent_folders("development.terragrunt.hcl")
}

dependency "staging_cluster" {
  config_path= "../"
  skip_outputs= true
}

terraform {
  source = "${get_parent_terragrunt_dir("root")}/modules/argocd"
}

inputs= {
  workspace= "staging"

  kubeconfig= {
		path= "~/.kube/config"

		context= "vcluster_staging-vcluster_vcluster-staging-vcluster_k3d-instagram-clone-dev"
		username= "vcluster_staging-vcluster_vcluster-staging-vcluster_k3d-instagram-clone-dev"
	}
}