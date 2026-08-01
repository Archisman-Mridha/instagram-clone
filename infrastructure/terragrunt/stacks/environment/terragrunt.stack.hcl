unit "iam" {
  source = "${find_in_parent_folders("units")}/iam"
  path   = "iam"
  values = {
    environment = values.environment
  }
}

unit "irsa_discovery_store" {
  source = "${find_in_parent_folders("units")}/irsa-discovery-store"
  path   = "irsa-discovery-store"
  values = {
    environment = values.environment
  }
}

unit "openobserve_stream_store" {
  source = "${find_in_parent_folders("units")}/openobserve-stream-store"
  path   = "openobserve-stream-store"
  values = {
    environment = values.environment
  }
}

/*
  unit "backup_store" {
    source = "${find_in_parent_folders("units")}/backup-store"
    path   = "backup-store"
    values = {
      environment = values.environment
    }
  }
*/
