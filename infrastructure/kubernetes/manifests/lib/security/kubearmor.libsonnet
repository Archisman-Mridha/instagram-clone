local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import './utils.libsonnet';

local app = 'kubearmor';

// KubeArmor is a cloud-native runtime security enforcement system that restricts the behavior
// (such as process execution, file access, and networking operations) of pods, containers, and
// nodes (VMs) at the system level.
// KubeArmor leverages Linux security modules (LSMs) such as AppArmor, SELinux, or BPF-LSM to
// enforce the user-specified policies. KubeArmor generates rich alerts/telemetry events with
// container/pod/namespace identities by leveraging eBPF.
{
  kubearmor: Utils.withAppLabel(app, {
    namespace: Kubernetes.core.v1.namespace.new(app),

    installation: Helm.template(app, Utils.chartsDir(app, std.thisFile), {
      version: '1.7.3',

      namespace: app,
      createNamespace: false,

      values: {},
    }),
  }),

  /*
    KubeArmor provides a set of hardening policies that are based on industry-leading compliance
    and attack frameworks such as CIS, MITRE, NIST-800-53, and STIGs. These policies are designed
    to help you secure your workloads in a way that is compliant with these frameworks and
    recommended best practices.

    KubeArmor Policy Templates contains the latest hardening policies.

    KubeArmor client tool (karmor) provides a way (karmor recommend) to fetch the policies in the
    context of the kubernetes workloads or specific container using command line.
  */
}
