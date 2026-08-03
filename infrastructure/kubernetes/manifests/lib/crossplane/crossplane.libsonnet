local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import './utils.libsonnet';

local app = 'crossplane';

/*
  Crossplane is a control plane framework for platform engineering.

  Crossplane lets you build control planes to manage your cloud native software. It lets you design
  the APIs and abstractions that your users use to interact with your control planes.

  A control plane is software that controls other software. Control planes are a core cloud native
  pattern. The major cloud providers are all built using control planes. Control planes expose an
  API. You use the API to tell the control plane what software it should configure and how - this
  is your desired state. A control plane can configure any cloud native software. It could deploy
  an app, create a load balancer, or create a GitHub repository. The control plane configures your
  software, then monitors it throughout its lifecycle. If your software ever drifts from your
  desired state, the control plane automatically corrects the drift.
*/
{
  crossplane: {
    namespace: Kubernetes.core.v1.namespace.new(app),

    installation: Helm.template(app, Utils.chartsDir(app, std.thisFile), {
      version: '2.3.4',

      namespace: app,
      createNamespace: false,

      values: {},
    }),

    // Crossplane calls a Function to determine what resources it should create when you create a
    // composite resource.
    compositionFunctions: {
      // Function Patch and Transform allows you to write a Composition that specifies managed
      // resource (MR) templates, and uses “patch and transform” operations to fill them out.
      // Crossplane fills the templates out with values copied from a composite resource (XR).
      // A patch copies a value from one resource and patches it onto another resource.
      // A transform modifies the values before applying the patch.
      patchAndTransform: {
        apiVersion: 'pkg.crossplane.io/v1',
        kind: 'Function',
        metadata: {
          name: 'function-patch-and-transform',
        },
        spec: {
          package: 'xpkg.crossplane.io/crossplane-contrib/function-patch-and-transform:v0.8.2',
        },
      },
    },

    compositions: {
      harborProxyCache: import './compositions/harbor-proxy-cache.libsonnet',
    },

    // A modern React-based dashboard for managing and monitoring Crossplane resources in
    // Kubernetes. Visualize, search, and manage your infrastructure-as-code with ease.
    crossview: Utils.withAppLabel(app, {
      installation: Helm.template('crossview', Utils.chartsDir('crossview', std.thisFile), {
        version: '3.9.0-rc.4',

        namespace: app,
        createNamespace: false,

        values: {
          config: {
            server: {
              auth: {
                // Since, we're not using sessions, we don't need any Postgres database.
                mode: 'none',
              },
            },

            database: { enabled: false },
          },

          database: { enabled: false },
        },
      }),
    }),
  },
}
