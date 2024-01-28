variable "args" {
  type = object({

    kubeconfig = object({
      path = string
      context = string
    })

    workspace = string
  })
}