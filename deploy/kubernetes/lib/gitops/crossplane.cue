@generateArgoCDApp()
@namespace("crossplane")

// Crossplane is an open source Kubernetes extension that transforms your Kubernetes cluster into a
// universal control plane. It lets you manage anything, anywhere, all through standard Kubernetes
// APIs.
//
// NOTE : A control plane creates and manages the lifecycle of resources. It constantly checks that
//        the intended resources exist, reports when the intended state doesn’t match reality and
//        acts to make things right.
#Crossplane: {
  helmInstallation: kue.#HelmInstallation & {
    repoURL: "https://charts.crossplane.io/stable"
    version: "1.10.0"
    chartPath: "crossplane"

    releaseName: "crossplane"
    namespace: "crossplane"
    createNamessace: true

    values: generated.#CrossplaneHelmValues & {
      metrics: enabled: true
    }
  }

  aws: {
    kms: {
      // Providers enable Crossplane to provision infrastructure on an external service. Providers
      // create new Kubernetes APIs and map them to external APIs.
      //
      // Installing a provider creates new Kubernetes resources (in this case, the Key CR)
      // representing the Provider’s APIs. Installing a provider also creates a Provider pod that’s
      // responsible for reconciling the Provider’s APIs into the Kubernetes cluster. Providers
      // constantly watch the state of the desired managed resources and create any external
      // resources that are missing.
      //
      // You can view all the AWS providers here :
      // https://marketplace.upbound.io/providers/upbound/provider-family-aws/v1.21.1.
      provider: {
        metadata: name: aws-kms
        spec: package: xpkg.crossplane.io/crossplane-contrib/provider-aws-kms:v1.21.1
      }

      vaultUnsealKey: generated.#Key & {
        metadata: name: vault-unseal-key

        spec: forProvider: {
          description: "Vault unseal key"
          region: "us-east-2"

          // You cannot just delete an AWS KMS key.
          // You can only schedule its deletion and wait for 7 - 30 days until the key gets deleted.
          deletionWindowInDays: 7
        }
      }
    }
  }
}
