// We'll be shifting to Redpanda. So, I'm not wasting any time behind trying to enable any sort of
// metrics.

local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import './utils.libsonnet';

local app = 'strimzi';

// Events are organized and durably stored in topics. Topics in Kafka are always multi-producer and
// multi-subscriber: a topic can have zero, one, or many producers that write events to it, as well
// as zero, one, or many consumers that subscribe to these events. Events in a topic can be read as
// often as needed-unlike traditional messaging systems, events are not deleted after consumption.
// Instead, you define for how long Kafka should retain your events through a per-topic
// configuration setting, after which old events will be discarded. Kafka’s performance is
// effectively constant with respect to data size, so storing data for a long time is perfectly
// fine.
local newTopic = function(clusterName, topicName, namespace) {
  apiVersion: 'kafka.strimzi.io/v1',
  kind: 'KafkaTopic',
  metadata: {
    name: std.format('%s-%s', [clusterName, topicName]),
    namespace: namespace,
    labels: {
      'strimzi.io/cluster': clusterName,
    },
  },
  spec: {
    topicName: topicName,

    // Topics are partitioned , meaning a topic is spread over a number of “buckets” located on
    // different Kafka brokers. This distributed placement of your data is very important for
    // scalability because it allows client applications to both read and write the data from/to
    // many brokers at the same time. When a new event is published to a topic, it is actually
    // appended to one of the topic’s partitions. Events with the same event key (e.g., a customer
    // or vehicle ID) are written to the same partition, and Kafka guarantees that any consumer of
    // a given topic-partition will always read that partition’s events in exactly the same order
    // as they were written.
    // To decide the number of partitions for a topic, refer to :
    // https://www.confluent.io/blog/how-choose-number-topics-partitions-kafka-cluster/.
    partitions: 5,
  },
};

local newUser = function(clusterName, consumerGroupName, userName, namespace, acls) {
  apiVersion: 'kafka.strimzi.io/v1',
  kind: 'KafkaUser',
  metadata: {
    name: std.format('%s-%s', [clusterName, userName]),
    namespace: namespace,
    labels: {
      'strimzi.io/cluster': clusterName,
    },
  },
  spec: {
    authorization: {
      type: 'simple',
      acls: acls + [{
        resource: {
          type: 'group',
          name: consumerGroupName,
          patternType: 'prefix',
        },
        operations: ['Read'],
        host: '*',
      }],
    },
  },
};

local newCluster = function(
  clusterName,
  namespace,
  controllerVolumeSize,
  brokerVolumeSize,
  topics,
  consumerGroups
                   ) {
  cluster: {
    apiVersion: 'kafka.strimzi.io/v1',
    kind: 'Kafka',
    metadata: {
      name: clusterName,
      namespace: namespace,
    },
    spec: {
      kafka: {
        version: '4.2.0',
        metadataVersion: '4.2-IV1',
        listeners: [
          {
            name: 'plain',
            port: 9092,
            type: 'internal',
            tls: false,
          },
        ],
        config: {
          // Disable auto creation of topic on the server.
          'auto.create.topics.enable': false,

          // Default replication factors for automatically created topics.
          'default.replication.factor': 3,

          // When a producer sets acks to "all" (or "-1"), min.insync.replicas specifies the
          // minimum number of replicas that must acknowledge a write for the write to be
          // considered successful. If this minimum cannot be met, then the producer will raise an
          // exception (either NotEnoughReplicas or NotEnoughReplicasAfterAppend). When used
          // together, min.insync.replicas and acks allow you to enforce greater durability
          // guarantees. A typical scenario would be to create a topic with a replication factor of
          // 3, set min.insync.replicas to 2, and produce with acks of "all". This will ensure that
          // the producer raises an exception if a majority of replicas do not receive a write.
          'min.insync.replicas': 2,
        },
      },
      entityOperator: {
        topicOperator: {},
        userOperator: {},
      },
    },
  },

  /*
    A Kafka cluster consists of nodes assigned KRaft roles. These roles can be brokers, responsible
    for message streaming and storage, or controllers, which manage cluster state and metadata.
    While a node can perform both roles, separating them in production simplifies cluster
    management.

    Strimzi manages Kafka nodes using node pools. Each node pool has its own configuration,
    defining aspects such as the role assigned to all its nodes, replica count, and storage
    settings. Node pools are associated with a single Kafka cluster through this configuration.

    Cluster-wide settings, such as the Kafka version and listener configuration, are defined in the
    Kafka custom resource. Any configuration not defined in node pools is inherited from the
    cluster configuration in the Kafka resource.
  */
  nodePools: {
    controller: {
      apiVersion: 'kafka.strimzi.io/v1',
      kind: 'KafkaNodePool',
      metadata: {
        name: std.format('%s-controllers', clusterName),
        namespace: namespace,
        labels: {
          'strimzi.io/cluster': clusterName,
        },
      },
      spec: {
        replicas: 3,
        roles: ['controller'],
        storage: {
          type: 'jbod',
          volumes: [
            {
              id: 0,
              type: 'persistent-claim',
              size: controllerVolumeSize,
              kraftMetadata: 'shared',
            },
          ],
        },
      },
    },

    broker: {
      apiVersion: 'kafka.strimzi.io/v1',
      kind: 'KafkaNodePool',
      metadata: {
        name: std.format('%s-brokers', clusterName),
        namespace: namespace,
        labels: {
          'strimzi.io/cluster': clusterName,
        },
      },
      spec: {
        replicas: 3,
        roles: ['broker'],
        storage: {
          type: 'jbod',
          volumes: [
            {
              id: 0,
              type: 'persistent-claim',
              size: brokerVolumeSize,
              kraftMetadata: 'shared',
            },
          ],
        },
      },
    },
  },

  topics: {
    [topicName]: newTopic(clusterName, topicName, namespace)
    for topicName in topics
  },

  users: {
    [user.name]: newUser(clusterName, consumerGroup.name, user.name, namespace, user.acls)
    for consumerGroup in consumerGroups
    for user in consumerGroup.users
  },
};

// Strimzi simplifies the process of running Apache Kafka within a Kubernetes cluster.
{
  strimzi: Utils.withAppLabel(app, {
    namespace: Kubernetes.core.v1.namespace.new(app),

    // Strimzi uses the Cluster Operator to deploy and manage clusters.
    // The Cluster Operator can deploy the Entity Operator, which runs the Topic Operator and User
    // Operator in a single pod.
    clusterOperator: Helm.template(app, Utils.chartsDir('strimzi-kafka-operator', std.thisFile), {
      version: '0.35.0',

      namespace: app,
      createNamespace: false,

      values: {
        replicas: 2,
      },
    }),
  }),

  newCluster:: newCluster,
}
