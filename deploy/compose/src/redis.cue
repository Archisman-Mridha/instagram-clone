package main

import (
	"github.com/archisman-mridha/instagram-clone/cue.mod/gen/compose:compose"
)

compose.#Project & {
	services: {
		dragonfly: {
			container_name: "dragonfly"
			image:          "docker.dragonflydb.io/dragonflydb/dragonfly"
			hostname:       "dragonfly"
			environment: [
				"REDIS_PASSWORD=XHwjzpbA3d32UGYT",
			]
			ports: [
				"6379:6379",
			]
		}
	}
}
