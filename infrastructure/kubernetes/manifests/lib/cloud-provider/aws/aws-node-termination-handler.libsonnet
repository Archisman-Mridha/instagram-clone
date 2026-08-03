local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import '../../utils.libsonnet';

local app = 'aws-node-termination-handler';

// This project ensures that the Kubernetes control plane responds appropriately to events that can
// cause your EC2 instance to become unavailable, such as EC2 maintenance events, EC2 Spot
// interruptions, ASG Scale-In, ASG AZ Rebalance, and EC2 Instance Termination via the API or
// Console. If not handled, your application code may not stop gracefully, take longer to recover
// full availability, or accidentally schedule work to nodes that are going down.
//
// The aws-node-termination-handler Instance Metadata Service Monitor will run a small pod on each
// host to perform monitoring of IMDS paths like /spot or /events and react accordingly to drain
// and/or cordon the corresponding node.
{
  awsNodeTerminationHandler: Utils.withAppLabel(app, {
    namespace: Kubernetes.core.v1.namespace.new(app),

    installation: Helm.template(app, Utils.chartsDir(app, std.thisFile), {
      version: '0.27.6',

      namespace: 'aws',
      createNamespace: false,

      values: {
        // Kubernetes events will be emitted when interruption events are received and when actions
        // are taken on Kubernetes nodes. In IMDS Processor mode a default set of annotations with
        // all the node metadata gathered from IMDS will be attached to each event.
        emitKubernetesEvents: true,

        // Start an http server exposing /metrics endpoint for Prometheus.
        enablePrometheusServer: true,

        podMonitor: {
          create: true,
          namespace: app,
        },
      },
    }),
  }),
}
