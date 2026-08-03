local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import './utils.libsonnet';

local app = 'argo-cd';

local metricsAndServiceMonitorEnabled = {
  metrics: {
    enabled: true,
    serviceMonitor: {
      enabled: true,
    },
  },
};

// Argo CD is a declarative, GitOps continuous delivery tool for Kubernetes.
function(sourceRepo) {
  argoCD: Utils.withAppLabel(app, {
    namespace: Kubernetes.core.v1.namespace.new(app),

    installation: Helm.template(app, Utils.chartsDir(app, std.thisFile), {
      version: '9.5.19',

      namespace: app,
      createNamespace: false,

      values: {
        server: {
          autoscaling: {
            enabled: true,
          },
        } + metricsAndServiceMonitorEnabled,

        controller: metricsAndServiceMonitorEnabled {
          metrics+: {
            rules: {
              enabled: true,
              namespace: app,
            },
          },
        },
        dex: metricsAndServiceMonitorEnabled,
        redis: metricsAndServiceMonitorEnabled,
        repoServer: metricsAndServiceMonitorEnabled,
        notifications: metricsAndServiceMonitorEnabled,
      },
    }),

    /*
      Projects provide a logical grouping of applications, which is useful when Argo CD is used by
      multiple teams. Projects provide the following features:

        (1) restrict what may be deployed (trusted Git source repositories)

        (2) restrict where apps may be deployed to (destination clusters and namespaces)

        (3) restrict what kinds of objects may or may not be deployed (e.g. RBAC, CRDs, DaemonSets,
          NetworkPolicy etc...)

        (4) defining project roles to provide application RBAC (bound to OIDC groups and/or JWT
          tokens)
    */
    defaultProject: {
      apiVersion: 'argoproj.io/v1alpha1',
      kind: 'AppProject',
      metadata: {
        name: 'default',
        namespace: app,
      },
      spec: {
        sourceRepos: [sourceRepo],
        destinations: [{
          namespace: '*',
          server: '*',
        }],
        clusterResourceWhitelist: [{
          group: '*',
          kind: '*',
        }],

        // Orphaned Kubernetes resource is a top-level namespaced resource which does not belong to
        // any Argo CD Application. The Orphaned Resources Monitoring feature allows detecting
        // orphaned resources, inspect/remove resources using Argo CD UI and generate a warning.
        orphanedResources: {
          warn: true,
        },
      },
    },
  }),
}
