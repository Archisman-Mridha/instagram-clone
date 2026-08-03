local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import '../utils.libsonnet';

local app = 'opencost';

// OpenCost is a vendor-neutral open source project for measuring and allocating cloud
// infrastructure and container costs. It’s built for Kubernetes cost monitoring to power real-time
// cost monitoring, showback, and chargeback.
{
  opencost: Utils.withAppLabel(app, {
    namespace: Kubernetes.core.v1.namespace.new(app),

    installation: Helm.template(app, Utils.chartsDir(app, std.thisFile), {
      version: '2.5.22',

      namespace: app,
      createNamespace: false,

      values: {
        // OpenCost will automatically read the node information node.spec.providerID to determine
        // the cloud service provider (CSP) in use. If it detects the CSP is AWS, it will attempt
        // to pull the AWS on-demand pricing from the configured public API URL with no further
        // configuration required.

        kubecostProductConfigs: { carbonEstimates: { enabled: true } },

        opencost: {
          metrics: {
            kubeStateMetrics: {
              // To avoid duplicate metrics from v2 KubeStateMetrics running in the cluster and
              // v1 KubestateMetrics from OpenCost
              emitKsmV1Metrics: false,
              emitKsmV1MetricsOnly: true,
            },
          },

          prometheus: {
            internal: {
              serviceName: 'kube-prometheus-stack-prometheus',
              namespaceName: 'kube-prometheus-stack',
            },
          },

          exporter: {
            persistence: {
              enabled: true,
              accessMode: 'ReadWriteOnce',
              size: '1Gi',
            },
          },
        },
      },
    }),
  }),
}
