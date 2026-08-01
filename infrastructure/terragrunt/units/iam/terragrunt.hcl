include "root" {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "${find_in_parent_folders("modules")}//iam"
}

dependency "irsa_discovery_store" {
  config_path = "../irsa-discovery-store"

  mock_outputs_allowed_terraform_commands = ["plan", "validate"]
  mock_outputs = {
    regional_domain_name = "irsa-discovery-store-staging-openmedia.s3.us-east-2.amazonaws.com"
  }
}

dependency "openobserve_stream_store" {
  config_path = "../openobserve-stream-store"

  mock_outputs_allowed_terraform_commands = ["plan", "validate"]
  mock_outputs = {
    arn = "arn:aws:s3:::openobserve-stream-store-staging-openmedia"
  }
}

inputs = {
  environment = values.environment

  oidc_issuer_host             = dependency.irsa_discovery_store.outputs.regional_domain_name
  openobserve_stream_store_arn = dependency.openobserve_stream_store.outputs.arn
}
