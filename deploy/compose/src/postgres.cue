package main

import (
	"github.com/archisman-mridha/instagram-clone/deploy/cue.mod/gen/compose:compose"
)

compose.#Project & {
	services: {
		postgres: {
			container_name: "postgres"
			image:          "postgres:alpine"
			environment: [
				"POSTGRES_USER=default",
				"POSTGRES_PASSWORD=XHwjzpbA3d32UGYT",
				"POSTGRES_DB=instagram_clone",
			]
			hostname: "postgres"
			ports: [
				"5432:5432",
			]
		}

		"postgres-migrator": {
			container_name: "postgres-migrator"
			image:          "migrate/migrate:latest"
			volumes: [
				"../../../backend/microservices/users/internal/adapters/repositories/users/schema.sql:/migrations/000001_users_table_init.up.sql:ro",
				"../../../backend/microservices/profiles/internal/adapters/repositories/profiles/schema.sql:/migrations/000002_profiles_table_init.up.sql:ro",
			]
			command: [
				"-path",
				"/migrations",
				"-database",
				"postgres://default:XHwjzpbA3d32UGYT@postgres:5432/instagram_clone?sslmode=disable",
				"up",
			]
			depends_on: [
				"postgres",
			]
			restart: "on-failure"
		}
	}
}
