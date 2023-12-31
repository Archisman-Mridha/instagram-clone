resource "digitalocean_kubernetes_cluster" "default" {
  name = "main"
  region = var.args.digitalocean.region

  vpc_uuid = digitalocean_vpc.default.id

  version = "1.28.2-do.0"
  auto_upgrade = false
  maintenance_policy {
    day = "thursday"
    start_time = "00:00"
  }

  ha = false

  node_pool {
    name = "main"

    auto_scale = true
    min_nodes = 2
    max_nodes = 3

    // DigitalOcean Droplets are Linux-based virtual machines (VMs) that run on top of virtualized
    // hardware.
    // Size of each DigitalOcean Droplet in the node-pool.
    size = "s-4vcpu-8gb-amd" // 8 GB RAM
                             // 4 AMD CPUs
                             // 160GB NVMe SSD as the boot disk.

    labels = {
      "env" = "production"
    }
  }

  destroy_all_associated_resources = true
}