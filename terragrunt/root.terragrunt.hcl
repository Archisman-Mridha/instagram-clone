generate "terraform_version" {

  path= "terraform.version.tf"
  if_exists = "overwrite_terragrunt"

  contents= <<EOF
    terraform {
      required_version= ">= 1.5.0"
    }
  EOF
}