package compose

import "list"

#Project: {
	// Compose Specification
	//
	// The Compose file is a YAML file defining a multi-containers
	// based application.
	@jsonschema(schema="https://json-schema.org/draft/2019-09/schema")
	close({
		// declared for backward compatibility, ignored.
		version?: string

		// define the Compose project name, until user defines one
		// explicitly.
		name?: string

		// compose sub-projects to be included.
		include?: [...#include]
		services?: close({
			{[=~"^[a-zA-Z0-9._-]+$"]: #service}
		})
		networks?: {
			{[=~"^[a-zA-Z0-9._-]+$"]: #network}
			...
		}
		volumes?: close({
			{[=~"^[a-zA-Z0-9._-]+$"]: #volume}
		})
		secrets?: close({
			{[=~"^[a-zA-Z0-9._-]+$"]: #secret}
		})
		configs?: close({
			{[=~"^[a-zA-Z0-9._-]+$"]: #config}
		})

		{[=~"^x-" & !~"^(version|name|include|services|networks|volumes|secrets|configs)$"]: _}
	})

	#service: close({
		develop?:     #development
		deploy?:      #deployment
		annotations?: #list_or_dict
		attach?:      bool | string
		build?: matchN(1, [string, close({
			context?:           string
			dockerfile?:        string
			dockerfile_inline?: string
			entitlements?: [...string]
			args?:   #list_or_dict
			ssh?:    #list_or_dict
			labels?: #list_or_dict
			cache_from?: [...string]
			cache_to?: [...string]
			no_cache?:            bool | string
			additional_contexts?: #list_or_dict
			network?:             string
			pull?:                bool | string
			target?:              string
			shm_size?:            int | string
			extra_hosts?:         #extra_hosts
			isolation?:           string
			privileged?:          bool | string
			secrets?:             #service_config_or_secret
			tags?: [...string]
			ulimits?: #ulimits
			platforms?: [...string]

			{[=~"^x-" & !~"^(context|dockerfile|dockerfile_inline|entitlements|args|ssh|labels|cache_from|cache_to|no_cache|additional_contexts|network|pull|target|shm_size|extra_hosts|isolation|privileged|secrets|tags|ulimits|platforms)$"]: _}
		})])
		blkio_config?: close({
			device_read_bps?: [...#blkio_limit]
			device_read_iops?: [...#blkio_limit]
			device_write_bps?: [...#blkio_limit]
			device_write_iops?: [...#blkio_limit]
			weight?: int | string
			weight_device?: [...#blkio_weight]
		})
		cap_add?: list.UniqueItems() & [...string]
		cap_drop?: list.UniqueItems() & [...string]
		cgroup?:         "host" | "private"
		cgroup_parent?:  string
		command?:        #command
		configs?:        #service_config_or_secret
		container_name?: string
		cpu_count?: matchN(1, [string, int & >=0])
		cpu_percent?: matchN(1, [string, int & >=0 & <=100])
		cpu_shares?:     number | string
		cpu_quota?:      number | string
		cpu_period?:     number | string
		cpu_rt_period?:  number | string
		cpu_rt_runtime?: number | string
		cpus?:           number | string
		cpuset?:         string
		credential_spec?: close({
			config?:   string
			file?:     string
			registry?: string

			{[=~"^x-" & !~"^(config|file|registry)$"]: _}
		})
		depends_on?: matchN(1, [#list_of_strings, close({
			{[=~"^[a-zA-Z0-9._-]+$"]: close({
				restart?: bool | string, required?: bool | *true, condition!: "service_started" | "service_healthy" | "service_completed_successfully"

				{[=~"^x-" & !~"^(restart|required|condition)$"]: _}
			})
			}
		})])
		device_cgroup_rules?: #list_of_strings
		devices?: [...matchN(1, [string, close({
			source!:      string
			target?:      string
			permissions?: string

			{[=~"^x-" & !~"^(source|target|permissions)$"]: _}
		})])]
		dns?: #string_or_list
		dns_opt?: list.UniqueItems() & [...string]
		dns_search?:  #string_or_list
		domainname?:  string
		entrypoint?:  #command
		env_file?:    #env_file
		label_file?:  #label_file
		environment?: #list_or_dict
		expose?: list.UniqueItems() & [...number | string]
		extends?: matchN(1, [string, close({
			service!: string
			file?:    string
		})])
		external_links?: list.UniqueItems() & [...string]
		extra_hosts?: #extra_hosts
		gpus?:        #gpus
		group_add?: list.UniqueItems() & [...number | string]
		healthcheck?: #healthcheck
		hostname?:    string
		image?:       string
		init?:        bool | string
		ipc?:         string
		isolation?:   string
		labels?:      #list_or_dict
		links?: list.UniqueItems() & [...string]
		logging?: close({
			driver?: string
			options?: {
				{[=~"^.+$"]: null | number | string}
				...
			}

			{[=~"^x-" & !~"^(driver|options)$"]: _}
		})
		mac_address?:     string
		mem_limit?:       number | string
		mem_reservation?: int | string
		mem_swappiness?:  int | string
		memswap_limit?:   number | string
		network_mode?:    string
		networks?: matchN(1, [#list_of_strings, close({
			{[=~"^[a-zA-Z0-9._-]+$"]: matchN(1, [close({
				aliases?: #list_of_strings, ipv4_address?: string, ipv6_address?: string, link_local_ips?: #list_of_strings, mac_address?: string, driver_opts?: {
					{[=~"^.+$"]: number | string}
					...
				}
				priority?: number

				{[=~"^x-" & !~"^(aliases|ipv4_address|ipv6_address|link_local_ips|mac_address|driver_opts|priority)$"]: _}
			}), null])
			}
		})])
		oom_kill_disable?: bool | string
		oom_score_adj?: matchN(1, [string, int & >=-1000 & <=1000])
		pid?:        null | string
		pids_limit?: number | string
		platform?:   string
		ports?: list.UniqueItems() & [...matchN(1, [number, string, close({
			name?:         string
			mode?:         string
			host_ip?:      string
			target?:       int | string
			published?:    int | string
			protocol?:     string
			app_protocol?: string

			{[=~"^x-" & !~"^(name|mode|host_ip|target|published|protocol|app_protocol)$"]: _}
		})])]
		post_start?: [...#service_hook]
		pre_stop?: [...#service_hook]
		privileged?:  bool | string
		profiles?:    #list_of_strings
		pull_policy?: "always" | "never" | "if_not_present" | "build" | "missing"
		read_only?:   bool | string
		restart?:     string
		runtime?:     string
		scale?:       int | string
		security_opt?: list.UniqueItems() & [...string]
		shm_size?:          number | string
		secrets?:           #service_config_or_secret
		sysctls?:           #list_or_dict
		stdin_open?:        bool | string
		stop_grace_period?: string
		stop_signal?:       string
		storage_opt?: {
			...
		}
		tmpfs?:       #string_or_list
		tty?:         bool | string
		ulimits?:     #ulimits
		user?:        string
		uts?:         string
		userns_mode?: string
		volumes?: list.UniqueItems() & [...matchN(1, [string, close({
			type!:        string
			source?:      string
			target?:      string
			read_only?:   bool | string
			consistency?: string
			bind?: close({
				propagation?:      string
				create_host_path?: bool | string
				recursive?:        "enabled" | "disabled" | "writable" | "readonly"
				selinux?:          "z" | "Z"

				{[=~"^x-" & !~"^(propagation|create_host_path|recursive|selinux)$"]: _}
			})
			volume?: close({
				nocopy?:  bool | string
				subpath?: string

				{[=~"^x-" & !~"^(nocopy|subpath)$"]: _}
			})
			tmpfs?: close({
				size?: matchN(1, [int & >=0, string])
				mode?: number | string

				{[=~"^x-" & !~"^(size|mode)$"]: _}
			})

			{[=~"^x-" & !~"^(type|source|target|read_only|consistency|bind|volume|tmpfs)$"]: _}
		})])]
		volumes_from?: list.UniqueItems() & [...string]
		working_dir?: string

		{[=~"^x-" & !~"^(develop|deploy|annotations|attach|build|blkio_config|cap_add|cap_drop|cgroup|cgroup_parent|command|configs|container_name|cpu_count|cpu_percent|cpu_shares|cpu_quota|cpu_period|cpu_rt_period|cpu_rt_runtime|cpus|cpuset|credential_spec|depends_on|device_cgroup_rules|devices|dns|dns_opt|dns_search|domainname|entrypoint|env_file|label_file|environment|expose|extends|external_links|extra_hosts|gpus|group_add|healthcheck|hostname|image|init|ipc|isolation|labels|links|logging|mac_address|mem_limit|mem_reservation|mem_swappiness|memswap_limit|network_mode|networks|oom_kill_disable|oom_score_adj|pid|pids_limit|platform|ports|post_start|pre_stop|privileged|profiles|pull_policy|read_only|restart|runtime|scale|security_opt|shm_size|secrets|sysctls|stdin_open|stop_grace_period|stop_signal|storage_opt|tmpfs|tty|ulimits|user|uts|userns_mode|volumes|volumes_from|working_dir)$"]: _}
	})

	#healthcheck: close({
		disable?:  bool | string
		interval?: string
		retries?:  number | string
		test?: matchN(1, [string, [...string]])
		timeout?:        string
		start_period?:   string
		start_interval?: string

		{[=~"^x-" & !~"^(disable|interval|retries|test|timeout|start_period|start_interval)$"]: _}
	})

	#development: null | close({
		watch?: [...close({
			ignore?: [...string]
			path!:   string
			action!: "rebuild" | "sync" | "restart" | "sync+restart" | "sync+exec"
			target?: string
			exec?:   #service_hook

			{[=~"^x-" & !~"^(ignore|path|action|target|exec)$"]: _}
		})]

		{[=~"^x-" & !~"^(watch)$"]: _}
	})

	#deployment: null | close({
		mode?:          string
		endpoint_mode?: string
		replicas?:      int | string
		labels?:        #list_or_dict
		rollback_config?: close({
			parallelism?:       int | string
			delay?:             string
			failure_action?:    string
			monitor?:           string
			max_failure_ratio?: number | string
			order?:             "start-first" | "stop-first"

			{[=~"^x-" & !~"^(parallelism|delay|failure_action|monitor|max_failure_ratio|order)$"]: _}
		})
		update_config?: close({
			parallelism?:       int | string
			delay?:             string
			failure_action?:    string
			monitor?:           string
			max_failure_ratio?: number | string
			order?:             "start-first" | "stop-first"

			{[=~"^x-" & !~"^(parallelism|delay|failure_action|monitor|max_failure_ratio|order)$"]: _}
		})
		resources?: close({
			limits?: close({
				cpus?:   number | string
				memory?: string
				pids?:   int | string

				{[=~"^x-" & !~"^(cpus|memory|pids)$"]: _}
			})
			reservations?: close({
				cpus?:              number | string
				memory?:            string
				generic_resources?: #generic_resources
				devices?:           #devices

				{[=~"^x-" & !~"^(cpus|memory|generic_resources|devices)$"]: _}
			})

			{[=~"^x-" & !~"^(limits|reservations)$"]: _}
		})
		restart_policy?: close({
			condition?:    string
			delay?:        string
			max_attempts?: int | string
			window?:       string

			{[=~"^x-" & !~"^(condition|delay|max_attempts|window)$"]: _}
		})
		placement?: close({
			constraints?: [...string]
			preferences?: [...close({
				spread?: string

				{[=~"^x-" & !~"^(spread)$"]: _}
			})]
			max_replicas_per_node?: int | string

			{[=~"^x-" & !~"^(constraints|preferences|max_replicas_per_node)$"]: _}
		})

		{[=~"^x-" & !~"^(mode|endpoint_mode|replicas|labels|rollback_config|update_config|resources|restart_policy|placement)$"]: _}
	})

	#generic_resources: [...close({
		discrete_resource_spec?: close({
			kind?:  string
			value?: number | string

			{[=~"^x-" & !~"^(kind|value)$"]: _}
		})

		{[=~"^x-" & !~"^(discrete_resource_spec)$"]: _}
	})]

	#devices: [...close({
		capabilities!: #list_of_strings
		count?:        int | string
		device_ids?:   #list_of_strings
		driver?:       string
		options?:      #list_or_dict

		{[=~"^x-" & !~"^(capabilities|count|device_ids|driver|options)$"]: _}
	})]

	#gpus: matchN(1, ["all", [...{
		capabilities?: #list_of_strings
		count?:        int | string
		device_ids?:   #list_of_strings
		driver?:       string
		options?:      #list_or_dict
		...
	}]])

	#include: matchN(1, [string, close({
		path?:              #string_or_list
		env_file?:          #string_or_list
		project_directory?: string
	})])

	#network: null | close({
		name?:   string
		driver?: string
		driver_opts?: {
			{[=~"^.+$"]: number | string}
			...
		}
		ipam?: close({
			driver?: string
			config?: [...close({
				subnet?:   string
				ip_range?: string
				gateway?:  string
				aux_addresses?: close({
					{[=~"^.+$"]: string}
				})

				{[=~"^x-" & !~"^(subnet|ip_range|gateway|aux_addresses)$"]: _}
			})]
			options?: close({
				{[=~"^.+$"]: string}
			})

			{[=~"^x-" & !~"^(driver|config|options)$"]: _}
		})
		external?: bool | string | close({
			name?: string @deprecated()

			{[=~"^x-" & !~"^(name)$"]: _}
		})
		internal?:    bool | string
		enable_ipv4?: bool | string
		enable_ipv6?: bool | string
		attachable?:  bool | string
		labels?:      #list_or_dict

		{[=~"^x-" & !~"^(name|driver|driver_opts|ipam|external|internal|enable_ipv4|enable_ipv6|attachable|labels)$"]: _}
	})

	#volume: null | close({
		name?:   string
		driver?: string
		driver_opts?: {
			{[=~"^.+$"]: number | string}
			...
		}
		external?: bool | string | close({
			name?: string @deprecated()

			{[=~"^x-" & !~"^(name)$"]: _}
		})
		labels?: #list_or_dict

		{[=~"^x-" & !~"^(name|driver|driver_opts|external|labels)$"]: _}
	})

	#secret: close({
		name?:        string
		environment?: string
		file?:        string
		external?: bool | string | {
			name?: string
			...
		}
		labels?: #list_or_dict
		driver?: string
		driver_opts?: {
			{[=~"^.+$"]: number | string}
			...
		}
		template_driver?: string

		{[=~"^x-" & !~"^(name|environment|file|external|labels|driver|driver_opts|template_driver)$"]: _}
	})

	#config: close({
		name?:        string
		content?:     string
		environment?: string
		file?:        string
		external?: bool | string | {
			name?: string @deprecated()
			...
		}
		labels?:          #list_or_dict
		template_driver?: string

		{[=~"^x-" & !~"^(name|content|environment|file|external|labels|template_driver)$"]: _}
	})

	#command: matchN(1, [null, string, [...string]])

	#service_hook: close({
		command?:     #command
		user?:        string
		privileged?:  bool | string
		working_dir?: string
		environment?: #list_or_dict

		{[=~"^x-" & !~"^(command|user|privileged|working_dir|environment)$"]: _}
	})

	#env_file: matchN(1, [string, [...matchN(1, [string, close({
		path!:     string
		format?:   string
		required?: bool | string | *true
	})])]])

	#label_file: matchN(1, [string, [...string]])

	#string_or_list: matchN(1, [string, #list_of_strings])

	#list_of_strings: list.UniqueItems() & [...string]

	#list_or_dict: matchN(1, [close({
		{[=~".+"]: null | bool | number | string}
	}), list.UniqueItems() & [...string]])

	#extra_hosts: matchN(1, [close({
		{[=~".+"]: matchN(1, [string, [...string]])}
	}), list.UniqueItems() & [...string]])

	#blkio_limit: close({
		path?: string
		rate?: int | string
	})

	#blkio_weight: close({
		path?:   string
		weight?: int | string
	})

	#service_config_or_secret: [...matchN(1, [string, close({
		source?: string
		target?: string
		uid?:    string
		gid?:    string
		mode?:   number | string

		{[=~"^x-" & !~"^(source|target|uid|gid|mode)$"]: _}
	})])]

	#ulimits: {
		{[=~"^[a-z]+$"]: matchN(1, [int | string, close({
			hard!: int | string
			soft!: int | string

			{[=~"^x-" & !~"^(hard|soft)$"]: _}
		})])
		}
		...
	}

	#constraints: _
}
