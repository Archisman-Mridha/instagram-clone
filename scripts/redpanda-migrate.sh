#! /bin/sh

set -o verbose
set -o errexit
set -o nounset # Causes the shell to treat unset variables as errors and exit immediately.

PROTOBUF_SCHEMAS_DIR="/etc/redpanda/schemas/protobuf"

sleep infinity

# Register Protobuf schemas with the Schema Registry.
# For each type of microservice event, we have a corresponding Protobuf schema file in
# /etc/redpanda/schemas/protobuf/. The Protobuf schema file name is used as the schema name.
for protobuf_schema_file in "$PROTOBUF_SCHEMAS_DIR"/*.proto; do
	schema_name=$(basename "$protobuf_schema_file" .proto)

	rpk registry schema create "$schema_name" \
		--config /etc/redpanda/redpanda.yaml \
		--schema "$protobuf_schema_file" \
		--type protobuf
done
