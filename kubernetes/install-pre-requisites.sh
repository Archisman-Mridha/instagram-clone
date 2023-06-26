# Cloudnative-pg operator
kubectl apply -f \
  https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.20/releases/cnpg-1.20.1.yaml

# Atlas Operator
helm install atlas-operator oci://ghcr.io/ariga/charts/atlas-operator