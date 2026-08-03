local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import './utils.libsonnet';

local app = 'external-dns';

// ExternalDNS makes Kubernetes resources discoverable via public DNS servers. Like KubeDNS, it
// retrieves a list of resources (Services, Ingresses, etc.) from the Kubernetes API to determine a
// desired list of DNS records. It then reaches out to the corresponding DNS providers
// (CloudFlare / AWS Route 53 etc.) and creates those DNS records.
function(email) {
  externalDNS: Utils.withAppLabel(app, {
    namespace: Kubernetes.core.v1.namespace.new(app),

    installation: Helm.template(app, Utils.chartsDir(app, std.thisFile), {
      version: '1.21.1',

      namespace: app,
      createNamespace: true,

      values: {
        // K8s resources type to be observed for new DNS entries by ExternalDNS.
        // TODO : Add Gateway API resources.
        sources: ['ingress'],

        // DNS provider where the DNS records will be created.
        provider: { name: 'cloudflare' },

        // CloudFlare specific configurations.
        env: [
          {
            name: 'CF_API_KEY',
            valueFrom: {
              secretKeyRef: {
                name: 'cloudflare-credentials',
                namespace: app,
              },
            },
          },
          {
            name: 'CF_API_EMAIL',
            value: email,
          },
        ],

        serviceMonitor: {
          enabled: true,
          namespace: app,
        },
      },
    }),
  }),
}
