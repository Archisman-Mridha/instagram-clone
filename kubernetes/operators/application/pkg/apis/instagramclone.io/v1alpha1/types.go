package v1alpha1

import (
	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type (
	// +genclient
	// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object
	Application struct {
		metav1.TypeMeta 		 `json:",inline"`
		metav1.ObjectMeta 	 `json:"metadata,omitempty"`

		Spec ApplicationSpec `json:"spec,omitempty"`
	}

	// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object
	ApplicationList struct {
		metav1.TypeMeta 		`json:",inline"`
		metav1.ListMeta 		`json:"metadata,omitempty"`

		Items []Application `json:"items,omitempty"`
	}

	ApplicationSpec struct {
		// Container image.
		Image string `json:"image,omitempty"`

		Replicas ReplicasSpec `json:"replicas,omitempty"`

		Resources v1.ResourceList `json:"resources,omitempty"`

		// gRPC server port to be exposed by each container.
		Port int32 `json:"port,omitempty"`

		// Name of the Kubernetes Secret that the developer needs to create. It must contain all the
		// environment variables required by each container. Those environment variables will be mounted
		// to each container.
		SecretName string `json:"secretName,omitempty"`
	}

	ReplicasSpec struct {
		Min int32 `json:"min,omitempty"`
		Max int32 `json:"max,omitempty"`
	}
)