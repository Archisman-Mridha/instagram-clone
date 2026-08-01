/*
  The generate block is useful for allowing you to set up the remote state backend configuration
  automatically, but this introduces a bootstrapping problem: how do you create and manage the
  underlying storage resources for the remote state? For example, when using the s3 backend,
  OpenTofu/Terraform expects that the S3 bucket already exists for it to upload/download the state
  objects.

  Ideally, you can manage the S3 bucket using OpenTofu/Terraform, but what about the state object
  for the module managing the S3 bucket? How do you create the S3 bucket, before you run
  tofu/terraform, if you need to run tofu/terraform to create the bucket?

  To create state resources automatically, Terragrunt supports a different block for managing the
  backend configuration: the remote_state block.
*/
// remote_state { }

generate "providers" {
  path      = "providers.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
provider "aws" {
  region = "us-east-2"

  default_tags {
    tags = {
      project     = "openmedia"
      environment = var.environment
    }
  }
}
EOF
}

terraform {
  before_hook "tflint" {
    commands = ["apply", "plan"]
    execute  = ["tflint"]
  }
}
