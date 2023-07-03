terraform {
  required_providers {

    helm = {
      source = "hashicorp/helm"
      version = "2.10.1"
    }

    kubectl = {
      source = "gavinbunney/kubectl"
      version = "1.14.0"
    }

  }
}

provider "helm" {
  kubernetes {
    config_path = var.kubeconfig.path

    config_context = var.kubeconfig.context
    username = var.kubeconfig.username
  }
}

provider "kubectl" {
  config_path = var.kubeconfig.path

  config_context = var.kubeconfig.context
  username = var.kubeconfig.username
}