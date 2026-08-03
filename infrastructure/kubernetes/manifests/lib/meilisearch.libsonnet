local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import './utils.libsonnet';

local newCluster = function(clusterName, namespace)
  Helm.template(clusterName, Utils.chartsDir('meilisearch', std.thisFile), {
    version: '0.35.0',

    namespace: namespace,

    values: {
      environment: {
        MEILI_ENV: 'production',
        // TODO : Provide a master key from our side.
      },

      resources: {
        requests: {
          cpu: '200m',
          memory: '256Mi',
        },
        limits: {
          memory: '256Mi',
        },
      },

      persistence: {
        enabled: true,
      },

      serviceMonitor: {
        enabled: true,
        namespace: namespace,
      },
    },
  });

{ newCluster:: newCluster }
