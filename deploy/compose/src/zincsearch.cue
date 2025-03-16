package main

import (
	"github.com/archisman-mridha/instagram-clone/deploy/cue.mod/gen/compose:compose"
)

compose.#Project & {
	services: {
    zincsearch: {
      container_name: "zincsearch"
      image:          "public.ecr.aws/zinclabs/zincsearch:latest"
			hostname:       "zincsearch"
			environment: [
        "ZINC_FIRST_ADMIN_USER=admin",
        "ZINC_FIRST_ADMIN_PASSWORD=XHwjzpbA3d32UGYT"
			]
			ports: [
        "4080:4080"
			]
    }
  }
}
