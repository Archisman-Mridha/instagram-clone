// Routers can be used to connect multiple Private Networks.
// UpCloud Servers on any attached network can communicate directly with each other.
resource "upcloud_router" "main" {
  name = local.project
}

// Network gateways connect SDN Private Networks to external IP networks.
resource "upcloud_gateway" "main" {
  name = local.project
  zone = local.zone

  features = [ "nat" ]

  router {
    id = upcloud_router.main.id
  }
}

resource "upcloud_network" "main" {
  name = local.project
  zone = local.zone

  router = upcloud_router.main.id

  // A list of IP subnets within the network.
  ip_network {
    address = "10.0.0.0/16"

    // Dynamic Host Configuration Protocol (DHCP) is a network protocol used to dynamically assign IP
    // addresses and other network configuration parameters to devices within a network. It operates
    // on the client-server model, where DHCP servers centrally manage IP address allocation for
    // devices, known as DHCP clients.
    dhcp = true

    family = "IPv4"

    // The NAT gateway is the DHCP default route.
    dhcp_default_route = true
  }
}