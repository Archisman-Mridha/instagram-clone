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
      provider: {
        metadata: name: aws-kms
        spec: package: xpkg.crossplane.io/crossplane-contrib/provider-aws-kms:v1.21.1
      }

      vaultRootKey: generated.#Key & {
        metadata: name: vault-root-key

        spec: forProvider: {
          description: "Vault root key (used for auto-unsealing)"
        }
      }
    }
  }
}
