package main

import (
	"github.com/archisman-mridha/instagram-clone/cue.mod/gen/compose:compose"
)

compose.#Project & {
	services: {
    openobserve: {
      container_name: "openobserve"
      image: "openobserve/openobserve:v0.14.4"
      environment: [
        "ZO_ROOT_USER_EMAIL=archismanmridha12345@gmail.com",
        "ZO_ROOT_USER_PASSWORD=XHwjzpbA3d32UGYT"
      ]
      hostname: "openobserve"
      ports: [
        "5080:5080"
      ]
    }

    "opentelemetry-collector": {
      container_name: "opentelemetry-collector"
      image: "otel/opentelemetry-collector:0.120.0"
      volumes: [
        "../configs/opentelemetry-collector.config.yaml:/etc/opentelemetry-collector.config.yaml"
      ]
      command: [
        "--config=/etc/opentelemetry-collector.config.yaml"
      ]
      hostname: "opentelemetry-collector"
      ports: [
        "4317:4317" // gRPC endpoint.
      ]
      depends_on: ["openobserve"]
    }
  }
}
