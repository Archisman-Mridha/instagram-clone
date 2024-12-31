local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.30/main.libsonnet',
      Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile),
      Utils = import './utils.libsonnet';

local app = 'kube-prometheus-stack';

{
  kubePrometheusNamespace: Utils.namespace(app),

  kubePrometheusApp: Utils.argoCDApp(name=app),

  kubePrometheusStack: std.mapWithKey(Utils.withToolLabel(app), Helm.template(app, Utils.chartDir(app), {
    version: '65.0.0',

    namespace: app,
    createNamespace: true,

    values: {
      crds: {
        enabled: true,
      },

      grafana: {
        // A sidecar container is deployed in the grafana pod. This container watches all configmaps
        // (or secrets) in the cluster and filters out the ones with a label 'grafana_dashboard='1''.
        sidecar: {
          dashboards: {
            enabled: true,
            label: 'grafana_dashboard',
            searchNamespace: 'ALL',
          },
        },
      },
    },
  })),
}
