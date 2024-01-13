terraform {
  required_version = ">= 1.5.3"

  backend "local" { }

  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "2.31.0"
    }

    kubernetes = {
      source = "hashicorp/kubernetes"
      version = "2.23.0"
    }

		helm = {
      source = "hashicorp/helm"
      version = "2.12.1"
    }
  }
}

provider "digitalocean" {
  token = var.args.digitalocean.token
}

provider "kubernetes" {
  config_path = local.kubeconfig_path
  config_context = "do-fra1-main"
}

provider "helm" {
  kubernetes {
    config_path = local.kubeconfig_path
    config_context = "do-fra1-main"
  }
}

// A Virtual Private Cloud (VPC) is a private network interface for collections of DigitalOcean
// resources. VPC networks provide a more secure connection between resources because the network is
// inaccessible from the public internet and other VPC networks. Traffic within a VPC network doesn’t
// count against bandwidth usage.
resource "digitalocean_vpc" "default" {
  name = "Main"
  region = var.args.digitalocean.region

  ip_range = "10.0.0.0/24"
}