package main

import (
	"github.com/archisman-mridha/instagram-clone/cue.mod/gen/compose:compose"
)

compose.#Project & {
	name:    "instagram-clone"
	version: "3"

	networks: "instagram-clone": {
		name: "instagram-clone"
	}

	services: {}
}
