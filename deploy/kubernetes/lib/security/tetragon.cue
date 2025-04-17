// Cilium Tetragon component enables powerful realtime, eBPF-based Security Observability and
// Runtime Enforcement.
#Tetragon: {
  helmInstallation: kue.#HelmInstallation & {
    repoURL: "https://helm.cilium.io/"
    version: "1.17.3"
    chartPath: "tetragon"

    releaseName: "tetragon"
    namespace: "tetragon"
    createNamessace: true

    values: #TetragonHelmValues & {
      tetragon: {
        // Enable ability to check process capabilities and kernel namespaces access.
        // This information would help us determine which process or Kubernetes pod has started or
        // gained access to privileges or host namespaces that it should not have.
        enableProcessCred: true
        enableProcessNs: true
      }
    }
  }

  // TODO : Create and use more TracingPolicies, following the default rules used by Falco :
  //        https://falco.org/docs/reference/rules/default-rules/.
  tracingPolicies: {
    // On Linux each process has various associated user, group IDs, capabilities, secure
    // management flags, keyring, LSM security that are used part of the security checks upon
    // acting on other objects. These are called the task privileges or process credentials.
    //
    // Changing the process credentials is a standard operation to perform privileged actions or to
    // execute commands as another user.
    //
    // We'll monitor process credentials changes, at the Kernel layer, instead of hooking on to
    // system call invocations.
    //
    // WARNING : This approach may generate a lot of events, so appropriate filtering must be
    //           applied to reduce the noise.
    processCredentialsChanges: {} @fetchAndMergeYAML("https://raw.githubusercontent.com/cilium/tetragon/main/examples/tracingpolicy/process-credentials/process-creds-installed.yaml")

    hostSystemChanges: {
      // Monitoring kernel modules helps to identify processes that load kernel modules to add
      // features, to the operating system, to alter host system functionality or even hide their
      // behaviour.
      kernelModuleLoads: {} @fetchAndMergeYAML("https://raw.githubusercontent.com/cilium/tetragon/main/examples/tracingpolicy/host-changes/monitor-kernel-modules.yaml")
    }

    // Detects :
    //
    //  (1) read and write accesses. Applications can perform this type of accesses with a variety
    //      of different system calls: read and write, optimized system calls such as
    //      copy_file_range and sendfile, as well as asynchronous I/O system call families such as
    //      the ones provided by aio and io_uring.
    //      Instead of monitoring every system call, we opt to hook into the
    //      security_file_permission hook, which is a common execution point for all the above
    //      system calls.
    //
    //  (2) file accesses via mapping them directly into their virtual address space. Since it is
    //      difficult to catch the accesses themselves in this case, our policy will instead
    //      monitor the point when the files are mapped into the application’s virtual memory.
    //      To do so, we use the security_mmap_file hook.
    //
    //  (3) usage a family of system calls (e.g,. truncate) that allow to indirectly modify the
    //      contents of the file by changing its size.
    //      To do so, we will hook into security_path_truncate.
    //
    // for files in /etc.
    //
    // TODO : Use inode-based File Integrity Monitoring (FIM) and narrow down the scope to
    //        extremely important files only (like /etc/passwd).
    //        REFERENCE : https://isovalent.com/blog/post/file-monitoring-with-ebpf-and-tetragon-part-1/.
    fileAccesses: {} @fetchAndMergeYAML("https://raw.githubusercontent.com/cilium/tetragon/main/examples/tracingpolicy/filename_monitoring_filtered.yaml")
  }
}
