#!/bin/bash
set +e  # Continue on errors

# Setup go workspace
if [ ! -f ./go.work ]; then
  echo 📦 setting up go workspace
  go work init && \
    go work use ./backend/services/authentication && \
    go work use ./backend/proto/generated
fi

echo ⏰ downloading go modules
cd ./backend/proto/generated && \
  go mod download
cd ../../services/authentication && \
  go mod download

# Open shell
bash --norc
