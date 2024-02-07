terraform {
  required_version = ">= v1.5.7"

  backend "local" {}

  required_providers {
    upcloud = {
      source  = "UpCloudLtd/upcloud"
      version = "4.0.0"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.23.0"
    }

    helm = {
      source  = "hashicorp/helm"
      version = "2.11.0"
    }
  }
}

provider "upcloud" {
  username = var.args.upcloud.username
  password = var.args.upcloud.password
}

provider "kubernetes" {
  config_path    = local.kubeconfig_path
  config_context = local.kubeconfig_context
}

provider "helm" {
  kubernetes {
    config_path    = local.kubeconfig_path
    config_context = local.kubeconfig_context
  }
}
