import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Mutation, Query, Resolver } from "@nestjs/graphql"
import { CurrentUser } from "src/decorators/current-user"
import { Input } from "src/utils/graphql"
import { CreatePostCommand } from "./commands/create-post"
import { GetPresignedPostImageURLCommand } from "./commands/get-presigned-post-image-url"
import {
  CreatePostRequestBody,
  CreatePostResponseBody,
  GetPostsByAuthorRequestBody,
  GetPostsByAuthorResponseBody
} from "./dtos"
import { PostEntity } from "./entity"
import { GetPostsByAuthorQuery } from "./queries/get-posts-by-author"

@Resolver(() => PostEntity)
export class PostsResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Mutation(() => String)
  async getPresignedPostImageURL(@CurrentUser() userID: number): Promise<string> {
    return this.commandBus.execute(new GetPresignedPostImageURLCommand({ userID }))
  }

  @Mutation(() => CreatePostResponseBody)
  async createPost(
    @CurrentUser() authorID: number,
    @Input() input: CreatePostRequestBody
  ): Promise<CreatePostResponseBody> {
    return this.commandBus.execute(new CreatePostCommand({ authorID, ...input }))
  }

  @Query(() => GetPostsByAuthorResponseBody)
  async getPostsByAuthor(
    @Input() input: GetPostsByAuthorRequestBody
  ): Promise<GetPostsByAuthorResponseBody> {
    return this.queryBus.execute(new GetPostsByAuthorQuery(input))
  }
}
