variable "creator_ssh_public_key" {
  description = "SSH public key of the creator"
  type        = string
}

// This variable isn't used in this module. But, is present as a hack : to make the aws provider
// generator in root terragrunt.hcl work.
variable "environment" {
  description = "Environment name"
  type        = string
  default     = "none"
}
