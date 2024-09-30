local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);

local Utils = import './utils.libsonnet';

local app = 'argocd';

{
  local rootDir = '../',
  local argoCDHelmChartDir = (rootDir + 'charts/argo-cd'),

  argocd: Helm.template(app, argoCDHelmChartDir, {
    namespace: app,
    version: '7.6.5',
    values: {

      crds: {
        // Don't keep CRDs on chart uninstall.
        keep: false,
      },
    },
  }),

  argoCDApp: Utils.argoCDApp(name=app, destinationNamespace=app),
}
