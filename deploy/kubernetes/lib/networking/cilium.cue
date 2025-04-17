// Cilium is used for transparently securing the network connectivity between application services.
//
// At the foundation of Cilium is a new Linux kernel technology called eBPF, which enables the
// dynamic insertion of powerful security visibility and control logic within Linux itself. Because
// eBPF runs inside the Linux kernel, Cilium security policies can be applied and updated without
// any changes to the application code or container configuration.
//
// NOTE : Linux Kernel version must be >= 6.3.
#Cilium: {
  // REFER : https://docs.cilium.io/en/stable/installation/k8s-install-helm/.
  helmInstallation: kue.#HelmInstallation & {
    repoURL: "https://helm.cilium.io/"
    version: "1.17.3"
    chartPath: "cilium"

    releaseName: "cilium"
    namespace: "cilium"
    createNamessace: true

    values: #CiliumHelmValues & {
      // IP Address Management (IPAM) is responsible for the allocation and management of IP
      // addresses used by network endpoints (container and others) managed by Cilium.
      ipam: {
        // The cluster-scope IPAM mode assigns per-node PodCIDRs to each node and allocates IPs
        // using a host-scope allocator on each node.
        mode: "cluster-pool"

        operator: {
          clusterPoolIPv4PodCIDRList: [podCIDR]
        }
      }

      // Cilium’s kube-proxy replacement depends on the socket-LB feature.
      kubeProxyReplacement: true
      k8sServiceHost: string
      k8sServicePort: string

      loadBalancer: {
        // Cilium’s eBPF kube-proxy replacement supports consistent hashing by implementing a
        // variant of The Maglev hashing in its load balancer for backend selection. This improves
        // resiliency in case of failures.
        //
        // NOTE : Maglev hashing is applied only to external (N-S) traffic. For in-cluster service
        //        connections (E-W), sockets are assigned to service backends directly, e.g. at TCP
        //        connect time, without any intermediate hop and thus are not subject to Maglev.
        algorithm: "maglev"

        // Cilium has built-in support for accelerating NodePort, LoadBalancer services and
        // services with externalIPs for the case where the arriving request needs to be forwarded
        // and the backend is located on a remote node. This feature works at the
        // XDP (eXpress Data Path) layer where eBPF is operating directly in the networking driver
        // instead of a higher layer.
        acceleration: "native"

        // By default, Cilium’s eBPF NodePort implementation operates in SNAT mode. That is, when
        // node-external traffic arrives and the node determines that the backend for the
        // LoadBalancer, NodePort, or services with externalIPs is at a remote node, then the node
        // is redirecting the request to the remote backend on its behalf by performing SNAT. This
        // does not require any additional MTU changes. The cost is that replies from the backend
        // need to make the extra hop back to that node to perform the reverse SNAT translation
        // there before returning the packet directly to the external client.
        //
        // Using the dsr mode, the backends reply directly to the external client without taking
        // the extra hop, meaning, backends reply by using the service IP/port as a source.
        mode: "dsr"
      }

      // In the default routing mode, all cluster nodes form a mesh of tunnels using the UDP-based
      // encapsulation protocols VXLAN / Geneve.
      // Due to adding encapsulation headers, the effective MTU available for payload is lower than
      // with native-routing (50 bytes per network packet for VXLAN). This results in a lower
      // maximum throughput rate for a particular network connection.
      //
      // The native packet forwarding mode leverages the routing capabilities of the network Cilium
      // runs on, instead of performing encapsulation.
      // Cilium will delegate all packets which are not addressed to another local endpoint to the
      // routing subsystem of the Linux kernel. This means that the packet will be routed as if a
      // local process would have emitted the packet.
      // The network connecting the cluster nodes, thus, must be capable of routing PodCIDRs.
      routingMode: "native"
      ipv4NativeRoutingCIDR: podCIDR
      //
      // Each individual node is made aware of all pod IPs of all other nodes and routes are
      // inserted into the Linux Kernel routing table to represent this.
      autoDirectNodeRoutes: true

      bpf: {
        // IPv4 addresses used for pods are typically allocated from RFC1918 private address blocks
        // and thus, not publicly routable. Cilium will automatically masquerade the source IP
        // address of all traffic that is leaving the cluster to the IPv4 address of the node as
        // the node’s IP address is already routable on the network.
        // We'll use the eBPF based implementation.
        masquerade: true

        // Use netkit instead of veth.
        // REFERENCE : https://isovalent.com/blog/post/cilium-netkit-a-new-container-networking-paradigm-for-the-ai-era/#h-roadblock-4-a-legacy-virtual-cable.
        datapathMode: "netkit"
      }

      // With the adoption of 100Gbps network adapters comes the inevitable challenge: how can a
      // CPU deal with eight-million packets per second (assuming a MTU of 1,538 bytes)? That
      // leaves only 120 nanoseconds per packet for the system to handle, which is unrealistic.
      //
      // Within the Linux stack, this problem is addressed by :
      //
      //  GRO (Generic Receive Offload) : On the receiving end, GRO would group packets into a
      //                                  super-sized 64KB packet within the stack and pass it up
      //                                  the networking stack.
      //
      //  TSO (Transmit Segmentation Offload) : Likewise, on the transmitting end, TSO would
      //                                        segment TCP super-sized packets for the NIC to
      //                                        handle.
      //
      // While that super-sized 64K packet helps, modern CPUs can actually handle much larger
      // packets. This is what Big TCP is designed for.
      //
      // REFERENCE : https://isovalent.com/blog/post/big-tcp-on-cilium/.
      enableIPv4BIGTCP: true

      // Enable mTLS.
      // Cilium under the hood will use SPIRE (an implementation of SPIFFE) for identity
      // management.
      authentication: mutual: spire: {
        enabled: true
        install: enabled: true
      }

      // Enable Gateway API support.
      gatewayAPI: enabled: true

			// Enable exposing metrics (for Cilium Operators and Agents).
			prometheus: enabled: true
			operator: prometheus: enabled: true

      // Hubble is a fully distributed networking and security observability platform, built on top
      // of Cilium and eBPF.
      hubble: {
        // By default, Hubble API operates within the scope of the individual node on which the
        // Cilium agent runs. This confines the network insights to the traffic observed by the
        // local Cilium agent.
        // Upon deploying Hubble Relay, network visibility is provided for the entire cluster or
        // even multiple clusters in a ClusterMesh scenario.
        // In this mode, Hubble data can be accessed via Hubble UI.
        relay: {
          enabled: true
        }

        // Hubble UI is a web interface which enables automatic discovery of the services
        // dependency graph at the L3/L4 and even L7 layer, allowing user-friendly visualization
        // and filtering of data flows as a service map.
        ui: {
          enabled: true
        }

        // Hubble Exporter is a feature of cilium-agent that lets you write Hubble flows to a file
        // for later consumption as logs. It supports file rotation, size limits, filters, and
        // field masks.
				export: {
					// Standard hubble exporter configuration accepts only one set of filters and requires
					// cilium pod restart to change config.
					// Dynamic flow logs allow configuring multiple filters at the same time and saving
					// output in separate files. Additionally it does not require cilium pod restarts to
					// apply changed configuration.
					dynamic: {
						enabled: true
						config: {
							enabled: true
							content: [
								{
									name: "dropped-packet-flows"
									filePath: "/var/run/cilium/hubble/dropped-packet-flows.log"

									// You can view all available fields for a Hubble flow here :
									// https://docs.cilium.io/en/stable/_api/v1/flow/README/#flowfilter.
									includeFilters: [
										{
											event_type: [
												{ type: 1 } // Packet dropped.
											]
										}
									]
									fieldMasks: [
										"source.namespace",
										"source.pod_name",
										"destination.namespace",
										"destination.pod_name",
										"drop_reason_desc"
									]
								}
							]
						}
					}
				}

				// Enable exposing metrics.
				metrics: enabled: true
      }
    }
  }
}

// WARNING : Make sure this doesn't overlap with your VPC CIDR.
podCIDR: "10.0.0.0/8"
