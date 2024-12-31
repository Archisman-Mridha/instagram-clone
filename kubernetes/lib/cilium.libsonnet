local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile),
      Utils = import './utils.libsonnet';

local app = 'cilium';

{
  ciliumNamespace: Utils.namespace(app),

  ciliumApp: Utils.argoCDApp(name=app),

  cilium: std.mapWithKey(Utils.withToolLabel(app), Helm.template(app, Utils.chartDir(app), {
    version: '1.16.0',

    namespace: app,
    createNamespace: true,

    values: {

      // Using eBPF instead of kube-proxy with iptables.
      // REFER : https://isovalent.com/blog/post/why-replace-iptables-with-ebpf/ and https://docs.cilium.io/en/stable/network/kubernetes/kubeproxy-free/.
      kubeProxyReplacement: true,
      // TODO : Take k8sServiceHost and k8sServicePort as input.

      /*
      	The Maglev consistent hashing algorithm for backend selection during load-balancing
      	improves resiliency in case of failures.

      	Nodes added to the cluster will make consistent backend selection throughout the cluster
      	for a given 5-tuple without having to synchronize state with the other Nodes. Similarly,
      	upon backend removal the backend lookup tables are reprogrammed with minimal disruption for
      	unrelated backends (at most 1% difference in the reassignments) for the given service.

      	NOTE :

      		(1) Maglev consistent hashing is applied only to external traffic.

      		(2) Maglev will have a higher memory consumption on each Cilium-managed Node compared to
      				the default of loadBalancer.algorithm=random given random does not need the extra
      				lookup tables. However, random won’t have consistent backend selection.
      */
      loadBalancer: {
        algorithm: 'maglev',
      },
      /*
      	Specifies the size of the Maglev lookup table for each single service. Maglev recommends the
      	table size (M) to be significantly larger than the number of maximum expected backends (N).
      	In practice that means that M should be larger than 100 * N in order to guarantee the
      	property of at most 1% difference in the reassignments on backend changes. M must be a prime
      	number. Cilium uses a default size of 16381 for M ( suitable for a maximum of ~160 backends
      	per service).
      */
      maglev: {
        tableSize: 16381,
      },

      // Leverage the routing capabilities of the network Cilium runs on instead of performing
      // encapsulation.
      // Cilium will delegate all packets which are not addressed to another local endpoint to the
      // routing subsystem of the Linux kernel. This means that the packet will be routed as if a
      // local process would has emitted the packet. As a result, the network connecting the cluster
      // nodes must be capable of routing pod CIDRs.
      routingMode: 'native',
      //
      // The CIDR in which native routing can be performed. The pod CIDR must be a subset of this.
      ipv4NativeRoutingCIDR: '10.0.0.0/8',
      //
      // Each individual node is made aware of all pod IPs of all other nodes and routes are
      // inserted into the Linux kernel routing table to represent this.
      autoDirectNodeRoutes: true,
      //
      // Delegate the pod address allocation to each individual node in the cluster. IPs are
      // allocated out of the pod CIDR range associated to each node by Kubernetes.
      ipam: {
        mode: 'kubernetes',
      },

      bpf: {
        masquerade: true,
        datapathMode: 'netkit',
      },

      // Enable metrics for Cilium Agent.
      prometheus: {
        enabled: true,
      },
      // Enable metrics for Cilium Operator.
      operator: {
        prometheus: {
          enabled: true,
        },
      },
    },
  })),
}
