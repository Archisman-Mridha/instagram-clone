#!/bin/bash

find "./kubernetes/" -type f -name "*.secret.yaml" -print0 | while IFS= read -r -d '' filepath; do
  kubeseal \
    --cert ./terragrunt/modules/setup-cluster/sealed-secrets/tls.crt \
    --scope cluster-wide -o yaml \
    <"$filepath" >"${filepath%.secret.yaml}.sealed-secret.yaml"
done