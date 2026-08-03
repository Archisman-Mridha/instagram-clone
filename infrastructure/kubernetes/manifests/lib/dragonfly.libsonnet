local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import './utils.libsonnet';

local app = 'dragonfly';

// TODO : Enable monitoring.
local newCluster = function(clusterName, namespace) {
  apiVersion: 'dragonflydb.io/v1alpha1',
  kind: 'Dragonfly',
  metadata: {
    name: clusterName,
    namespace: namespace,
  },
  spec: {
    replicas: 2,
    resources: {
      requests: {
        cpu: '500m',
        memory: '500Mi',
      },
      limits: {
        cpu: '600m',
        memory: '750Mi',
      },
    },

    authentication: {
      passwordFromSecret: {
        name: std.format('%s-dragonfly-credentials', clusterName),
        key: 'password',
      },
    },
  },
};

// Dragonfly is a modern in-memory datastore, fully compatible with Redis and Memcached APIs.
// Dragonfly implements novel algorithms and data structures on top of a multi-threaded,
// shared-nothing architecture. As a result, Dragonfly reaches 25X performance compared to Redis
// and supports millions of QPS on a single instance.
{
  dragonfly: Utils.withAppLabel(app, {
    namespace: Kubernetes.core.v1.namespace.new(app),

    operator: Helm.template('dragonfly-operator', Utils.chartsDir('dragonfly-operator', std.thisFile), {
      version: 'v1.5.0',

      namespace: app,
      createNamespace: false,

      values: {},
    }),
  }),

  newCluster:: newCluster,
}
