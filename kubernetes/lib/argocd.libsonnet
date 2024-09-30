local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);

local ArgoCD = import 'github.com/jsonnet-libs/argo-cd-libsonnet/2.11/main.libsonnet',
      AppProject = ArgoCD.argoproj.v1alpha1.appProject;

local Utils = import './utils.libsonnet';

local app = 'argocd';

{
  local rootDir = '../',
  local argoCDHelmChartDir = (rootDir + 'charts/argo-cd'),

  local serviceMonitorEnabled = {
    metrics+: {
      serviceMonitor+: {
        enabled: true,
      },
    },
  },

  argocd: Helm.template(app, argoCDHelmChartDir, {
    namespace: app,
    version: '7.6.5',
    values: {

      crds: {
        // Don't keep CRDs on chart uninstall.
        keep: false,
      },

      // Enable HA (High Availability) mode.
      'redis-ha': {
        enabled: true,
      },
      server: {
        autoscaling: {
          enabled: true,
        },
      } + serviceMonitorEnabled,

      // Enable monitoring for components.
      controller: serviceMonitorEnabled,
      dex: serviceMonitorEnabled,
      redis: serviceMonitorEnabled,
      repoServer: serviceMonitorEnabled,
      notifications: serviceMonitorEnabled,
    },
  }),

  defaultProject:
    AppProject.new('default')
    + {
      spec: {
        sourceRepos: ['*'],
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
    }
    + Utils.recommendedLables(parentAppName=app, component='default-project'),

  argoCDApp: Utils.argoCDApp(name=app, destinationNamespace=app),
}
