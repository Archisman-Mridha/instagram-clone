package main

import (
	"github.com/archisman-mridha/instagram-clone/deploy/cue.mod/gen/compose:compose"
)

compose.#Project & {
	name:    "instagram-clone"

	networks: "instagram-clone": {
		name: "instagram-clone"
	}

	services: {}
}
