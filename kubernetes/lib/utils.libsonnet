local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.30/main.libsonnet',
      Runtime = import 'tk',
      ArgoCD = import 'github.com/jsonnet-libs/argo-cd-libsonnet/2.11/main.libsonnet',
      Application = ArgoCD.argoproj.v1alpha1.application;

{
  // Folder (relative to the repo root) corresponding to the current Grafana Tanka environment in
  // the 'outputs' directory.
  // For example, if the underlying Grafana Tanka environment name is 'environments/dev', then the
  // corresponding folder will be kubernetes/outputs/environments-dev.
  outputsEnvironmentFolder:: std.format('kubernetes/outputs/%s/',
                                        [std.strReplace(Runtime.env.metadata.name, '/', '-')]),

  // Returns the path to the given Helm Chart relative to this lib folder.
  chartDir(app):: '../charts/' + app,

  email:: 'archismanmridha12345@gmail.com',

  cloudflareAPIKeySecretKeyRef:: {
    name: 'cloudflare-credentials',
    key: 'api-key',
  },

  // Adds the tool label to the given resource.
  withToolLabel(tool):: function(name, resource)
    if std.isObject(resource) then
      resource {
        metadata+: {
          labels+: {
            tool: tool,
          },
        },
      }
    else resource,

  /*
    You can visualize and manage Kubernetes objects with more tools than kubectl and the dashboard.
    A common set of labels allows tools to work interoperably, describing objects in a common manner
    that all tools can understand.

    In addition to supporting tooling, the recommended labels describe applications in a way that
    can be queried.
  */
  recommendedLables(parentAppName, instance=parentAppName, component='', partOf=parentAppName, version=''):: (
    {
      metadata+: {
        labels+: {
          // The name of the application.
          'app.kubernetes.io/name': parentAppName,

          // A unique name identifying the instance of an application.
          'app.kubernetes.io/instance': instance,

          // The current version of the application.
          'app.kubernetes.io/version': version,

          // The component within the architecture.
          'app.kubernetes.io/component': component,

          // The name of a higher level application this one is part of.
          'app.kubernetes.io/part-of': partOf,

          tool: parentAppName,
        },
      },
    }
  ),

  namespace(name):: (
    Kubernetes.core.v1.namespace.new(name)
		+ $.recommendedLables(parentAppName=name)
  ),

  // NOTE : 'path' is the path (relative to $.outputsEnvironmentFolder), which the ArgoCD app will
  // observe.
  argoCDApp(name, destinationNamespace=name, path=name):: (
    Application.new(name=name) + {
      metadata+: {
        namespace: 'argocd',
      },

      spec+: {
        source+: {
          repoURL: 'github.com/Archisman-Mridha/instagram-clone',
          path: ($.outputsEnvironmentFolder + path),
          directory+: {
            recurse: true,
          },
        },

        destination+: {
          namespace: destinationNamespace,
        },
      },
    }
    + $.recommendedLables(parentAppName='apps', component=name)
  ),

  // This label will be added to any ConfigMap which contains definitions of Grafana dashboards.
  grafanaDashboardConfigMapLabel: {
    grafana_dashboard: '',
  },
}
