// Since we want to use Cilium's service mesh and Gateway API integration features, Cilium must be
// installed with the kube-proxy replacement mode set to true. So, we need to uninstall the Cilium
// installation that comes by default with the DigitalOcean Kubernetes cluster and reinstall Cilium
// with the kube-proxy replacement set as true.
resource "null_resource" "replace_cilium_installation" {
  provisioner "local-exec" {
    when = create
    on_failure = fail

    command = <<-EOC
      export KUBECONFIG=$(pwd)/outputs/kubeconfig.yaml

      kubectl delete -n kube-system \
        daemonset.apps/kube-proxy \
        daemonset.apps/cilium \
        deployment.apps/cilium-operator \
        serviceaccount/cilium clusterrole/cilium clusterrolebinding/cilium \
        serviceaccount/cilium-operator clusterrole/cilium-operator clusterrolebinding/cilium-operator \
        cm/cilium-config \
        role/cilium-config-agent rolebinding/cilium-config-agent

      helm install cilium cilium/cilium --version 1.14.3 \
        --namespace kube-system \
        --set kubeProxyReplacement=true

      cilium status
    EOC
  }

  depends_on = [ digitalocean_kubernetes_cluster.default ]
}