local clusterName = 'staging.openmedia',
      k8sServiceHost = 'localhost',

      email = 'archismanmridha12345@gmail.com',

      openobserveBucketName = 'openobserve.staging.openmedia',

      argoCDSourceRepo = 'https://github.com/archisman-mridha/openmedia';

// For communicating with the underlying Cloud Provider (AWS).
(import 'cloud-provider/aws/cloud-provider-aws.libsonnet')(clusterName) +
(import 'cloud-provider/aws/aws-node-termination-handler.libsonnet') +
(import 'cloud-provider/aws/kube2iam.libsonnet') +

// For networking.
(import 'cilium.libsonnet')(k8sServiceHost) +
(import 'cert-manager.libsonnet')(email, clusterName) +
(import 'external-dns.libsonnet')(email) +

// For monitoring.
(import 'monitoring/node-problem-detector.libsonnet') +
(import 'monitoring/kube-prometheus-stack.libsonnet') +
(import 'monitoring/otel-operator.libsonnet') +
(import 'monitoring/openobserve.libsonnet')(openobserveBucketName) +
(import 'monitoring/opencost.libsonnet') +

// For security.
(import 'security/kubescape.libsonnet')(clusterName) +
(import 'security/kubearmor.libsonnet') +
(import 'security/kyverno.libsonnet') +

// For auto-scaling.
(import 'cluster-autoscaler.libsonnet') +

// For GitOps.
(import 'gitops/argo-cd.libsonnet')(argoCDSourceRepo) +
(import 'gitops/sealed-secrets.libsonnet') +

// Miscellaneous.

(import 'kubevela.libsonnet') +
(import 'openkruise.libsonnet') +

(import 'cloudnative-pg.libsonnet') +
(import 'atlas.libsonnet') +
(import 'strimzi.libsonnet') +
(import 'meilisearch.libsonnet') +
(import 'dragonfly.libsonnet') +

(import 'openmedia.libsonnet')
