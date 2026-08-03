local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import './utils.libsonnet';

local app = 'cluster-autoscaler';

/*
  Cluster Autoscaler is a tool that automatically adjusts the size of the Kubernetes cluster when
  one of the following conditions is true:

  (1) there are pods that failed to be scheduled in the cluster due to insufficient resources.

  (2) there are nodes in the cluster that have been underutilized for an extended period of time
      and their pods can be placed on other existing nodes.

  On AWS, Cluster Autoscaler utilizes Amazon EC2 Auto Scaling Groups to manage node groups.
*/
function(clusterName, awsRegion, iamRoleARN) {
  clusterAutoscaler: Utils.withAppLabel(app, {
    namespace: Kubernetes.core.v1.namespace.new(app),

    installation: Helm.template(app, Utils.chartsDir(app, std.thisFile), {
      version: '9.59.0',

      namespace: app,
      createNamespace: false,

      values: {
        awsRegion: awsRegion,

        autoDiscovery: { clusterName: clusterName },

        replicaCount: 2,

        resources: {
          requests: {
            cpu: '100m',
            memory: '300Mi',
          },
          limits: {
            memory: '300Mi',
          },
        },

        rbac: {
          serviceAccount: {
            name: app,
            annotations: {
              'eks.amazonaws.com/role-arn': iamRoleARN,
            },
          },
        },

        serviceMonitor: {
          enabled: true,
          namespace: app,
          selector: {},
        },
      },
    }),
  }),
}
