local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import '../../utils.libsonnet';

local app = 'pod-identity-webhook',
      chart = 'amazon-eks-pod-identity-webhook';

/*
  This webhook is for mutating pods that will require AWS IAM access.

  KOps publishes the cluster's ServiceAccount token issuer (OIDC) discovery documents to an S3
  bucket, and registers that issuer as an OIDC identity provider in AWS. That gives AWS the ability
  to verify ServiceAccount tokens minted by our kube-apiserver. But it doesn't get such a token
  into the Pod - that is this webhook's job.

  The webhook intercepts Pod creations. If the Pod's ServiceAccount carries the
  eks.amazonaws.com/role-arn annotation, then the webhook mutates the Pod, by :

    (1) projecting a ServiceAccount token, scoped to the sts.amazonaws.com audience, into every
        container at /var/run/secrets/eks.amazonaws.com/serviceaccount/token.

    (2) setting the AWS_ROLE_ARN and AWS_WEB_IDENTITY_TOKEN_FILE environment variables.

  The AWS SDKs pick those 2 environment variables up automatically, and exchange the projected
  token for temporary IAM credentials, using sts:AssumeRoleWithWebIdentity. So, no node level IAM
  role, and no credentials baked into the container image.

  AWS ships the webhook as raw manifests, and not as a Helm Chart. So, we use the community
  maintained Chart, which additionally wires up CertManager and a ServiceMonitor for us.
*/
function(defaultAWSRegion) {
  podIdentityWebhook: Utils.withAppLabel(app, {
    namespace: Kubernetes.core.v1.namespace.new(app),

    installation: Helm.template(app, Utils.chartsDir(chart, std.thisFile), {
      version: '2.6.5',

      namespace: app,
      createNamespace: false,

      values: {
        // The failurePolicy is Ignore. So, during a webhook outage, Pods silently come up without
        // AWS credentials, instead of Pod creation getting blocked.

        replicaCount: 2,
        podDisruptionBudget: {
          enabled: true,
          minAvailable: 1,
        },

        resources: {
          requests: { cpu: '100m', memory: '128Mi' },
          limits: { memory: '128Mi' },
        },

        priorityClassName: 'system-cluster-critical',

        config: {
          // When the aws-default-region flag is set this webhook will inject AWS_DEFAULT_REGION
          // and AWS_REGION in mutated containers if AWS_DEFAULT_REGION and AWS_REGION are not
          // already set.
          defaultAwsRegion: defaultAWSRegion,

          // When the sts-regional-endpoint flag is set to true, the webhook will inject the
          // environment variable AWS_STS_REGIONAL_ENDPOINTS with the value set to regional. This
          // environment variable will configure the AWS SDKs to perform the
          // sts:AssumeRoleWithWebIdentity call to get credentials from the regional endpoint,
          // instead of the global endpoint in us-east-1.
          stsRegionalEndpoint: true,
        },

        metrics: {
          serviceMonitor: {
            enabled: true,
            namespace: app,
          },
        },
      },
    }),
  }),
}
