#!/bin/sh

# This script will be executed inside the 'debezium-migrate' container defined in ./compose.yaml.

apk add curl

echo ⏳ Waiting for Debezium to start...
until curl --output /dev/null --silent --head --fail http://debezium:8083; do
	echo .
	sleep 5
done

echo "🚀 Debezium is up! Creating connectors..."

for file in "/debezium/"*; do
	if [ -f "$file" ]; then
		curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" http://debezium:8083/connectors/ \
			-d "$(cat "$file")"

		sleep 10
	fi
done

echo "✅ Debezium connectors created successfully."
