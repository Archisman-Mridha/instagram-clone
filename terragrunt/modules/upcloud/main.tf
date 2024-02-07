terraform {
  required_version = ">= v1.5.7"

  backend "local" {}

  required_providers {
    upcloud = {
      source  = "UpCloudLtd/upcloud"
      version = "4.0.0"
    }
  }
}

provider "upcloud" {
  username = var.args.upcloud.username
  password = var.args.upcloud.password
}

module "prepare_cluster" {
  source = "../prepare-cluster"

  args = {
    kubeconfig = {
      path    = "${path.module}/outputs/kubeconfig.yaml"
      context = "instagram-clone"
    }
  }
}
