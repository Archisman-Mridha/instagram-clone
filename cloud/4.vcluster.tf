/*
	// Kubernetes cluster nodepool dedicated to the dev environment.
	resource "digitalocean_kubernetes_node_pool" "dev_env" {
		cluster_id = digitalocean_kubernetes_cluster.default.id

		name = "dev-env"

		node_count = 2

		size = "s-2vcpu-2gb-amd" // 2 GB RAM
														// 2 AMD CPUs
														// 60GB NVMe SSD as the boot disk.

		labels = {
			"env" = "dev"
		}

		taint {
			key = "env"
			value = "dev"

			effect = "NoExecute"
		}
	}
*/

/*
	// Install VCluster and create a virtual cluster which will act as the dev environment.
	resource "helm_release" "vcluster" {

		// Compared to real clusters, virtual clusters do not have their own node pools or networking.
		// Instead, they are scheduling workloads inside the underlying cluster while having their own
		// control plane.
		// VCluster runs on top of the host cluster in a single pod that contains 2 containers - the
		// Control Plane and the Syncer. Higher level Kubernetes objects such as Deployments and CRDs
		// reside inside the VCluster, whereas lower level resources like Pods are replicated to the
		// underlying host namespace. Scheduler of the host cluster then schedules those pods (this is
		// called synchronization).

		name = "vcluster"

		namespace = "vcluster"
		create_namespace = true

		repository = "https://charts.loft.sh"
		chart = "vcluster"
		version = "0.16.4"

		values = [file("./vcluster.values.yaml")]

		wait = true

		depends_on = [ digitalocean_kubernetes_cluster.default ]
	}
*/