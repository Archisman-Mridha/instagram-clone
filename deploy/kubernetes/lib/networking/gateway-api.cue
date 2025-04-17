@generateArgoCDApp()
@namespace("gateway-api")

// Gateway API is focused on L4 and L7 routing in Kubernetes. It represents the next generation of
// Kubernetes Ingress, Load Balancing, and Service Mesh APIs.
#GatewayAPI: {
  crds: {} @fetchAndMergeYAML("https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.2.0/standard-install.yaml")

  // GatewayClass defines a set of Gateways that share a common configuration and behaviour. Each
  // GatewayClass will be handled by a single controller.
  // While installing the Cilium Helm chart, the cilium GatewayClass gets installed.

  // A Gateway describes how traffic can be translated to Services within the cluster.
  // It defines a request for a specific load balancer config that implements the GatewayClass’
  // configuration and behaviour contract. The resource may be created by an operator directly, or
  // may be created by a controller handling a GatewayClass.
  gateway: generated.#Gateway & {
    metadata: name: "default"

    spec: {
      gatewayClassName: "cilium"
      listeners: [
        {
          name: "https"
          hostname: string
          port: 443
          protocol: "HTTPS"
          tls: {
            mode: "Terminate"
            certificateRefs: name: "wildcard-certificate-tls-keys"
          }
          allowedRoutes: namespaces: {
            from: "Selector"
            selector: matchExpressions: [{
              key: "kubernetes.io/metadata.name"
              operator: "In"
              values: [
                "microservices"
              ]
            }]
          }
        }
      ]
    }
  }

  bffRoute: generated.#HTTPRoute & {
    metadata: {
      name: "bff"
      namespace: "microservices"
    }

    spec: {
      parentRefs: [{
        name: "default"
        section: "https"
      }]
      hostnames: [...string]
      rules: [{
        name: "default"
        matches: [{
          path: {
            type: "PathPrefix"
            value: "/"
          }
        }]
        backendRefs: [{
          name: "bff"
          port: 4000
        }]
      }]
    }
  }
}
