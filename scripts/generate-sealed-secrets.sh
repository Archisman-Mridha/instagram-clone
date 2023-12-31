#!/bin/bash

find "./kubernetes/" -type f \( -name "*.secret.yaml" -o -name "secret.yaml" \) -print0 | while IFS= read -r -d '' filepath; do

  secretFilename=$(basename "$filepath")

  if [ "$secretFilename" == "secret.yaml" ]; then
    sealedSecretFilename="$(dirname $filepath)/sealed-secret.yaml"
  else
    sealedSecretFilename="${filepath%.secret.yaml}.sealed-secret.yaml"
  fi

  kubeseal \
    --cert ./cloud/modules/prepare-cluster/sealed-secrets.crt \
    --scope cluster-wide -o yaml \
    <"$filepath" >"$sealedSecretFilename"

done