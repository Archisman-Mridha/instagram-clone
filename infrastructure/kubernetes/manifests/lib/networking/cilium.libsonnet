local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import './utils.libsonnet';

local app = 'cilium';

function(k8sServiceHost) {
  cilium: Utils.withAppLabel(app, {
    namespace: Kubernetes.core.v1.namespace.new(app),

    installation: Helm.template(app, Utils.chartsDir(app, std.thisFile), {
      version: '1.19.4',

      namespace: app,
      createNamespace: false,

      values: {
        kubeProxyReplacement: true,
        k8sServiceHost: k8sServiceHost,
        k8sServicePort: 6443,

        /*
          The Maglev consistent hashing algorithm for backend selection during load-balancing
          improves resiliency in case of failures.

          Nodes added to the cluster will make consistent backend selection throughout the cluster
          for a given 5-tuple without having to synchronize state with the other Nodes. Similarly,
          upon backend removal the backend lookup tables are reprogrammed with minimal disruption
          for unrelated backends (at most 1% difference in the reassignments) for the given service.

          NOTE :

            (1) Maglev consistent hashing is applied only to external traffic.

            (2) Maglev will have a higher memory consumption on each Cilium-managed Node compared to
            the default of loadBalancer.algorithm=random given random does not need the extra
            lookup tables. However, random won’t have consistent backend selection.
        */
        loadBalancer: { algorithm: 'maglev' },

        /*
          Leverage the routing capabilities of the network Cilium runs on instead of performing
          encapsulation.
          Cilium will delegate all packets which are not addressed to another local endpoint to
          the routing subsystem of the Linux kernel. This means that the packet will be routed as
          if a local process would has emitted the packet. As a result, the network connecting the
          cluster nodes must be capable of routing pod CIDRs.

          Requirements :

            (1) In order to run the native routing mode, the network connecting the hosts on which
              Cilium is running on must be capable of forwarding IP traffic using addresses given
              to pods or other workloads.

            (2) The Linux kernel on the node must be aware on how to forward packets of pods or
              other workloads of all nodes running Cilium. This can be achieved in the following
              way :

              Each individual node is made aware of all pod IPs of all other nodes and routes are
              inserted into the Linux kernel routing table to represent this. Since all the nodes
              will not be in a single L2 network, an additional system component such as a BGP
              daemon must be run to distribute the routes.
        */
        routingMode: 'native',

        // The CIDR in which native routing can be performed. The pod CIDR must be a subset of this.
        ipv4NativeRoutingCIDR: '10.0.0.0/8',

        bpf: {
          /*
            Most Container Network Interface (CNI) plugins, including Cilium up to the 1.15 release,
            would attach a Kubernetes Pod to the node it's hosted on by a virtual ethernet device
            (veth). veth would typically connect a Pod in a network namespace to the node in the
            host network namespace and is how containers can reach other containers or external
            workloads.

              (1) veth relies on Layer 2 communications and on ARP for a container to talk to the
                other end of the veth pair. This is an artificial and unnecessary step: Pods
                shouldn't have to do ARP resolutions.

              (2) More crucially, veth comes with a performance penalty. When traffic leaves the
                Pod for another node or off-node traffic ingressing into the Pod, the data has
                first to enter the network stack within the container, switch namespace, be
                processed and handled on the host namespace before being sent and handled by the
                network interface for retransmission. This might seem innocuous, but the whole
                process - including sending packets through the per-CPU backlog queue - can become
                costly under pressure.

                Netkit was recently introduced into the Linux kernel (6.7). Netkit is based on an
                original concept: what if we could load BPF programs directly into the Pods and
                bring them even closer to the source?

                One major benefit would be the ability to make networking decisions earlier. For
                example, for Pod egress traffic bound for a workload outside of the node, netkit
                would redirect to the physical device without going via the per-CPU backlog queue.
          */
          datapathMode: 'netkit',

          // IPv4 addresses used for pods are typically allocated from RFC1918 private address
          // blocks and thus, not publicly routable. Cilium will automatically masquerade the
          // source IP address of all traffic that is leaving the cluster to the IPv4 address of
          // the node as the node’s IP address is already routable on the network.
          //
          // The default behavior is to exclude any destination within the IP allocation CIDR of
          // the local node. If the pod IPs are routable across a wider network, that network can
          // be specified with the option: ipv4-native-routing-cidr: 10.0.0.0/8
          // (or ipv6-native-routing-cidr: fd00::/100 for IPv6 addresses) in which case all
          // destinations within that CIDR will not be masqueraded.
          masquerade: true,
        },
        hostLegacyRouting: false,

        /*
          Organizations are building networks capable of 100Gbps and beyond but with the adoption
          of 100Gbps network adapters comes the inevitable challenge: how can a CPU deal with
          eight-million packets per second (assuming a MTU of 1,538 bytes)? That leaves only 120
          nanoseconds per packet for the system to handle, which is unrealistic. There is also a
          significant overhead with handling all these packets from the interface to the upper
          protocol layer.

          Evidently, this limitation is not new and has been addressed by batching packets together.
          Within the Linux stack, it is addressed by GRO (Generic Receive Offload) and TSO
          (Transmit Segmentation Offload). On the receiving end, GRO would group packets into a
          super-sized 64KB packet within the stack and pass it up the networking stack. Likewise,
          on the transmitting end, TSO would segment TCP super-sized packets for the NIC to handle.

          While that super-sized 64K packet helps, modern CPUs can actually handle much larger
          packets. Having bigger packets would mean reducing the overhead and would theoretically
          improve throughput and reduce latency. This is what BIG TCP was designed to do.

          BIG TCP does not require MTU on your network devices to be modified. This is designed to
          happen within the Linux networking stack and is to be used in ingress by GRO to aggregate
          packets in a 512K hyper-sized packet (instead of a 64KB super-sized one) and in egress by
          GSO to craft a super packet and push it down the stack.
        */
        enableIPv4BIGTCP: true,

        // Cilium Host Firewall empowers administrators to enforce fine-grained policies for
        // node-level traffic. By matching on node labels, you can create targeted rules that allow
        // or deny traffic based on specific needs, such as permitting only SSH or ICMP traffic to
        // specific nodes.
        hostFirewall: { enabled: true },

        // Configure Cilium to use ztunnel for transparent encryption and mutual TLS (mTLS)
        // authentication between Cilium-managed endpoints. ztunnel is a purpose-built per-node
        // proxy that provides transparent Layer 4 mTLS encryption and authentication for
        // pod-to-pod communication.
        // When ztunnel is enabled in Cilium, the agent running on each cluster node establishes a
        // control plane connection with the local ztunnel proxy. Cilium enrolls pods into the mesh
        // on a per-namespace basis, allowing fine-grained control over which workloads participate
        // in mTLS encryption. Enrolled pods have their traffic transparently redirected to the
        // ztunnel proxy using iptables rules configured in their network namespace, where the
        // traffic is encrypted and authenticated using mutual TLS before being sent to the
        // destination.
        encryption: {
          enabled: true,
          type: 'ztunnel',
        },

        // Enable metrics for Cilium Agent.
        prometheus: {
          enabled: true,
          serviceMonitor: { enabled: true },
        },

        // Enable metrics for Cilium Operator.
        operator: {
          prometheus: {
            enabled: true,
            serviceMonitor: { enabled: true },
          },
        },

        // Hubble is a fully distributed networking and security observability platform, built on
        // top of Cilium and eBPF.
        hubble: {
          // By default, Hubble API operates within the scope of the individual node on which the
          // Cilium agent runs. This confines the network insights to the traffic observed by the
          // local Cilium agent.
          // Upon deploying Hubble Relay, network visibility is provided for the entire cluster or
          // even multiple clusters in a ClusterMesh scenario.
          // In this mode, Hubble data can be accessed via Hubble UI.
          relay: { enabled: true },

          // Hubble UI is a web interface which enables automatic discovery of the services
          // dependency graph at the L3/L4 and even L7 layer, allowing user-friendly visualization
          // and filtering of data flows as a service map.
          ui: { enabled: true },

          // Hubble Exporter is a feature of cilium-agent that lets you write Hubble flows to a
          // file for later consumption as logs. It supports file rotation, size limits, filters,
          // and field masks.
          export: {
            // Standard hubble exporter configuration accepts only one set of filters and requires
            // cilium pod restart to change config.
            // Dynamic flow logs allow configuring multiple filters at the same time and saving
            // output in separate files. Additionally it does not require cilium pod restarts to
            // apply changed configuration.
            dynamic: {
              enabled: true,
              config: {
                enabled: true,
                content: [
                  {
                    name: 'dropped-packet-flows',
                    filePath: '/var/run/cilium/hubble/dropped-packet-flows.log',

                    // You can view all available fields for a Hubble flow here :
                    // https://docs.cilium.io/en/stable/_api/v1/flow/README/#flowfilter.
                    includeFilters: [
                      {
                        event_type: [
                          { type: 1 },  // Packet dropped.
                        ],
                      },
                    ],
                    fieldMasks: [
                      'source.namespace',
                      'source.pod_name',
                      'destination.namespace',
                      'destination.pod_name',
                      'drop_reason_desc',
                    ],
                  },
                ],
              },
            },
          },

          // While Cilium metrics allow you to monitor the state of Cilium itself, Hubble metrics
          // on the other hand allow you to monitor the network behavior of your Cilium-managed
          // Kubernetes pods with respect to connectivity and security.
          metrics: { enabled: ['drop'] },
        },
      },
    }),
  }),
}
