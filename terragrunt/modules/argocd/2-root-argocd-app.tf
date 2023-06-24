data "kubectl_file_documents" "root_argocd_app" {
  content = templatefile("./root.argocd-app.yaml", { WORKSPACE: var.workspace })
}

resource "kubectl_manifest" "root_argocd_app" {
  depends_on = [ helm_release.argocd ]

  for_each = data.kubectl_file_documents.root_argocd_app.manifests
  yaml_body = each.value

  wait = true
}