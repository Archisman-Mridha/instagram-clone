local CloudNativePG = import './cloudnative-pg.libsonnet';
local Dragonfly = import './dragonfly.libsonnet';
local Meilisearch = import './meilisearch.libsonnet';
local Strimzi = import './strimzi.libsonnet';
local Utils = import './utils.libsonnet';

local app = 'openmedia';

local publishedTables = ['users', 'profiles', 'followships', 'posts'];

local publicationForTable = function(tableName) {
  apiVersion: 'postgresql.cnpg.io/v1',
  kind: 'Publication',
  metadata: {
    name: std.format('%s-events', tableName),
    namespace: app,
  },
  spec: {
    cluster: {
      name: app,
    },
    dbname: app,
    name: std.format('%s_events', tableName),
    target: {
      objects: [{
        table: {
          schema: 'public',
          name: tableName,
        },
      }],
    },
  },
};

local postgresCluster = CloudNativePG.newCluster(app, app) + {
  cluster+: {
    spec+: {
      bootstrap: {
        initdb: {
          database: app,
          owner: app,

          // Thanks to the convention over configuration paradigm, you can let the operator choose
          // a default database name (app) and a default application user name (same as the
          // database name), as well as randomly generate a secure password for both the superuser
          // and the application user in Postgres.
        },
      },
    },
  },

  /*
    In PostgreSQL's publish-and-subscribe replication model, a publication is the source of data
    changes. It acts as a logical container for the change sets (also known as replication sets)
    generated from one or more tables within a database.

    According to the Postgres documentation :

      A publication can be defined on any physical replication primary. The node where a
      publication is defined is referred to as publisher. A publication is a set of changes
      generated from a table or a group of tables, and might also be described as a change set or
      replication set. Each publication exists in only one database.
  */
  publications: {
    [std.format('%sEvents', tableName)]: publicationForTable(tableName)
    for tableName in publishedTables
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
    // bootstrap.initdb block. Its 'uri' key holds the complete Postgres connection string.
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
    std.format('events.%s.created', tableName)
    for tableName in publishedTables
  ];

  local consumerGroups = [
    {
      local consumerGroupName = app,

      name: consumerGroupName,
      users: [
        {
          name: app,
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

local meilisearchCluster = Meilisearch.newCluster(app, app);

local dragonflyCluster = Dragonfly.newCluster(app, app);

{
  openmedia: Utils.withAppLabel(app, {
    database: {
      postgresCluster: postgresCluster,
      schema: databaseSchema,
    },

    kafkaCluster: kafkaCluster,

    dragonflyCluster: dragonflyCluster,

    meilisearchCluster: meilisearchCluster,

    backend: {},
  }),
}
