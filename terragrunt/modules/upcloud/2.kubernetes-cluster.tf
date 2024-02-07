resource "upcloud_kubernetes_cluster" "main" {
  name = local.project
  zone = local.zone

  plan = "development"

  version = "1.27"

  network = upcloud_network.main.id
  private_node_groups = true
  // IP addresses or IP ranges in CIDR format which are allowed to access the cluster control plane.
  control_plane_ip_filter = [ "0.0.0.0/0" ]
}

resource "upcloud_kubernetes_node_group" "default" {
  name = "default"
  cluster = upcloud_kubernetes_cluster.main.id

  // Billed at €104.00 monthly.
  plan = "4xCPU-8GB"
  node_count = 3
}