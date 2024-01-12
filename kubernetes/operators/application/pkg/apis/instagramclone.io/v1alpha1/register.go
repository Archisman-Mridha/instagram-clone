package v1alpha1

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
)

var (
	SchemeGroupVersion = schema.GroupVersion{
		Group:   "instagramclone.io",
		Version: "v1alpha1",
	}

	SchemeBuilder runtime.SchemeBuilder
	AddToScheme   = SchemeBuilder.AddToScheme
)

func Resource(resource string) schema.GroupResource {
	return SchemeGroupVersion.WithResource(resource).GroupResource()
}

func init() {
	// Registering the custom resource types with the Kubernetes API server.
	SchemeBuilder.Register(
		func(s *runtime.Scheme) error {
			s.AddKnownTypes(SchemeGroupVersion, &Application{}, &ApplicationList{})
			metav1.AddToGroupVersion(s, SchemeGroupVersion)

			return nil
		},
	)
}
