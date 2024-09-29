local tanka = import "github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet";
local helm = tanka.helm.new(std.thisFile);

local rootDir = "../";

{
  local argoCDHelmChartDir = (rootDir + "charts/argo-cd"),

  argocd: helm.template("argocd", argoCDHelmChartDir, {
    namespace: "argocd",
    values: {

      crds: {
        // Keep CRDs on chart uninstall.
        keep: false
      }
    }
  })
}
