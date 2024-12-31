local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.30/main.libsonnet',
      Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile),
      ArgoCD = import 'github.com/jsonnet-libs/argo-cd-libsonnet/2.11/main.libsonnet',
      AppProject = ArgoCD.argoproj.v1alpha1.appProject,
      Utils = import './utils.libsonnet';

local app = 'argocd';

local serviceMonitorEnabled = {
  metrics+: {
    serviceMonitor+: {
      enabled: true,
    },
  },
};

{
  argoCDNamespace: Utils.namespace(app),

  argoCDApp: Utils.argoCDApp(name=app),

  argoCD: std.mapWithKey(Utils.withToolLabel(app), Helm.template(app, Utils.chartDir(app), {
    version: '7.6.5',

    namespace: app,
    createNamespace: true,

    values: {
      server: {
        autoscaling: {
          enabled: true,
        },
      } + serviceMonitorEnabled,

      // Enable monitoring for other components.
      controller: serviceMonitorEnabled,
      dex: serviceMonitorEnabled,
      redis: serviceMonitorEnabled,
      repoServer: serviceMonitorEnabled,
      notifications: serviceMonitorEnabled,
    },
  })),

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
}
