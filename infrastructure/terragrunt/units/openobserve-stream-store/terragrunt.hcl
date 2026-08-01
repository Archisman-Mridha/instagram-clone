include "root" {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "${find_in_parent_folders("modules")}//openobserve-stream-store"
}

inputs = {
  environment = values.environment
}
