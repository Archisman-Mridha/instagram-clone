local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import './utils.libsonnet';

local app = 'cloudnative-pg';

local newCluster = function(clusterName, namespace, connectionPoolingEnabled=false) {
  cluster: {
    apiVersion: 'postgresql.cnpg.io/v1',
    kind: 'Cluster',
    metadata: {
      name: clusterName,
      namespace: namespace,
    },
    spec: {
      instances: 3,

      storage: { size: '5Gi' },
      //
      // By reserving dedicated disk space to WAL files, you can be sure that exhausting space on
      // the PGDATA volume never interferes with WAL writing. This behavior ensures that your
      // PostgreSQL primary is correctly shut down.
      // walStorage: { size: '1Gi' },

      postgresql: {
        parameters: {
          // WAL level is set to logical by default. Which means : logical replication is turned
          // on by default.

          // Required for logical replication slot synchronization to work.
          hot_standby_feedback: 'on',
          sync_replication_slots: 'on',

          // When replication slots is enabled, you might end up running out of disk space due to
          // PostgreSQL trying to retain WAL files requested by a replication slot. This might
          // happen due to a standby that is (temporarily?) down, or lagging, or simply an orphan
          // replication slot.
          // Starting with PostgreSQL 13, you can take advantage of the max_slot_wal_keep_size
          // configuration option controlling the maximum size of WAL files that replication slots
          // are allowed to retain in the pg_wal directory at checkpoint time. By default, in
          // PostgreSQL max_slot_wal_keep_size is set to -1, meaning that replication slots may
          // retain an unlimited amount of WAL files.
          max_slot_wal_keep_size: '10GB',

          // Enable audit logging using pgAudit.

          'pgaudit.log': 'all, -misc',
          //
          // Specifies that session logging should be enabled in the case where all relations in a
          // statement are in pg_catalog. Disabling this setting will reduce noise in the log from
          // tools like psql and PgAdmin that query the catalog heavily.
          'pgaudit.log_catalog': 'off',
          //
          // Specifies that audit logging should include the parameters that were passed with the
          // statement. When parameters are present they will be included in CSV format after the
          // statement text.
          'pgaudit.log_parameter': 'on',
          //
          // Specifies whether session audit logging should create a separate log entry for each
          // relation (TABLE, VIEW, etc.) referenced in a SELECT or DML statement. This is a useful
          // shortcut for exhaustive logging without using object audit logging.
          'pgaudit.log_relation': 'on',
        },
      },

      // Replication slots are a native PostgreSQL feature introduced in 9.4 that provides an
      // automated way to ensure that the primary does not remove WAL segments until all the
      // attached streaming replication clients have received them, and that the primary does not
      // remove rows which could cause a recovery conflict even when the standby is (temporarily)
      // disconnected.
      replicationSlots: {
        highAvailability: {
          /*
            A replication slot exists solely on the instance that created it, and PostgreSQL does
            not replicate it on the standby servers. As a result, after a failover or a switchover,
            the new primary does not contain the replication slot from the old primary. This can
            create problems for the streaming replication clients that were connected to the old
            primary and have lost their slot.

            CloudNativePG provides a turn-key solution to synchronize the content of physical
            replication slots from the primary to each standby, addressing two use cases:

              (1) the replication slots automatically created for the High Availability of the
                Postgres cluster.

                This feature is enabled by default.

              (2) user-defined replication slots created on the primary.

                Although CloudNativePG doesn't support a way to declaratively define physical
                replication slots, you can still create your own slots via SQL.

                CloudNativePG can manage the synchronization of any user managed physical
                replication slots between the primary and standbys, similarly to what it does for
                the HA replication slots.

                This feature is enabled by default (meaning that any replication slot is
                synchronized).
          */

          // CloudNativePG can synchronize logical decoding (replication) slots across all nodes in
          // a high-availability cluster, ensuring seamless continuation of logical replication
          // after a failover or switchover.
          synchronizeLogicalDecoding: true,
        },
      },
    },
  },

  /*
    CloudNativePG provides native support for connection pooling with PgBouncer.
    A pooler in CloudNativePG is a deployment of PgBouncer pods that sits between your applications
    and a PostgreSQL service.

    WARNING : When your infrastructure spans multiple availability zones with high latency across
              them, be aware of network hops. Consider, for example, the case of your application
              running in zone 2, connecting to PgBouncer running in zone 3, and pointing to the
              PostgreSQL primary in zone 1.
  */
  [if connectionPoolingEnabled then 'poolers']: {
    default: {
      apiVersion: 'postgresql.cnpg.io/v1',
      kind: 'Pooler',
      metadata: {
        name: clusterName,
        namespace: namespace,
      },
      spec: {
        cluster: {
          name: clusterName,
        },
        instances: 3,
        type: 'rw',
        pgbouncer: {
          poolMode: 'session',
          parameters: {
            // Maximum number of client connections allowed.
            max_client_conn: '1000',
          },
        },
      },
    },
  },

  podMonitor: {
    apiVersion: 'monitoring.coreos.com/v1',
    kind: 'PodMonitor',
    metadata: {
      name: clusterName,
      namespace: namespace,
    },
    spec: {
      selector: {
        matchLabels: {
          'cnpg.io/cluster': clusterName,
        },
      },
      podMetricsEndpoints: [
        { port: 'metrics' },
      ],
    },
  },
};

// CloudNativePG (CNPG) is an open-source operator designed to manage PostgreSQL workloads on any
// supported Kubernetes cluster.
{
  cloudnativePG: Utils.withAppLabel(app, {
    namespace: Kubernetes.core.v1.namespace.new(app),

    installation: Helm.template(app, Utils.chartsDir(app, std.thisFile), {
      version: '0.28.2',

      namespace: app,
      createNamespace: false,

      values: {},
    }),
  }),

  newCluster:: newCluster,
}
