local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.30/main.libsonnet',
      Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile),
      Utils = import './utils.libsonnet';

local app = 'external-dns';

{
  externalDNSNamespace: Utils.namespace(app),

  externalDNSApp: Utils.argoCDApp(name=app),

  /*
    ExternalDNS makes Kubernetes resources discoverable via public DNS servers. Like KubeDNS, it
    retrieves a list of resources (Services, Ingresses, etc.) from the Kubernetes API to determine a
    desired list of DNS records. It then reaches out to the corresponding DNS providers (CloudFlare
    / AWS Route 53 etc.) and creates those DNS records.
  */
  externalDNS: std.mapWithKey(Utils.withToolLabel(app), Helm.template(app, Utils.chartDir(app), {
    version: '6.28.4',

    namespace: app,
    createNamespace: true,

    values: {
      commonLabels: {
        tool: app,
      },

      // K8s resources type to be observed for new DNS entries by ExternalDNS.
      // TODO : Add Gateway API resources.
      sources: ['ingress'],

      provider: {
        // DNS provider where the DNS records will be created.
        name: 'cloudflare',
      },
      env: [
        {
          name: 'CF_API_KEY',
          valueFrom: {
            secretKeyRef: Utils.cloudflareAPIKeySecretKeyRef,
          },
        },
        {
          name: 'CF_API_EMAIL',
          value: Utils.email,
        },
      ],
    },
  })),
}
