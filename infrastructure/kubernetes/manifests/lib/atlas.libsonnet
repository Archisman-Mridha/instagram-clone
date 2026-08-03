local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import './utils.libsonnet';

local app = 'atlas';

/*
  Atlas is a language-independent tool for managing and migrating database schemas using modern
  DevOps principles.

  Similar to Terraform, Atlas compares the current state of the database to the desired state, as
  defined in an HCL, SQL, or ORM schema. Based on this comparison, it generates and executes a
  migration plan to transition the database to its desired state.

  Atlas supports 3 types of migration strategies :

    (1) Declarative migrations :

      The declarative approach (also known as state-based migrations) has become increasingly
      popular with engineers nowadays because it embodies a convenient separation of concerns
      between application and infrastructure engineers. Application engineers describe what (the
      desired state) they need to happen, and infrastructure engineers build tools that plan and
      execute ways to get to that state (how).

      With declarative migrations, the desired state of the database schema is given as input to
      the migration engine, which plans and executes a set of actions to change the database to its
      desired state.

    (2) Versioned migrations :

      As the database is one of the most critical components in any system, applying changes to its
      schema is rightfully considered a dangerous operation. For this reason, many teams prefer a
      more imperative approach where each change to the database schema is checked-in to source
      control and reviewed during code-review. Each such change is called a "migration", as it
      migrates the database schema from the previous version to the next.

      With versioned migrations (sometimes called "change-based migrations") instead of describing
      the desired state ("what the database should look like"), developers describe the changes
      themselves ("how to reach the state").

    (3) Versioned migration authoring :

      The downside of the versioned migration approach is, of course, that it puts the burden of
      planning the migration on developers. This requires a certain level of expertise that is not
      always available to every engineer, as we demonstrated in our example of setting a default
      value in a SQLite database above.

      As part of the Atlas project we advocate for a third combined approach that we call
      "Versioned Migration Authoring". Versioned Migration Authoring is an attempt to combine the
      simplicity and expressiveness of the declarative approach with the control and explicitness
      of versioned migrations.

      With versioned migration authoring, users still declare their desired state and use the Atlas
      engine to plan a safe migration from the existing to the new state. However, instead of
      coupling planning and execution, plans are instead written into normal migration files which
      can be checked-in to source control, fine-tuned manually and reviewed in regular code review
      processes.

  We'll be using declarative migrations.
*/
{
  atlas: Utils.withAppLabel(app, {
    namespace: Kubernetes.core.v1.namespace.new(app),

    operator: Helm.template('atlas-operator', Utils.chartsDir('atlas-operator', std.thisFile), {
      version: '0.7.37',

      namespace: app,
      createNamespace: false,

      values: {
        /*
          Some commands require a URL pointing to a "Dev Database", a temporary, isolated database
          instance that Atlas uses as a sandbox to simulate the real environment. Parsing schemas
          and migrations is not enough: every expression, constraint, default, function call, and
          DDL/DML statement must be semantically valid and accepted by a real database of the same
          type and version. That's what the dev-database is for: validating your code against your
          real environment (e.g., Postgres 18 with PostGIS and pgvector).

          To simplify the process of creating temporary databases for one-time use, Atlas can spin
          up an ephemeral Pod, and clean it up at the end of the process.

          Atlas has parsers for every supported database, so syntax is covered. Correctness is a
          different question: only the real engine, with the right version and extensions, can
          compile every expression, resolve every reference, and accept the result. That's the
          dev-database's job.

          Concretely, Atlas runs your schemas, migrations, and data blocks on a database that
          matches your production engine, version, and extensions (PostGIS, pgvector, etc.),
          catching bad expressions, logic errors, and failed migrations before they reach the
          target database. This is especially critical for engines without transactional DDL, like
          MySQL, Spanner, and Snowflake, where partial failures can't be rolled back.
        */
      },
    }),
  }),
}
