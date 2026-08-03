local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import './utils.libsonnet';

local app = 'kubescape';

// Kubescape is an open-source Kubernetes security platform designed to provide practical,
// end-to-end security for Kubernetes environments. It supports engineers and operators throughout
// the development and deployment lifecycle, offering tools for configuration scanning,
// vulnerability assessment, policy enforcement, network policy and seccomp validation, and
// runtime threat detection.
function(clusterName) {
  kubescape: Utils.withAppLabel(app, {
    namespace: Kubernetes.core.v1.namespace.new(app),

    operator: Helm.template('kubescape-operator', Utils.chartsDir('kubescape-operator', std.thisFile), {
      version: '1.40.2',

      namespace: app,
      createNamespace: false,

      values: {
        clusterName: clusterName,

        capabilities: {
          /*
            The Kubevuln component scans images which are deployed to the cluster when:

              (1) A new Deployment, StatefulSet, DaemonSet or naked Pod is created

              (2) The container image tag in an existing Deployment, StatefulSet, DaemonSet or Pod
                is changed.

            It uses the Grype engine to evaluate against a database of known vulnerabilities from a
            variety of publicly available vulnerability data sources. The sources include the
            security announcement data from all major Linux distributions, the National
            Vulnerability Database, and GitHub security advisories.

            The results are made available in API objects exposed by the Kubescape storage engine.

            The scanner is triggered by a CronJob called kubevuln-scheduler. By default, the
            scanner is triggered daily at midnight.

            REFER : https://kubescape.io/docs/operator/vulnerabilities/.
          */

          // Scan SBOMs embedded inside a container, if found.
          scanEmbeddedSBOMs: 'enable',

          /*
            Kubescape's runtime threat detection feature enables users to gain visibility into the
            runtime environment and detects security threats in real time within Kubernetes Pods
            and API server.

            Runtime threat detection is part of the Kubescape Operator, and most of the
            functionality is implemented as part of the node-agent.
            node-agent uses Inspektor Gadget for eBPF event acquisition for most events and
            implements some of its own eBPF gadgets. It uses the Kubescape Storage to store and
            monitor detection related objects.

            Alerts can be sent to multiple sink components, from logs to Prometheus AlertManager.

            The runtime threat detection feature is divided into three main detection strategies:

              (1) The anomaly detection engine is responsible for detecting any abnormal behavior
                in the runtime environment. It does this by recording the baseline behavior of the
                application and comparing it to the current state. If any deviation is detected,
                the engine will raise an alert.

              (2) Additionally, Kubescape is equipped with rules designed to identify well-known
                attack signatures. These rules are adept at uncovering various threats, such as
                unauthorized software executions that deviate from the original container image,
                detection of unpackers in memory, reverse shell activities, and more. Users have
                the flexibility to create 'Rule Bindings'—specific instructions that direct
                Kubescape on which rules should be applied to which Pods.

              (3) Kubescape can scan the nodes for malware using ClamAV as an engine, a popular
                open-source antivirus engine. ClamAV supports scanning of files, directories, and
                volumes, and can be configured to scan the entire node or only specific directories.
                You can read more about ClamAV here.

                Kubescape uses its own virus database which is a subset of the latest ClamAV virus
                database release but adapted to Kubernetes environment to save resources.

            REFER : https://kubescape.io/docs/operator/runtime-threat-detection/.
          */
          runtimeDetection: 'enable',
          malwareDetection: 'enable',

          // To let cluster operators see the current security posture of their cluster, Kubescape
          // provides the Continuous Scanning feature. Once enabled, Kubescape will constantly
          // monitor the cluster for changes, evaluate their impact on the overall cluster security
          // and reflect its findings in the cluster-, namespace- and workload-scoped security
          // reports.
          continuousScan: 'enable',

          /*
            The relevancy feature of the Kubescape operator enables users to understand which
            vulnerabilities detected by the vulnerability scanner are likely to be relevant, based
            on evaluation at runtime.

            Kubescape's relevancy filtering is implemented by an eBPF program on each node,
            deployed using the node agent. It scans the running environment and maps out artifacts
            and libraries that are loaded into memory and therefore are in use in the environment.

            Using eBPF probes, it looks at the file activity of a running container. When a pod
            starts on a node, the node agent will watch its containers for a configurable learning
            period and store an application profile.

            During the process of scanning a container, an SBOM is generated. This contains the
            vulnerability scanner’s understanding of which components are installed in the
            container. When vulnerabilities are checked, the engine is using the application
            profile to filter the SBOM, including only the packages that relate to files that were
            accessed during the learning period.

            Relevancy is installed by default when installing the Kubescape operator through Helm.

            REFER : https://kubescape.io/docs/operator/relevancy/.
          */

          /*
            Kubescape provides a way to automatically generate Network Policies for your cluster.
            Once the Network Policy generation feature is enabled, Kubescape will listen to the
            network communication on your workloads, and you can then use kubectl to generate
            Network Policies automatically based on the captured traffic.

            Kubescape Network Policy generation is built into the Kubescape Operator Helm chart and
            is enabled by default.

            With Network Policy feature enabled, Kubescape will use the node-agent component to
            listen for the network traffic in all your Pods. This traffic will then be aggregate by
            workload, and saved into a CRD of Kind NetworkNeighborhood. This CRD represents all the
            incoming and outgoing communication for all Pods which belong to the same workload.
            When the client asks for a GeneratedNetworkPolicy CRD, Kubescape will use the
            NetworkNeighborhood CRD to as well as KnownServers CRDs to generate the Network Policy,
            converting all traffic into Network Policy rules.

            When generating Network Policies based on captured traffic, we will often encounter IPs
            which, by themselves, don't have any meaning. They may be part of a bigger network on
            which every IP actually belongs to the same service, and thus, the entire network
            should be represented on the policy. Or it may be unclear for someone looking at the
            policy what this IP actually means, and what service it represents.
            The KnownServer CRD comes to take care of both situations. You can define for an IP the
            network which is equivalent to it, and also the server to which it belongs to. You can
            also name it in a user-friendly manner, so it will be easier to understand what this IP
            actually means.

            REFER : https://kubescape.io/docs/operator/network-policy-generation/.
          */

          // Initially introduced in Linux kernel 2.6.12 in 2005, seccomp (Secure Computing Mode)
          // was designed to restrict the system calls a process can make, effectively reducing the
          // attack surface and limiting potential damage from compromised processes.
          // Application developers don’t know which syscalls are made, since most of them don’t
          // “speak that language” which is why it is recommended to use tools to find out which
          // seccomp profiles are in use and Kubescape can automatically generate suggestions,
          // based on application behavior. Saves the research and manual generation of them.
          // NOTE : These fields aren't documented.
          manageWorkloads: 'enable',
          syncSBOM: 'enable',
        },

        // Use the default set of rules provided by KubeScape, for runtime threat detection.
        alertCRD: { installDefault: true },

        // TODO : Send alerts generated by the runtime threat detection component to AlertManager.
        nodeAgent: {
          config: {
            alertManagerExporterURLs: [],
          },
        },

        // NOTE : This isn't documented.
        serviceScanConfig: { enabled: true },
      },
    }),
  }),
}
