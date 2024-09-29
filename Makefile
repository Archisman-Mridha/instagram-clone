tanka-export:
	rm -rf ./kubernetes/outputs/
	cd ./kubernetes && \
		tk export ./outputs/ ./environments/ \
			--recursive \
			--format "{{env.metadata.name}}/{{default (printf \"uncategorized/%s\" .metadata.namespace) (index .metadata.labels \"app.kubernetes.io/part-of\")}}/{{default \"\" (index .metadata.labels \"app.kubernetes.io/component\")}}/{{.kind}}__{{.metadata.name}}"
