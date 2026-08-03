local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import './utils.libsonnet';

local app = 'cert-manager';

// CertManager adds certificates and certificate issuers as resource types in Kubernetes clusters,
// and simplifies the process of obtaining, renewing and using those certificates. It can issue
// certificates from a variety of supported sources, including Let's Encrypt, HashiCorp Vault etc.
// It will ensure certificates are valid and up to date, and attempt to renew certificates at a
// configured time before expiry.
function(email, clusterName) {
  certManager: Utils.withAppLabel(app, {
    namespace: Kubernetes.core.v1.namespace.new(app),

    installation: Helm.template(app, Utils.chartsDir(app, std.thisFile), {
      version: '1.20.2',

      namespace: app,
      createNamespace: false,

      values: {
        crds: { enabled: true },

        // Enable metrics emmission.
        prometheus: {
          servicemonitor: {
            enabled: true,
          },
        },
      },
    }),

    // ClusterIssuer represents a certificate authority (CA) able to sign certificates in response
    // to Certificate Signing Requests (CSRs).
    // The ClusterIssuer resource is cluster scoped. This means that when referencing a secret via
    // the secretName field, secrets will be looked for in the Cluster Resource Namespace. By
    // default, this namespace is cert-manager.
    clusterIssuer: {
      apiVersion: 'cert-manager.io/v1',
      kind: 'ClusterIssuer',
      metadata: {
        name: 'letsencrypt',
      },
      spec: {
        // The ACME Issuer type represents a single account registered with the Automated
        // Certificate Management Environment (ACME) Certificate Authority server.
        // Certificates issued by public ACME servers are typically trusted by client's computers
        // by default.
        acme: {
          server: 'https://acme-v02.api.letsencrypt.org/directory',
        },

        // Let's Encrypt will use this to contact you about expiring certificates, and issues
        // related to your account.
        email: email,

        // When you create a new ACME Issuer, CertManager will generate a private key which is used
        // to identify you with the ACME server.
        privateKeySecretRef: {
          // Name of the Kubernetes Secret that will be used to store the private key.
          name: 'letsencrypt',
        },

        // In order for the ACME CA server to verify that a client owns the domain, or domains, a
        // certificate is being requested for, the client must complete challenges.
        solvers: [{
          // DNS challenge solver will be used to create and manage DNS records. When a certificate
          // is requested, CertManager will create a DNS TXT record called '_acme-challenge' under
          // the domain you want a certificate for. The ACME CA (e.g. Let's Encrypt) will check for
          // the existence of that TXT record to verify that you control the domain. Once verified,
          // the CA will issue the TLS certificate. CertManager will then clean up the DNS records
          // it created.
          dns01: {
            cloudflare: {
              email: email,
              apiKeySecretRef: {
                name: 'cloudflare-credentials',
                namespace: app,
              },
            },
          },
        }],
      },
    } + Utils.recommendedLabels(app=app, component='cluster-issuer'),

    wildcardCertificate: {
      apiVersion: 'cert-manager.io/v1',
      kind: 'Certificate',
      metadata: {
        name: 'wildcard',
        namespace: 'gateway-api',
      },
      spec: {
        secretName: 'wildcard-certificate',
        dnsNames: [
          std.format('%s.projectsofarchi.xyz', clusterName),
          std.format('*.%s.projectsofarchi.xyz', clusterName),
        ],
        issuerRef: {
          kind: 'ClusterIssuer',
          name: $.certManager.clusterIssuer.metadata.name,
        },
      },
    } + Utils.recommendedLabels(app=app, component='cluster-issuer'),
  }),
}
