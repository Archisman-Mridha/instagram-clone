#!/bin/bash

cd kubernetes/operators/application

go mod tidy
go mod vendor

chmod +x hack/update-codegen.sh
chmod +x vendor/k8s.io/code-generator/generate-internal-groups.sh
chmod +x vendor/k8s.io/code-generator/generate-groups.sh

rm -rf pkg/generated
# Generate Clientsets, Listers, Informers and Deepcopy functions (for deepcopying GoLang structs).
#
# 1. Clientsets - abstract the low-level HTTP communication with the API server for CRUD operations
#                 regarding the Custom Resource.
#
# 2. Listers - utility components used to cache and index Kubernetes resources, making it faster
#              and more efficient to retrieve and filter resources from the cluster. Listers
#              maintain an up-to-date local cache of the desired resources and provide methods for
#              querying and filtering those resources. This helps reduce the load on the Kubernetes
#              API server.
#
# 3. Informers - are built on top of listers and are responsible for watching changes to resources
#                in the cluster. They continuously synchronize the local cache with the cluster state.
hack/update-codegen.sh
mv github.com/Archisman-Mridha/instagram-clone/kubernetes/operators/application/pkg/apis/instagramclone.io/v1alpha1/zz_generated.deepcopy.go pkg/apis/instagramclone.io/v1alpha1/
mv github.com/Archisman-Mridha/instagram-clone/kubernetes/operators/application/pkg/generated pkg/generated

rm -rf github.com vendor

go mod tidy

# Generate Crds using controller-gen.
# You can install controller-gen by running this command -
# go install sigs.k8s.io/controller-tools/cmd/controller-gen@latest.
controller-gen \
	paths=github.com/Archisman-Mridha/instagram-clone/kubernetes/operators/application/pkg/apis/instagramclone.io/v1alpha1 \
	crd:crdVersions=v1 \
	output:crd:artifacts:config=manifests

cp manifests/instagramclone.io_applications.yaml ../../manifests/application-controller
