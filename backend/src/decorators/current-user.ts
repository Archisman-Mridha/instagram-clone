import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"

export const CurrentUser = createParamDecorator(
  (data: unknown, executionContext: ExecutionContext) => {
    const graphQLExecutionContext = GqlExecutionContext.create(executionContext)
    return graphQLExecutionContext.getContext().req.user
  }
)
