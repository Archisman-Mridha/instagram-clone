local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import './utils.libsonnet';

local app = 'openkruise';

/*
  OpenKruise is an extended component suite for Kubernetes, which mainly focuses on automated
  management of large-scale applications, such as deployment, upgrade, ops and availability
  protection.

    (1) Advanced workloads :

      OpenKruise contains a set of advanced workloads, such as CloneSet, Advanced StatefulSet,
      Advanced DaemonSet, BroadcastJob, SidecarSet and UnitedDeployment.

      They all support not only the basic features which are similar to the original Workloads in
      Kubernetes, but also more advanced abilities like in-place update, configurable scale/upgrade
      strategies, parallel operations.

      In-place Update is a new methodology to update container images and even environments. It
      only restarts the specific container with the new image and the Pod will not be recreated,
      which leads to much faster update process and much less side effects on other sub-systems
      such as scheduler, CNI or CSI.

    OpenKruise provides other features, but, the above is all we care about.
*/
{
  openKruise: Utils.withAppLabel(app, {
    namespace: Kubernetes.core.v1.namespace.new(app),

    installation: Helm.template(app, Utils.chartsDir('kruise', std.thisFile), {
      version: '2.41.0',

      namespace: app,
      createNamespace: false,

      values: {
        installation: {
          createNamespace: false,
          namespace: app,
        },
      },
    }),
  }),
}
