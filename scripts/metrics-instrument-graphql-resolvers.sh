#!/bin/bash

file=./backend/gateway/generated/graphql/schema.resolvers.go

# Use awk to add "//autometrics:inst" comment above lines starting with "func (r *mutationResolver)"
awk \
	'/^func \(r \*mutationResolver\)/ { if (!found) { print "//autometrics:inst"; found=1 } } !/^func \(r \*mutationResolver\)/ { found=0 } 1' \
	"$file" > temp_file && \
	mv temp_file "$file"

# Use awk to add "//autometrics:inst" comment above lines starting with "func (r *queryResolver)"
awk \
	'/^func \(r \*queryResolver\)/ { if (!found) { print "//autometrics:inst"; found=1 } } !/^func \(r \*queryResolver\)/ { found=0 } 1' \
	"$file" > temp_file && \
	mv temp_file "$file"

cd ./backend/gateway/generated/graphql && \
	 autometrics -f schema.resolvers.go --prom_url http://prometheus:9090 -m graphql_generated --no-doc