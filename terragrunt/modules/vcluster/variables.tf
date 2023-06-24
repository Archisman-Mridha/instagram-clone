variable "vcluster_name" {
  type = string
}

variable "vcluster_namespace" {
  type = string
}

variable "kubeconfig" {
  type = object({

    path = string

    context= string
    username= string
  })
}