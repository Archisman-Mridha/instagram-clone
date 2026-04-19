import { Args } from "@instagram-clone/lib/decorators/args"
import { CurrentUser } from "@instagram-clone/lib/decorators/current-user"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Mutation, Query, Resolver } from "@nestjs/graphql"
import { CreatePostCommand } from "../commands/create-post"
import { GetPresignedPostImageURLCommand } from "../commands/get-presigned-post-image-url"
import { GetPostByIDQuery } from "../queries/get-post-by-id"
import { GetPostsByAuthorQuery } from "../queries/get-posts-by-author"
import { CreatePostArgs, GetPostArgs, GetPostsByAuthorArgs } from "./args"
import { Post, Posts } from "./models"

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Mutation(() => String)
  async getPresignedPostImageURL(@CurrentUser() userID: number): Promise<string> {
    return this.commandBus.execute(new GetPresignedPostImageURLCommand({ userID }))
  }

  @Mutation(() => Number)
  async createPost(@CurrentUser() authorID: number, @Args() args: CreatePostArgs): Promise<number> {
    const post = await this.commandBus.execute(new CreatePostCommand({ authorID, ...args }))
    return post.id
  }

  @Query(() => Posts)
  async getPostsByAuthor(@Args() args: GetPostsByAuthorArgs): Promise<Posts> {
    return this.queryBus.execute(new GetPostsByAuthorQuery(args))
  }

  @Query(() => Post)
  async getPostByID(@Args() args: GetPostArgs): Promise<Post> {
    return this.queryBus.execute(new GetPostByIDQuery(args))
  }
}
