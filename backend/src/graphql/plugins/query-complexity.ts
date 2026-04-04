import { ApolloServerPlugin, BaseContext, GraphQLRequestListener } from "@apollo/server"
import { Plugin } from "@nestjs/apollo"
import { GraphQLSchemaHost } from "@nestjs/graphql"
import { GraphQLError } from "graphql"
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from "graphql-query-complexity"

const MAX_GRAPHQL_QUERY_COMPLEXITY = 20

// Query complexity allows you to define how complex certain fields are, and
// to restrict queries with a maximum complexity.
// NOTE : Each field has a default complexity of 1.
@Plugin()
export class GraphQLQueryComplexityPlugin implements ApolloServerPlugin {
  constructor(private readonly graphQLSchemaHost: GraphQLSchemaHost) {}

  async requestDidStart(): Promise<GraphQLRequestListener<BaseContext>> {
    const { schema } = this.graphQLSchemaHost

    return {
      async didResolveOperation({ request, document }) {
        const complexity = getComplexity({
          schema,
          operationName: request.operationName,
          query: document,
          variables: request.variables,
          estimators: [fieldExtensionsEstimator(), simpleEstimator({ defaultComplexity: 1 })]
        })

        if (complexity > MAX_GRAPHQL_QUERY_COMPLEXITY) {
          throw new GraphQLError(
            `Query is too complex: ${complexity}. Maximum allowed complexity: ${MAX_GRAPHQL_QUERY_COMPLEXITY}`
          )
        }
      }
    }
  }
}
