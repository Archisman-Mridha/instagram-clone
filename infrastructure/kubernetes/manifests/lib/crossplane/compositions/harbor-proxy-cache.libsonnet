// Proxy cache allows you to use Harbor to proxy and cache images from a target public or private
// registry.
{
  // Compositions are a template for creating multiple Kubernetes resources as a single composite
  // resource. A Composition composes individual resources together into a larger, reusable,
  // solution.
  // A Composition is a pipeline of composition functions.
  composition: {
    apiVersion: 'apiextensions.crossplane.io/v1',
    kind: 'Composition',
    metadata: {
      name: 'harbor-proxy-cache',
    },
    spec: {
      // A Composition’s compositeTypeRef defines which Composite Resource type can use this
      // Composition.
      compositeTypeRef: {
        apiVersion: 'openmedia.io/v1alpha1',
        kind: 'XHarborProxyCache',
      },

      mode: 'Pipeline',
      pipeline: [
        {
          step: 'patch-and-transform',
          functionRef: {
            name: 'function-patch-and-transform',
          },
          input: {
            apiVersion: 'pt.fn.crossplane.io/v1beta1',
            kind: 'Resources',

            patchSets: [],

            resources: [
              // Managed resources (MRs) are ready-made Kubernetes custom resources. Each MR
              // extends Kubernetes with the ability to manage a new system. For example there’s an
              // RDS instance MR that extends Kubernetes with the ability to manage AWS RDS
              // instances.
              // Crossplane has an extensive library of managed resources you can use to manage
              // almost any cloud provider, or cloud native software.
              // With Crossplane you don’t have to write a controller if you want to manage
              // something outside of your Kubernetes cluster using a custom resource. There’s
              // already a Crossplane managed resource for that.
            ],
          },
        },
      ],
    },
  },
}
