package main

import (
	"github.com/archisman-mridha/instagram-clone/deploy/cue.mod/gen/compose:compose"
)

compose.#Project & {
	services: {
    "redpanda-node-0": {
      container_name: "redpanda-node-0"
      image:          "docker.redpanda.com/redpandadata/redpanda:v24.3.6"
			hostname:       "redpanda-node-0"
			command: [
        "redpanda",
        "start",

        "--kafka-addr internal://0.0.0.0:9092,external://0.0.0.0:19092",
        //
        // Address the broker advertises to clients that connect to the Kafka API.
        //
        // (1) Use the internal addresses to connect to the Redpanda brokers' from inside the same
        //     Docker network.
        //
        // (2) Use the external addresses to connect to the Redpanda brokers' from outside the
        //     Docker network.
        "--advertise-kafka-addr internal://redpanda-node-0:9092,external://localhost:19092",

        "--pandaproxy-addr internal://0.0.0.0:8082,external://0.0.0.0:18082",
        //
        // Address the broker advertises to clients that connect to the HTTP Proxy.
        "--advertise-pandaproxy-addr internal://redpanda-node-0:8082,external://localhost:18082",

        "--schema-registry-addr internal://0.0.0.0:8081,external://0.0.0.0:18081",

        // Redpanda brokers use the RPC API to communicate with each other internally.
        "--rpc-addr redpanda-node-0:33145",
        "--advertise-rpc-addr redpanda-node-0:33145",

        // Mode dev-container uses well-known configuration properties for development in
        // containers.
        // NOTE : Topic auto-creation is enabled in this mode.
        "--mode dev-container",
        // Tells Seastar (the framework Redpanda uses under the hood) to use 1 core on the system.
        "--smp 1",
        "--default-log-level=info",
			]
			ports: [
        "19092:19092", // Kafka clients.
        "18082:18082", // Redpanda HTTP proxy.
        "18081:18081", // Redpanda schema registry.
        "19644:9644"   // Redpanda Admin API (related to Redpanda Console).
			]
    }

    "redpanda-migrator": {
      container_name: "redpanda-migrator"
      image: "docker.redpanda.com/redpandadata/redpanda:v24.3.6"
      volumes: [
        "../configs/redpanda/migrator.config.yaml:/etc/redpanda/redpanda.yaml:ro",
        "../../../backend/shared/pkg/events/proto/:/etc/redpanda/schemas/protobuf/:ro",
        "../../../scripts/redpanda-migrate.sh:/redpanda-migrate.sh"
      ]
      entrypoint: [
        "/bin/bash", "-c"
      ]
      command: [
        "chmod +x /redpanda-migrate.sh && /redpanda-migrate.sh",
      ]
      depends_on: [
        "redpanda-node-0"
      ]
      restart: "on-failure"
    }

    "redpanda-console": {
      container_name: "redpanda-console"
      image:          "docker.redpanda.com/redpandadata/console:v2.8.4"
      environment: [
        "CONFIG_FILEPATH=/etc/redpanda/console.config.yaml"
      ]
      volumes: [
        "../configs/redpanda/console.config.yaml:/etc/redpanda/console.config.yaml"
      ]
			hostname: "redpanda-console"
			ports: [
        "8080:8080"
      ]
      depends_on: [
        "redpanda-node-0"
      ]
    }
  }
}
