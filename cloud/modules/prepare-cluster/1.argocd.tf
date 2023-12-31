resource "kubernetes_namespace" "argocd" {
  metadata {
    name = "argocd"
  }
}

resource "kubernetes_manifest" "kustomize_enable_helm_argocd_plugin" {
  manifest = yamldecode(file("${path.module}/manifests/kustomize-enable-helm.argocd-plugin.configmap.yaml"))

  depends_on = [ kubernetes_namespace.argocd ]
}

resource "helm_release" "argocd" {
  repository = "https://argoproj.github.io/argo-helm"
  chart = "argo-cd"
  version = "5.46.8"

  values = [ file("${path.module}/manifests/argocd-helm-installation.values.yaml") ]

  name = "argocd"
  namespace = "argocd"

  wait = true

  depends_on = [ kubernetes_manifest.kustomize_enable_helm_argocd_plugin ]
}

// Creating the ArgoCD Application Manager
resource "kubernetes_manifest" "argocd_application_manager" {
  manifest = yamldecode(templatefile("${path.module}/manifests/argocd-application-manager.yaml", {

    WORKSPACE: var.args.workspace
    BRANCH: var.args.workspace == "dev" ? "dev" : "main"
  }))

  depends_on = [ kubernetes_manifest.kustomize_enable_helm_argocd_plugin ]
}