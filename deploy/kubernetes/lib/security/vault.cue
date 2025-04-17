@generateArgoCDApp()
@namespace("vault")

// HashiCorp Vault is an identity-based secrets and encryption management system.
#Vault: {
  helmInstallation: kue.#HelmInstallation & {
    repoURL: "https://helm.releases.hashicorp.com"
    version: "0.30.0"
    chartPath: "vault"

    releaseName: "vault"
    namespace: "vault"
    createNamessace: true

    values: generated.#VaultHelmValues & {
      server: ha: {
        // For multiple Vault servers sharing a storage backend, only a single instance is active
        // at any time. All standby instances are placed in hot standbys.
        // NOTE : Only unsealed Vault servers may act as a standby.
        enabled: true

        // Vault supports several options for durable information storage. Integrated storage is a
        // built-in storage option that supports backup/restore workflows, high availability, and
        // Enterprise replication features without relying on third-party systems.
        raft: enabled: true
      }

      ui: enabled: true

      serverTelemetry: serviceMonitor: enabled: true
    }
  }
}
