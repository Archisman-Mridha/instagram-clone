use {
  graphql_parser::{
    Pos,
    schema::{Field, Type},
  },
  std::collections::HashMap,
};

pub type GraphQLTypeName<'g> = Type<'g, String>;

pub type GraphQLType<'g> = graphql_parser::schema::TypeDefinition<'g, String>;

pub type GraphQLTypes<'g> = HashMap<&'g str, GraphQLType<'g>>;

pub mod scalars {
  use {super::GraphQLTypeName, graphql_parser::schema::ScalarType, lazy_static::lazy_static};

  pub type BuiltinScalarType = ScalarType<'static, String>;

  // Builtin Scalars.
  #[rustfmt::skip]
  lazy_static! {
    // Bool

    pub static ref BOOL_SCALAR_TYPE: BuiltinScalarType = ScalarType::new(String::from("Bool"));

    pub static ref BOOL_SCALAR_TYPE_NAME: GraphQLTypeName<'static> =
      GraphQLTypeName::NamedType("Bool".to_string());

    // Int

    pub static ref INT_SCALAR_TYPE: BuiltinScalarType = ScalarType::new(String::from("Int"));

    pub static ref INT_SCALAR_TYPE_NAME: GraphQLTypeName<'static> =
      GraphQLTypeName::NamedType("Int".to_string());

    // String

    pub static ref STRING_SCALAR_TYPE: BuiltinScalarType = ScalarType::new(String::from("String"));

    pub static ref STRING_SCALAR_TYPE_NAME: GraphQLTypeName<'static> =
      GraphQLTypeName::NamedType("String".to_string());

    // ID

    pub static ref ID_SCALAR_TYPE: BuiltinScalarType = ScalarType::new(String::from("ID"));

    pub static ref ID_SCALAR_TYPE_NAME: GraphQLTypeName<'static> =
      GraphQLTypeName::NamedType("String".to_string());
  }
}

pub type GraphQLField<'g> = Field<'g, String>;

pub fn newGraphQLField<'g>(name: String, typeName: GraphQLTypeName<'g>) -> GraphQLField<'g> {
  let graphQLField = GraphQLField::<'g> {
    name,
    description: None,

    position: Pos { line: 0, column: 0 },

    field_type: typeName,

    arguments: Vec::new(),

    directives: Vec::new(),
  };

  graphQLField
}
