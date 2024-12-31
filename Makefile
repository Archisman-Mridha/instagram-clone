tanka-export:
	rm -rf ./kubernetes/outputs/
	cd ./kubernetes && \
		tk export ./outputs/ ./environments/ \
			--recursive \
			--format "{{env.metadata.name}}/{{.metadata.labels.tool}}/{{default \"\" (index .metadata.labels \"app.kubernetes.io/component\")}}/{{.kind}}__{{.metadata.name}}"
