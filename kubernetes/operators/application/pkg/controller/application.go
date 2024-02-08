package controller

import (
	"context"
	"fmt"
	"time"

	"github.com/charmbracelet/log"
	appsV1 "k8s.io/api/apps/v1"
	autoscalingV2 "k8s.io/api/autoscaling/v2"
	coreV1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
	"k8s.io/apimachinery/pkg/util/runtime"
	"k8s.io/apimachinery/pkg/util/wait"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/kubernetes/scheme"
	typedCoreV1 "k8s.io/client-go/kubernetes/typed/core/v1"
	"k8s.io/client-go/tools/cache"
	"k8s.io/client-go/tools/record"
	"k8s.io/client-go/util/workqueue"

	"github.com/Archisman-Mridha/instagram-clone/kubernetes/operators/application/pkg/apis/instagramclone.io/v1alpha1"
	clientset "github.com/Archisman-Mridha/instagram-clone/kubernetes/operators/application/pkg/generated/clientset/versioned"
	applicationScheme "github.com/Archisman-Mridha/instagram-clone/kubernetes/operators/application/pkg/generated/clientset/versioned/scheme"
	informer "github.com/Archisman-Mridha/instagram-clone/kubernetes/operators/application/pkg/generated/informers/externalversions/instagramclone.io/v1alpha1"
	lister "github.com/Archisman-Mridha/instagram-clone/kubernetes/operators/application/pkg/generated/listers/instagramclone.io/v1alpha1"
)

const (
	CREATE_OPERATION = iota
	UPDATE_OPERATION
	DELETE_OPERATION
)

type (
	Controller struct {
		name string

		// kubeclient is the Kubernetes API server client.
		kubeclient *kubernetes.Clientset

		/*
			NOTE

			1. Clientset abstracts the low-level HTTP communication with the API server for CRUD operations
			regarding the Custom Resource.

			2. Listers are utility components used to cache and index Kubernetes resources, making it faster
			and more efficient to retrieve and filter resources from the cluster. Listers maintain an
			up-to-date local cache of the desired resources and provide methods for querying and filtering
			those resources. This helps reduce the load on the Kubernetes API server.

			3. Informers are built on top of listers and are responsible for watching changes to resources
			in the cluster. They continuously synchronize the local cache with the cluster state.
		*/
		clientset         clientset.Interface
		applicationLister lister.ApplicationLister
		// informerSynced is a function that can be used to determine if the informer has synced the
		// lister cache.
		informerSynced cache.InformerSynced

		// The controller watches instagramclone.io/Application type objects in the Kubernetes cluster.
		// When an event, such as resource creation, update, or deletion, occurs regarding the object, the
		// controller generates an event or task. Those events are enqueued into this work-queue. The
		// work-queue processes events in a controlled and rate-limited manner.
		workQueue workqueue.RateLimitingInterface

		eventRecorder record.EventRecorder
	}

	Operation struct {
		_type int
		key   string
	}
)

// NewController returns a new instance of the Controller.
func NewController(kubeclient *kubernetes.Clientset, clientset clientset.Interface, informer informer.ApplicationInformer) *Controller {
	runtime.Must(applicationScheme.AddToScheme(scheme.Scheme))

	// An event broadcaster can broadcast events to multiple sinks like API server and standard log.
	eventBroadcaster := record.NewBroadcaster()
	// This starts recording events to the API server event sink. It uses the CoreV1 client to send
	// events to the /events endpoint of the related Application resource.
	eventBroadcaster.StartRecordingToSink(&typedCoreV1.EventSinkImpl{
		Interface: kubeclient.CoreV1().Events(""),
	})

	controller := &Controller{
		name: "application-controller",

		kubeclient: kubeclient,

		clientset:         clientset,
		applicationLister: informer.Lister(),
		informerSynced:    informer.Informer().HasSynced,

		workQueue: workqueue.NewNamedRateLimitingQueue(workqueue.DefaultControllerRateLimiter(), "application"),

		eventRecorder: eventBroadcaster.NewRecorder(scheme.Scheme, coreV1.EventSource{Component: "Application"}),
	}

	log.Info("Setting up event handlers in informer factory")
	informer.Informer().AddEventHandler(cache.ResourceEventHandlerFuncs{
		AddFunc:    controller.handleObjectAdded,
		UpdateFunc: controller.handleObjectUpdated,
		DeleteFunc: controller.handleObjectDeleted,
	})

	return controller
}

// handleObjectAdded is invoked when an Application object is created in the cluster. It takes the
// Application object, constructs its 'namespace/name' key and puts the key into the work queue.
func (c *Controller) handleObjectAdded(obj interface{}) {
	key, err := cache.MetaNamespaceKeyFunc(obj)
	if err != nil {
		runtime.HandleError(err)
		return
	}

	c.workQueue.Add(Operation{
		_type: CREATE_OPERATION,
		key:   key,
	})
}

func (c *Controller) handleObjectUpdated(oldObj interface{}, newObj interface{}) {
	if oldObj == newObj {
		return
	}

	key, err := cache.MetaNamespaceKeyFunc(newObj)
	if err != nil {
		runtime.HandleError(err)
		return
	}

	c.workQueue.Add(Operation{
		_type: UPDATE_OPERATION,
		key:   key,
	})
}

// handleObjectDeleted is invoked when an Application object is deleted from the cluster. It adds
// the object to the work-queue.
func (c *Controller) handleObjectDeleted(obj interface{}) {
	key, err := cache.MetaNamespaceKeyFunc(obj)
	if err != nil {
		runtime.HandleError(err)
		return
	}

	c.workQueue.Add(Operation{
		_type: DELETE_OPERATION,
		key:   key,
	})
}

// Run will set up the event handlers for types we are interested in, as well as syncing informer
// caches and starting workers. It will block until stopCh (in the informerFactory) is closed, at
// which point it will shutdown the workqueue and wait for workers to finish processing their
// current work items.
func (c *Controller) Run(ctx context.Context) error {
	log.Info("Starting Application controller")

	defer runtime.HandleCrash()
	defer c.workQueue.ShutDown()

	// Start the informer factory to begin populating the informer cache. Wait for the cache to be
	// synced before starting any workers.
	log.Info("Waiting for informer caches to sync")
	if ok := cache.WaitForCacheSync(ctx.Done(), c.informerSynced); !ok {
		return fmt.Errorf("failed waiting for informer cache to sync")
	}

	// Launch a worker to process Application resources.
	log.Info("Starting worker to process Application resources")
	go wait.UntilWithContext(ctx, c.processWorkQueueItems, time.Second)
	log.Info("Worker started")

	<-ctx.Done()
	log.Info("Shutting down worker")
	return nil
}

// processWorkQueueItems is a long-running method that will continually call the
// processNextWorkQueueItem function in order to read and process an event int the work-queue.
func (c *Controller) processWorkQueueItems(ctx context.Context) {
	for c.processNextWorkQueueItem(ctx) {
	}
}

// processNextWorkQueueItem will read a single work item off the work-queue and attempt to process
// it, by calling the syncHandler method.
func (c *Controller) processNextWorkQueueItem(ctx context.Context) bool {
	obj, shutdown := c.workQueue.Get()
	if shutdown {
		return false
	}

	err := func(obj interface{}) error {
		// We call Done here so the workqueue knows we have finished processing this item. We also must
		// remember to call Forget if we do not want this work item being re-queued. For example, we do
		// not call Forget if a transient error occurs, instead the item is put back on the workqueue
		// and attempted again after a back-off period.
		defer c.workQueue.Done(obj)

		operation, ok := obj.(Operation)
		if !ok {
			c.workQueue.Forget(obj)
			runtime.HandleError(fmt.Errorf("expected object of type 'Operation' in workqueue but got %#v", obj))
			return nil
		}

		if err := c.syncHandler(ctx, operation); err != nil {
			// Put the item back in the work-queue to handle any transient errors.
			c.workQueue.AddRateLimited(operation)
			return fmt.Errorf("error syncing '%s': %s, requeuing", operation.key, err.Error())
		}

		c.workQueue.Forget(obj)
		log.Infof("Successfully synced Application resource with key %s", operation.key)
		return nil
	}(obj)

	if err != nil {
		runtime.HandleError(err)
	}

	return true
}

// syncHandler compares the actual state with the desired (for an Application resource), and
// attempts to converge the two.
func (c *Controller) syncHandler(ctx context.Context, operation Operation) error {
	key := operation.key
	logger := log.With("resourceKey", key)

	namespace, name, err := cache.SplitMetaNamespaceKey(key)
	if err != nil {
		runtime.HandleError(fmt.Errorf("invalid resource key: %s", key))
		return nil
	}

	switch operation._type {
	// If the Application resource is deleted.
	case DELETE_OPERATION:
		{
			if err := c.kubeclient.AppsV1().Deployments(namespace).Delete(ctx, name, metav1.DeleteOptions{}); err != nil {
				logger.Errorf("Error deleting Kubernetes Deployment : %v", err)
				return err
			}
			logger.Info("Successfully deleted Kubernetes Deployment")

			if err := c.kubeclient.AutoscalingV2().HorizontalPodAutoscalers(namespace).Delete(ctx, name, metav1.DeleteOptions{}); err != nil {
				logger.Errorf("Error deleting Kubernetes Horizontal Pod Autoscaler : %v", err)
				return err
			}
			logger.Info("Successfully deleted Kubernetes Horizontal Pod Autoscaler")

			if err := c.kubeclient.CoreV1().Services(namespace).Delete(ctx, name, metav1.DeleteOptions{}); err != nil {
				logger.Errorf("Error deleting Kubernetes Service : %v", err)
				return err
			}
			logger.Info("Successfully deleted Kubernetes Service")

			return nil
		}

	// If the Application resource is created / updated.
	default:
		{
			var application *v1alpha1.Application
			if application, err = c.applicationLister.Applications(namespace).Get(name); err != nil {
				return err
			}

			update := operation._type == UPDATE_OPERATION

			var operationName string
			if operation._type == UPDATE_OPERATION {
				operationName = "update"
			} else {
				operationName = "create"
			}

			// Create / update Kubernetes Deployment, Service and Horizontal Pod Autoscaler.

			if err := c.createOrUpdateDeployment(ctx, application, update); err != nil {
				logger.Errorf("Error trying to %s Kubernetes Deployment : %v", operationName, err)
				c.eventRecorder.Event(application, coreV1.EventTypeWarning, err.Error(), fmt.Sprintf("Error trying to %s Kubernetes Deployment", operationName))
				return err
			}
			logger.Infof("Succeeded to %s Kubernetes Deployment", operationName)
			c.eventRecorder.Event(application, coreV1.EventTypeNormal, "", fmt.Sprintf("Succeeded to %s Kubernetes Deployment", operationName))

			if err := c.createOrUpdateHpa(ctx, application, update); err != nil {
				logger.Errorf("Error trying to %s Horizontal Pod Autoscaler : %v", operationName, err)
				c.eventRecorder.Event(application, coreV1.EventTypeWarning, err.Error(), fmt.Sprintf("Error trying to %s Horizontal Pod Autoscaler", operationName))
				return err
			}
			logger.Infof("Succeeded to %s Horizontal Pod Autoscaler", operationName)
			c.eventRecorder.Event(application, coreV1.EventTypeNormal, "", fmt.Sprintf("Succeeded to %s Horizontal Pod Autoscaler", operationName))

			if err := c.createOrUpdateService(ctx, application, update); err != nil {
				logger.Errorf("Error trying to %s Kubernetes Service : %v", operationName, err)
				c.eventRecorder.Event(application, coreV1.EventTypeWarning, err.Error(), fmt.Sprintf("Error trying to %s Kubernetes Service", operationName))
				return err
			}
			logger.Infof("Succeeded to %s Kubernetes Service", operationName)
			c.eventRecorder.Event(application, coreV1.EventTypeNormal, "", fmt.Sprintf("Succeeded to %s Kubernetes Service", operationName))
		}
	}

	return nil
}

// createOrUpdateDeployment creates / updates the Kubernetes Deployment for an Application resource.
func (c *Controller) createOrUpdateDeployment(ctx context.Context, application *v1alpha1.Application, update bool) error {
	name := application.Name
	namespace := application.Namespace

	podTemplateSpecObject := coreV1.PodTemplateSpec{
		ObjectMeta: metav1.ObjectMeta{
			Labels: map[string]string{
				"app":                          name,
				"app.kubernetes.io/instance":   name,
				"app.kubernetes.io/part-of":    name,
				"app.kubernetes.io/managed-by": c.name,
			},
		},

		Spec: coreV1.PodSpec{
			Containers: []coreV1.Container{
				{
					Name: name,

					Image:           application.Spec.Image,
					ImagePullPolicy: coreV1.PullIfNotPresent,

					Resources: coreV1.ResourceRequirements{
						Requests: application.Spec.Resources,
						Limits:   application.Spec.Resources,
					},

					EnvFrom: []coreV1.EnvFromSource{
						{
							SecretRef: &coreV1.SecretEnvSource{
								LocalObjectReference: coreV1.LocalObjectReference{
									Name: application.Spec.SecretName,
								},
							},
						},
					},

					Ports: application.Spec.Ports,
				},
			},
		},
	}

	deploymentObject := &appsV1.Deployment{

		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: namespace,
			Labels: map[string]string{
				"app":                          name,
				"app.kubernetes.io/instance":   name,
				"app.kubernetes.io/part-of":    name,
				"app.kubernetes.io/managed-by": c.name,
			},
		},

		Spec: appsV1.DeploymentSpec{
			Replicas: &application.Spec.Replicas.Min,

			// The rolling update ensures that the application remains available throughout the update
			// process by gradually replacing old pods with new ones, without causing downtime.
			Strategy: appsV1.DeploymentStrategy{
				Type: appsV1.RollingUpdateDeploymentStrategyType,
				RollingUpdate: &appsV1.RollingUpdateDeployment{

					// Maximum number of pods that can be unavailable during the update.
					MaxUnavailable: &intstr.IntOrString{
						Type:   intstr.Int,
						IntVal: application.Spec.Replicas.Max - application.Spec.Replicas.Min,
					},
				},
			},

			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{
					"app": name,
				},
			},

			Template: podTemplateSpecObject,
		},
	}

	deployments := c.kubeclient.AppsV1().Deployments(namespace)

	var err error
	if update {
		_, err = deployments.Update(ctx, deploymentObject, metav1.UpdateOptions{})
	} else {
		_, err = deployments.Create(ctx, deploymentObject, metav1.CreateOptions{})
	}
	return err
}

// createOrUpdateHpa creates / updates the Kubernetes Horizontal Pod Autoscaler for an Application
// resource.
func (c *Controller) createOrUpdateHpa(ctx context.Context, application *v1alpha1.Application, update bool) error {
	var (
		name      = application.Name
		namespace = application.Namespace

		averageCpuUtilization    int32 = 80
		averageMemoryUtilization int32 = 80
	)

	hpaObject := &autoscalingV2.HorizontalPodAutoscaler{

		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: namespace,
			Labels: map[string]string{
				"app":                          name,
				"app.kubernetes.io/instance":   name,
				"app.kubernetes.io/part-of":    name,
				"app.kubernetes.io/managed-by": c.name,
			},
		},

		Spec: autoscalingV2.HorizontalPodAutoscalerSpec{

			ScaleTargetRef: autoscalingV2.CrossVersionObjectReference{
				APIVersion: "apps/v1",
				Kind:       "Deployments",
				Name:       name,
			},

			MinReplicas: &application.Spec.Replicas.Min,
			MaxReplicas: application.Spec.Replicas.Max,

			Metrics: []autoscalingV2.MetricSpec{
				{
					Type: autoscalingV2.ResourceMetricSourceType,
					Resource: &autoscalingV2.ResourceMetricSource{
						Name: "cpu",
						Target: autoscalingV2.MetricTarget{
							Type:               autoscalingV2.UtilizationMetricType,
							AverageUtilization: &averageCpuUtilization,
						},
					},
				},
				{
					Type: autoscalingV2.ResourceMetricSourceType,
					Resource: &autoscalingV2.ResourceMetricSource{
						Name: "memory",
						Target: autoscalingV2.MetricTarget{
							Type:               autoscalingV2.UtilizationMetricType,
							AverageUtilization: &averageMemoryUtilization,
						},
					},
				},
			},
		},
	}

	hpas := c.kubeclient.AutoscalingV2().HorizontalPodAutoscalers(namespace)

	var err error
	if update {
		_, err = hpas.Update(ctx, hpaObject, metav1.UpdateOptions{})
	} else {
		_, err = hpas.Create(ctx, hpaObject, metav1.CreateOptions{})
	}
	return err
}

// createOrUpdateService creates / updates the Kubernetes Service for an Application resource.
func (c *Controller) createOrUpdateService(ctx context.Context, application *v1alpha1.Application, update bool) error {
	name := application.Name
	namespace := application.Namespace

	var servicePorts []coreV1.ServicePort

	for _, port := range application.Spec.Ports {
		servicePorts = append(servicePorts, coreV1.ServicePort{
			Name:       port.Name,
			Port:       port.ContainerPort,
			TargetPort: intstr.FromInt32(port.ContainerPort),
		})
	}

	serviceObject := &coreV1.Service{

		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: namespace,
			Labels: map[string]string{
				"app":                          name,
				"app.kubernetes.io/instance":   name,
				"app.kubernetes.io/part-of":    name,
				"app.kubernetes.io/managed-by": c.name,
			},
		},

		Spec: coreV1.ServiceSpec{
			Selector: map[string]string{
				"app": name,
			},

			Ports: servicePorts,
		},
	}

	services := c.kubeclient.CoreV1().Services(namespace)

	var err error
	if update {
		_, err = services.Update(ctx, serviceObject, metav1.UpdateOptions{})
	} else {
		_, err = services.Create(ctx, serviceObject, metav1.CreateOptions{})
	}
	return err
}
