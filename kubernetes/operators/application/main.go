package main

import (
	"flag"
	"path/filepath"
	"time"

	"github.com/charmbracelet/log"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"

	"github.com/Archisman-Mridha/instagram-clone/kubernetes/operators/application/pkg/controller"
	clientset "github.com/Archisman-Mridha/instagram-clone/kubernetes/operators/application/pkg/generated/clientset/versioned"
	informers "github.com/Archisman-Mridha/instagram-clone/kubernetes/operators/application/pkg/generated/informers/externalversions"
)

func main() {
	var kubeconfigFilepath *string
	if homeDir := homedir.HomeDir(); homeDir != "" {
		kubeconfigFilepath = flag.String("kubeconfig", filepath.Join(homeDir, ".kube", "config"), "(optional) absolute path to the kubeconfig file")
	} else {
		kubeconfigFilepath = flag.String("kubeconfig", "", "absolute path to the kubeconfig file")
	}

	flag.Parse()

	kubeconfig, err := clientcmd.BuildConfigFromFlags("", *kubeconfigFilepath)
	if err != nil {
		log.Errorf("Error building kubeconfig : %v", err)

		log.Info("Trying to build kubeconfig from in-cluster config")
		// In-cluster configuration allows applications running in a pod to automatically connect to the
		// Kubernetes API using the service account (mounted on the pod) credentials and API server
		// endpoint information injected by the cluster.
		if kubeconfig, err = rest.InClusterConfig(); err != nil {
			log.Fatalf("Error building kubeconfig from in-cluster config : %v", err)
		}
	}

	ctx := setupGracefullShutdownHandler()

	kubeclient, err := kubernetes.NewForConfig(kubeconfig)
	if err != nil {
		log.Errorf("Error creating Kubernetes API server client : %v", err)
	}

	clientset, err := clientset.NewForConfig(kubeconfig)
	if err != nil {
		log.Errorf("Error creating Kubernetes API server client (for Application resource type) : %v", err)
	}

	informerFactory := informers.NewSharedInformerFactory(clientset, 20*time.Second)
	informer := informerFactory.Instagramclone().V1alpha1().Applications()

	controller := controller.NewController(kubeclient, clientset, informer)

	informerFactory.Start(ctx.Done())

	if err := controller.Run(ctx); err != nil {
		log.Errorf("Error running controller : %v", err)
	}
}
