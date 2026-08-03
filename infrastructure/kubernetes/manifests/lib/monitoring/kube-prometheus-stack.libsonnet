local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import '../utils.libsonnet';

local app = 'kube-prometheus-stack';

{
  // Installs core components of the kube-prometheus stack, a collection of Kubernetes manifests,
  // Grafana dashboards, and Prometheus rules combined with documentation and scripts to provide
  // easy to operate end-to-end Kubernetes cluster monitoring with Prometheus using the Prometheus
  // Operator.
  kubePrometheusStack: Utils.withAppLabel(app, {
    namespace: Kubernetes.core.v1.namespace.new(app),

    installation: Helm.template(app, Utils.chartsDir(app, std.thisFile), {
      version: '86.1.0',

      namespace: app,
      createNamespace: false,

      values: {
        crds: { enabled: true },

        // Prometheus collects and stores its metrics as time series data, i.e. metrics information
        // is stored with the timestamp at which it was recorded, alongside optional key-value
        // pairs called labels.
        prometheus: {
          prometheusSpec: {
            // By default, Prometheus discovers PodMonitors, ServiceMonitors and PrometheusRules
            // within its namespace, that are labeled with the same release tag as the
            // prometheus-operator release.
            // We want Prometheus to discover PodMonitors and ServiceMonitors across all namespaces.

            podMonitorSelectorNilUsesHelmValues: false,
            podMonitorNamespaceSelector: {},
            podMonitorSelector: {},

            serviceMonitorSelectorNilUsesHelmValues: false,
            serviceMonitorNamespaceSelector: {},
            serviceMonitorSelector: {},

            ruleSelectorNilUsesHelmValues: false,
            ruleNamespaceSelector: {},
            ruleSelector: {},

            // Enable High Availability (HA) mode.
            replicas: 2,
            podAntiAffinity: 'hard',

            // Running multiple Prometheus instances avoids having a single point of failure but it
            // doesn't help scaling out Prometheus in case a single Prometheus instance can't
            // handle all the targets and rules. This is where Prometheus' sharding feature comes
            // into play. Sharding aims at splitting the scrape targets into multiple groups, each
            // assigned to one Prometheus shard and small enough that they can be handled by a
            // single Prometheus instance.
            // When possible, functional sharding is recommended: in this case, the Prometheus
            // shard X scrapes all pods of Service A, B and C while shard Y scrapes pods from
            // Service D, E and F. When functional sharding is not possible, the Prometheus Operator
            // is also able to support automatic sharding: the targets will be assigned to
            // Prometheus shards based on their addresses. The main drawback of this solution is the
            // additional complexity: to query all data, query federation (e.g. Thanos Query) and
            // distributed rule evaluation engine (e.g. Thanos Ruler) should be deployed to fan in
            // the relevant data for queries and rule evaluations.
            // One of the goals with the Prometheus Operator is that we want to completely automate
            // sharding and federation.
            // REFERENCE : https://github.com/prometheus-operator/prometheus-operator/blob/main/Documentation/platform/high-availability.md#prometheus.
            shards: 2,

            // Sticking to the Prometheus built-in Time Series Database (TSDB), instead of Grafana
            // Mimir : since it doesn't have good reviews.
            // REER : https://www.reddit.com/r/devops/comments/1qg5eni/grafana_mimir_vs_prometheus_storage_performance/.
            storage: {
              volumeClaimTemplate: {
                spec: {
                  resources: {
                    requests: {
                      storage: '10Gi',
                    },
                  },
                },
              },
            },
          },
        },

        // For exporters, high availability depends on the particular exporter. In the case of
        // kube-state-metrics, because it is effectively stateless, it is the same as running any
        // other stateless service in a highly available manner. Simply run multiple replicas that
        // are being load balanced. Key for this is that the backing service, in this case the
        // Kubernetes API server is highly available, ensuring that the data source of
        // kube-state-metrics is not a single point of failure.

        // Prometheus Node Exporter : Prometheus exporter for hardware and OS metrics exposed by
        //                            *NIX kernels.

        // kube-state-metrics (KSM) is a simple service that listens to the Kubernetes API server
        // and generates metrics about the state of the objects. It is not focused on the health of
        // the individual Kubernetes components, but rather on the health of the various objects
        // inside, such as deployments, nodes and pods.

        // Alerting with Prometheus is separated into two parts. Alerting rules in Prometheus
        // servers send alerts to an Alertmanager. The Alertmanager then manages those alerts,
        // including silencing, inhibition, aggregation and sending out notifications via methods
        // such as email, on-call notification systems, and chat platforms.
        alertmanager: {
          alertmanagerSpec: {
            /*
              To ensure high-availability of the Alertmanager service, Prometheus instances are
              configured to send their alerts to all configured Alertmanager instances (as
              described in the Alertmanager documentation). The Alertmanager instances creates a
              gossip-based cluster to replicate alert silences and notification logs.

              The Prometheus Operator manages the following configuration :

                (1) Alertmanager discovery using the Kubernetes API for Prometheus.

                (2) Highly-available cluster for Alertmanager when replicas > 1.
            */
            replicas: 2,
          },
        },

        // Grafana Open Source Software (OSS) enables you to query, visualize, alert on, and
        // explore your metrics, logs, and traces wherever they’re stored. Grafana data source
        // plugins enable you to query data sources including time series databases like Prometheus
        // and CloudWatch, logging tools like Loki and Elasticsearch, NoSQL/SQL databases like
        // Postgres, CI/CD tooling like GitHub, and many more. Grafana OSS provides you with tools
        // to display that data on live dashboards with insightful graphs and visualizations.
      },
    }),
  }),
}
