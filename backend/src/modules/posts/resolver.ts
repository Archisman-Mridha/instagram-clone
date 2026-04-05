import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql"
import { CurrentUser } from "src/decorators/current-user"
import { ProfilePreview } from "../profiles/dtos"
import { GetProfilePreviewByIDQuery } from "../profiles/queries/get-profile-preview-by-id"
import { CreatePostCommand } from "./commands/create-post"
import { GetPresignedPostImageURLCommand } from "./commands/get-presigned-post-image-url"
import { CreatePostArgs, GetPostArgs, GetPostsByAuthorArgs, Post, Posts } from "./dtos"
import { GetPostByIDQuery } from "./queries/get-post-by-id"
import { GetPostsByAuthorQuery } from "./queries/get-posts-by-author"

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

  @ResolveField(() => ProfilePreview)
  async authorProfilePreview(@Parent() post: Post): Promise<ProfilePreview> {
    return this.queryBus.execute(new GetProfilePreviewByIDQuery({ id: post.authorID }))
  }
}
