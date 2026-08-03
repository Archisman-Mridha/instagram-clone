local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import './utils.libsonnet';

local app = 'sealed-secrets';

// Sealed Secrets encrypts your Secret into a SealedSecret, which is safe to store - even inside a
// public repository. The SealedSecret can be decrypted only by the controller running in the
// target cluster and nobody else (not even the original author) is able to obtain the original
// Secret from the SealedSecret.
{
  sealedSecrets: Utils.withAppLabel(app, {
    namespace: Kubernetes.core.v1.namespace.new(app),

    installation: Helm.template(app, Utils.chartsDir(app, std.thisFile), {
      version: '2.18.6',

      namespace: app,
      createNamespace: false,

      values: {
        // The Helm chart by default installs the controller with the name sealed-secrets, while
        // the kubeseal command line interface (CLI) tries to access the controller with the name
        // sealed-secrets-controller. So we enforce the controller name to be
        // sealed-secrets-controller.
        fullnameOverride: 'sealed-secrets-controller',

        namespace: app,

        /*
          Sealing keys are automatically renewed every 30 days. Which means a new sealing key is
          created and appended to the set of active sealing keys the controller can use to unseal
          SealedSecret resources.

          A common misunderstanding is that key renewal is often thought of as a form of key
          rotation, where the old key is not only obsolete but actually bad and that you thus want
          to get rid of it.

          Sealed secrets are not automatically rotated and old keys are not deleted when new keys
          are generated. Old SealedSecret resources can be still decrypted (that's because old
          sealing keys are not deleted).

          The sealing key renewal and SealedSecret rotation are not a substitute for rotating your
          actual secrets.

          When a sealing key somehow leaks out of the cluster you must consider all your
          SealedSecret resources encrypted with that key as compromised. No amount of sealing key
          rotation in the cluster or even re-encryption of existing SealedSecrets files can change
          that.

          The best practice is to periodically rotate all your actual secrets (e.g. change the
          password) and craft new SealedSecret resources with those new secrets.

          But if the SealedSecret controller was not renewing the sealing key that rotation would
          be moot, since the attacker could just decrypt the new secrets as well. Thus, you need
          to do both: periodically renew the sealing key and rotate your actual secrets!
        */

        metrics: {
          serviceMonitor: {
            enabled: true,
            namespace: app,
          },
          prometheusRule: {
            enabled: true,
            namespace: app,
          },
        },
      },
    }),
  }),
}
