local CloudNativePG = import './cloudnative-pg.libsonnet';
local Dragonfly = import './dragonfly.libsonnet';
local Strimzi = import './strimzi.libsonnet';
local Utils = import './utils.libsonnet';

local app = 'openmedia';

local postgresqlCluster = CloudNativePG.newCluster(app, app) + {
  cluster+: {
    spec+: {
      bootstrap: {
        initdb: {
          database: app,
          owner: 'openmedia-backend',

          // Thanks to the convention over configuration paradigm, you can let the operator choose
          // a default database name (app) and a default application user name (same as the
          // database name), as well as randomly generate a secure password for both the superuser
          // and the application user in PostgreSQL.
        },
      },
    },
  },
};

local databaseSchema = {
  apiVersion: 'db.atlasgo.io/v1alpha1',
  kind: 'AtlasSchema',
  metadata: {
    name: app,
    namespace: app,
  },
  spec: {
    // CloudNativePG generates this Secret for the application user declared in the cluster's
    // bootstrap.initdb block. Its 'uri' key holds the complete PostgreSQL connection string.
    urlFrom: {
      secretKeyRef: {
        key: 'uri',
        name: app + '-app',
      },
    },

    schema: {
      sql: importstr '../../../../backend/schema.sql',
    },

    // By default, each migration is carried out as a transaction. This disables us from concurrent
    // creation / deletion of indices. So, we instruct Atlas to carry out the migration without
    // a transaction.
    txMode: 'none',

    policy: {
      // The Atlasgo operator should error out, if it detects a destructive change such as dropping
      // a column or table.
      // Destructive changes will be taken care of manually.
      lint: {
        destructive: {
          'error': true,
        },
      },

      diff: {
        concurrent_index: {
          create: true,
          drop: true,
        },
      },
    },
  },
};

local kafkaCluster =
  local controllerVolumeSize = '1Gi',
        brokerVolumeSize = '5Gi';

  local topics = [
    'events.users.created',
    'events.profiles.created',
  ];

  local consumerGroups = [
    {
      local consumerGroupName = 'openmedia-backend',

      name: consumerGroupName,
      users: [
        {
          name: 'openmedia-backend',
          acls: [
            {
              resource: {
                type: 'topic',
                name: topic,
                patternType: 'literal',
              },
              operations: ['Describe', 'Read', 'Write'],
              host: '*',
            }
            for topic in topics
          ],
        },
      ],
    },
  ];

  Strimzi.newCluster(app, app, controllerVolumeSize, brokerVolumeSize, topics, consumerGroups);

local dragonflyCluster = Dragonfly.newCluster(app, app);

{
  openmedia: Utils.withAppLabel(app, {
    database: {
      postgresqlCluster: postgresqlCluster,
      schema: databaseSchema,
    },

    kafkaCluster: kafkaCluster,

    dragonflyCluster: dragonflyCluster,

    meilisearchCluster: {},

    backend: {},
  }),
}
