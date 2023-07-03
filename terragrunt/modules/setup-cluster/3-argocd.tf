// Installing ArgoCD using Helm.
resource "helm_release" "argocd" {
  name = "argocd"

  namespace = "argocd"
  create_namespace = true

  repository = "https://argoproj.github.io/argo-helm"
  chart = "argo-cd"
  version = "5.36.6"

  wait = true
}

// Creating the ArgoCD application manager.
data "kubectl_file_documents" "root_argocd_app" {
  content = templatefile("./root.argocd-app.yaml",
    {
      WORKSPACE: var.workspace,
      BRANCH: var.workspace == "development" ? "main": var.workspace
    }
  )
}
resource "kubectl_manifest" "root_argocd_app" {
  depends_on = [ helm_release.argocd ]

  for_each = data.kubectl_file_documents.root_argocd_app.manifests
  yaml_body = each.value

  wait = true
}