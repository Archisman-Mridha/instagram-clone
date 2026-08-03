// TODO : Use S3 backend to store the artifacts, so we can use Harbor in HA mode.
// REFER : https://goharbor.io/docs/main/install-config/harbor-ha-helm/.

local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local CloudNativePG = import './cloudnative-pg.libsonnet';
local Dragonfly = import './dragonfly.libsonnet';
local Utils = import './utils.libsonnet';

local app = 'harbor';

local databaseName = 'registry';

local postgresqlCluster = CloudNativePG.newCluster(app, app) + {
  cluster+: {
    spec+: {
      storage+: {
        size: '10Gi',
      },

      bootstrap: {
        initdb: {
          database: databaseName,
          owner: app,
        },
      },
    },
  },
};

local dragonflyCluster = Dragonfly.newCluster(app, app);

// Harbor is an open source registry that secures artifacts with policies and role-based access
// control, ensures images are scanned and free from vulnerabilities, and signs images as trusted.
//
// We'll be using it to just cache container images in the cluster; especially the ones coming from
// DockerHub, since it'll help us not hit the rate-limit imposed by DockerHub.
{
  harbor: Utils.withAppLabel(app, {
    namespace: Kubernetes.core.v1.namespace.new(app),

    installation: Helm.template(app, Utils.chartsDir(app, std.thisFile), {
      version: '1.19.1',

      namespace: app,
      createNamespace: false,

      values: {
        database: {
          type: 'external',
          external: {
            host: std.format('%s-rw.%s.svc.cluster.local', [app, app]),
            port: '5432',
            username: app,
            existingSecret: std.format('%s-app', app),
            coreDatabase: databaseName,
            sslmode: 'require',
          },
        },

        redis: {
          type: 'external',
          external: {
            addr: std.format('%s.%s.svc.cluster.local:6379', [app, app]),
            existingSecret: std.format('%s-dragonfly-credentials', app),
          },
        },

        metrics: { enabled: true },
      },
    }),

    database: postgresqlCluster,

    cache: dragonflyCluster,

    serviceMonitor: {
      apiVersion: 'monitoring.coreos.com/v1',
      kind: 'ServiceMonitor',
      metadata: {
        name: app,
        namespace: app,
        labels: {
          app: app,
        },
      },
      spec: {
        selector: {
          matchLabels: {
            app: app,
          },
        },
        endpoints: [
          { port: 'metrics' },
        ],
      },
    },
  }),
}
