local awsRegion = 'us-east-2',

      clusterName = 'staging.openmedia',
      k8sServiceHost = 'localhost',

      email = 'archismanmridha12345@gmail.com',

      openobserveBucketName = 'openobserve-stream-store-staging-openmedia',

      argoCDSourceRepo = 'https://github.com/archisman-mridha/openmedia';

local clusterAutoscalerIAMRoleARN =
  'arn:aws:iam::123412341234:role/openmedia/staging/cluster-autoscaler-staging';

local openObserveIAMRoleARN =
  'arn:aws:iam::123412341234:role/openmedia/staging/openobserve-staging';

// For communicating with the underlying Cloud Provider (AWS).
(import 'cloud-provider/aws/cloud-provider-aws.libsonnet')(clusterName) +
(import 'cloud-provider/aws/aws-node-termination-handler.libsonnet') +
(import 'cloud-provider/aws/pod-identity-webhook.libsonnet') +

// Networking and Ingress related.
(import 'cilium.libsonnet')(k8sServiceHost) +
(import 'cert-manager.libsonnet')(email, clusterName) +
(import 'external-dns.libsonnet')(email) +
(import 'envoy-gateway.libsonnet') +

// For monitoring.
(import 'monitoring/node-problem-detector.libsonnet') +
(import 'monitoring/kube-prometheus-stack.libsonnet') +
(import 'monitoring/openobserve.libsonnet')(openobserveBucketName) +
(import 'monitoring/opencost.libsonnet') +

// For security.
(import 'security/kubescape.libsonnet')(clusterName) +
(import 'security/kubearmor.libsonnet') +
(import 'security/kyverno.libsonnet') +

// For auto-scaling.
(import 'cluster-autoscaler.libsonnet')(clusterName, awsRegion, clusterAutoscalerIAMRoleARN) +

// For GitOps.
(import 'gitops/argo-cd.libsonnet')(argoCDSourceRepo) +
(import 'gitops/sealed-secrets.libsonnet') +

// Miscellaneous.

(import 'crossplane.libsonnet') +

(import 'harbor.libsonnet') +

(import 'kubevela.libsonnet') +
(import 'openkruise.libsonnet') +

(import 'cloudnative-pg.libsonnet') +
(import 'atlas.libsonnet') +
(import 'strimzi.libsonnet') +
(import 'dragonfly.libsonnet') +
(import 'flink.libsonnet') +

(import 'openmedia.libsonnet')
