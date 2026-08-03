local Tanka = import 'github.com/grafana/jsonnet-libs/tanka-util/main.libsonnet',
      Helm = Tanka.helm.new(std.thisFile);
local Kubernetes = import 'github.com/jsonnet-libs/k8s-libsonnet/1.32/main.libsonnet';
local Utils = import './utils.libsonnet';

local app = 'kubevela';

/*
  KubeVela is a modern software delivery and management control plane. The goal is to make
  deploying and operating applications across today's hybrid, multi-cloud environments easier,
  faster and more reliable.

  Why KubeVela :

    (1) The modern application should be able to deploy across hybrid environments including
        Kubernetes, cloud, or even IoT devices in a simple and robust way.

    (2) The app delivery control plane should be able to adapt to any existing infrastructure or
        extend with modular and reusable building blocks per users’ needs.

    (3) The developers should have an application platform that is vendor agnostic, consistent
        experience, and has a large number of reusable building blocks and best practices.

  KubeVela designs for separation of concerns, as a result, there're two roles of users:

    Platform Team : The platform engineers initialize the deployment environments, provide stable
                    infrastructure capabilities (e.g. mysql-operator) and register them as reusable
                    templates using KubeVela Definitions into the control plane. They should be
                    experienced and skillful with the infrastructure.

    End Users : The end users are usually app developers. They choose target environment, and
                choose capability templates, fill in values and finally assemble them as a KubeVela
                Application. They don't need to understand the infrastructure details.

  The KubeVela community has also maintained a bundle of infrastructure capabilities, they are
  called addons.

  KubeVela revolves around cloud-native application delivery scenarios. The application delivery
  model behind it is Open Application Model, or OAM for short.

  This Application entity will reference component, trait, policy and workflow step types which are
  essentially programmable modules that are maintained by platform team. Hence, this abstraction is
  highly extensible and can be customized in-place at ease.

    Component: A Component defines the delivery artifact (binary, Docker image, Helm Chart...) or
               cloud service included in one application. As we will regard an application as a
               microservice unit, the best practice is to control one application only has one core
               service for frequent development, other components within this application can be
               dependencies such as database, cache or other middleware/cloud services, the maximum
               number of components within an application should under ~15.

    Trait: Traits are management requirements of an artifact that can be declared with each
           Component. For example: scale and rollout strategy, persistent storage claim, gateway
           endpoint and so on.

    Policy: Policy defines a strategy of certain aspect for application as to multi-cluster
            topology, configuration overrides, security/firewall rules, SLO and etc. It's a bit
            similar with traits but take affects to the whole application instead of one component.

    Workflow Step: Workflow step allows you to define every steps in the delivery process, typical
                   steps are manual approval, partial deploy, notification.

  The modules that make up the application are all extensible, they are defined by a bunch of
  programmable configurations called Definitions.

  OAM Definitions are basic building blocks of the KubeVela platform. A definition encapsulates an
  arbitrarily complex automation as a lego style module, then safely shared, discovered and be
  used to compose an Application delivered by any KubeVela engine.

  There're mainly four types of definitions in KubeVela, they're ComponentDefinition,
  TraitDefinition, PolicyDefinition and WorkflowStepDefinition, corresponding to the application
  concepts. As an end user, you can get out-of-box definitions from KubeVela community.
*/
{
  kubevela: Utils.withAppLabel(app, {
    namespace: Kubernetes.core.v1.namespace.new(app),

    installation: Helm.template(app, Utils.chartsDir('vela-core', std.thisFile), {
      version: '1.11.0',

      namespace: app,
      createNamespace: false,

      values: {},
    }),
  }),
}
