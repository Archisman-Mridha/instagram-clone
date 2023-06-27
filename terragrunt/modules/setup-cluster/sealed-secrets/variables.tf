variable "kubeconfig" {
  type = object({

    path= string

    context= string
    username= string
  })
}