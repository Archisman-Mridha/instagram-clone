generate "terraform_backend" {

  path= "terraform.backend.tf"
  if_exists = "overwrite_terragrunt"

  contents= <<EOF
    terraform {
      backend "local" { }
    }
  EOF
}