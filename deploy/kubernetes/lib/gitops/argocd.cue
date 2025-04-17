@generateArgoCDApp()
@namespace("argocd")

#ArgoCD: {
  helmInstallation: kue.#HelmInstallation & {
    repoURL: "https://argoproj.github.io/argo-helm"
		version: "7.7.11"
		chartPath: "argo-cd"

    releaseName: "argocd"
		namespace: "argocd"
    createNamespace: true

		values: helm.#ArgoCDValues & {
      server: autoscaling: enabled: true

      // Enable monitoring for all the components.
			server: serviceMonitorEnabled
      controller: serviceMonitorEnabled
      dex: serviceMonitorEnabled
      redis: serviceMonitorEnabled
      repoServer: serviceMonitorEnabled
      notifications: serviceMonitorEnabled
    }
  }

  defaultAppProject: argoCD.#AppProject & {
		metadata: name: "default"

		spec: {
			sourceRepos: ["https://github.com/Archisman-Mridha/instagram-clone"]
			destinations: [{ namespace: "*", server: "*" }]
			clusterResourceWhitelist: [{ group: "*", kind: "*" }]

			// Orphaned Kubernetes resource is a top-level namespaced resource which does not belong to
			// any Argo CD Application.
      // The Orphaned Resources Monitoring feature allows detecting orphaned resources,
      // inspect/remove resources using Argo CD UI and generate a warning.
			orphanedResources: warn: true
		}
	}
}

serviceMonitorEnabled: metrics: serviceMonitor: enabled: true
