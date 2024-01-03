## The Kubernetes Dashboard

You can access the Kubernetes dashboard at *http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/*, after running these commands :-
```sh
# Generate a JWT for the ServiceAccount, using the Kubernetes TokenRequest API
kubectl -n kubernetes-dashboard create token cluster-admin

# The proxy provides a secure connection between the cluster (API Server) and the client.
kubectl proxy
```