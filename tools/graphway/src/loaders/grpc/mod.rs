use {
  super::Loader,
  crate::graphql::types::{
    GraphQLField, GraphQLType, GraphQLTypeName, GraphQLTypes, newGraphQLField,
    scalars::{
      BOOL_SCALAR_TYPE, BOOL_SCALAR_TYPE_NAME, INT_SCALAR_TYPE_NAME, STRING_SCALAR_TYPE,
      STRING_SCALAR_TYPE_NAME,
    },
  },
  anyhow::{Result, anyhow},
  graphql_parser::schema::ObjectType,
  prost_build::Config,
  prost_types::DescriptorProto,
  std::collections::HashMap,
  tracing::debug,
};

type ProtoType = prost_types::field_descriptor_proto::Type;

pub struct GRPCLoader {}

impl Loader for GRPCLoader {}

impl GRPCLoader {
  pub fn generateSubGraphFromProtoFile(sourceName: &str, protoFilePath: &str) -> Result<()> {
    debug!("Constructing sub-graph from proto file");

    let sourceName = stringcase::pascal_case(sourceName);

    // Get descriptors.
    /*
      Descriptors are the commonly used language model for Protocol Buffers.
      They are used as an intermediate artifact to support code generation, and they are also
      used in runtime libraries to implement support for reflection and dynamic types.
      Read more here - https://protobuf.com/docs/descriptors.
    */
    let descriptors = Config::new().load_fds(&[protoFilePath], &[""; 0])?;

    // Construct GraphQL types for each Protobuf message type.

    let mut graphQLTypes: GraphQLTypes = HashMap::new();

    for descriptorFile in &descriptors.file {
      for messageType in &descriptorFile.message_type {
        let graphQLType = Self::constructGraphQLTypeFromMessageType(messageType)?;
        graphQLTypes.insert(messageType.name(), graphQLType);
      }
    }

    // Generate GraphQL Queries and Mutations from Protobuf RPCs.

    for file in &descriptors.file {
      for service in &file.service {
        for method in &service.method {
          if method.client_streaming() || method.server_streaming() {
            return Err(anyhow!(
              "gRPC client or server side streaming is currently not supported"
            ));
          }

          let graphQLOperationName =
            format!("{}__{}__{}", sourceName, service.name(), method.name());

          // let methodRequestType = method.input_type();
          // let graphQLOperationRequestType = graphQLTypes.get(methodRequestType).ok_or(anyhow!(
          //   "Message type definition not found for {}",
          //   methodRequestType
          // ))?;
          //
          // let methodResponseType = method.output_type();
          // let graphQLOperationResponseType =
          //   graphQLTypes.get(methodResponseType).ok_or(anyhow!(
          //     "Message type definition not found for {}",
          //     methodResponseType
          //   ))?;
        }
      }
    }

    Ok(())
  }

  // Constructs and returns an equivalent GraphQL type for the given Protobuf message type.
  fn constructGraphQLTypeFromMessageType(messageType: &DescriptorProto) -> Result<GraphQLType> {
    for field in &messageType.field {}

    unimplemented!()
  }

  // Returns GraphQL type corresponding to the given Protobuf message type, by searching the
  // GraphQL types HashMap.
  fn getGraphQLObjectTypeForMessageType<'g>(
    graphQLTypes: &'g GraphQLTypes,
    sourceName: &str,
    messageType: &'g DescriptorProto,
  ) -> Result<GraphQLType<'g>> {
    let objectTypeName = format!("{}__{}", sourceName, messageType.name());

    // let mut objectTypeFields: Vec<GraphQLField> = vec![];

    let objectTypeFields = messageType
      .field
      .iter()
      .map(|field| {
        let mut fieldTypeName = match field.r#type() {
          ProtoType::Bool => BOOL_SCALAR_TYPE_NAME.clone(),

          ProtoType::Int32 | ProtoType::Int64 => INT_SCALAR_TYPE_NAME.clone(),

          ProtoType::String => STRING_SCALAR_TYPE_NAME.clone(),

          _ => unimplemented!(),
        };

        if field.proto3_optional() {
          fieldTypeName = GraphQLTypeName::NonNullType(Box::new(fieldTypeName));
        }

        newGraphQLField(messageType.name().to_string(), fieldTypeName)
      })
      .collect();

    let mut objectType = ObjectType::<String>::new(objectTypeName);
    objectType.fields = objectTypeFields;

    Ok(GraphQLType::<'g>::Object(objectType))
  }
}

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn test_processProtoFile() {
    GRPCLoader::generateSubGraphFromProtoFile(
      "users-microservice",
      "./src/loaders/grpc/test/echo.proto",
    )
    .unwrap();
  }
}
