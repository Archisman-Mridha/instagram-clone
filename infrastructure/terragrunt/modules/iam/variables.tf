variable "environment" {
  description = "Environment name"
  type        = string
}

variable "oidc_issuer_host" {
  description = "Host of the OIDC issuer, issuing tokens to Kubernetes ServiceAccounts"
  type        = string
}

variable "openobserve_stream_store_arn" {
  description = "ARN of the OpenObserve stream store"
  type        = string
}
