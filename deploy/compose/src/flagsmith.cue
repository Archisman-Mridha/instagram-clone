package main

import (
	"github.com/archisman-mridha/instagram-clone/deploy/cue.mod/gen/compose:compose"
)

compose.#Project & {
	services: {
    flagsmith: {
      container_name: "flagsmith"
      image: "flagsmith.docker.scarf.sh/flagsmith/flagsmith:latest"
      environment: {
        "TASK_RUN_METHOD": "SYNCHRONOUSLY",

        // You can find documentation for all the Flagsmith API related environment variables here
        // : https://docs.flagsmith.com/deployment/locally-api#environment-variables.
        "DATABASE_URL": "postgres://default:XHwjzpbA3d32UGYT@postgres:5432/instagram_clone?sslmode=disable",
        "DJANGO_ALLOWED_HOSTS": "*",
        "ALLOW_ADMIN_INITIATION_VIA_CLI": "true",
        "FLAGSMITH_DOMAIN": "localhost:8000",
        "DJANGO_SECRET_KEY": "XHwjzpbA3d32UGYT",
        "ENABLE_ADMIN_ACCESS_USER_PASS": "true"

        // You can find documentation for all the Flagsmith UI related environment variables here
        // : https://docs.flagsmith.com/deployment/locally-frontend#environment-variables.
      }
      ports: [
        "8000:8000"
      ]
      depends_on: [
				"postgres"
			]
    }
  }
}
