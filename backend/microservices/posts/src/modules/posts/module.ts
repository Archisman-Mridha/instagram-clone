import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CreatePostHandler } from "./commands/create-post"
import { GetPresignedPostImageURLHandler } from "./commands/get-presigned-post-image-url"
import { PostEntity } from "./entity"
import { PostsResolver } from "./graphql/resolvers"
import { GetPostByIDHandler } from "./queries/get-post-by-id"
import { GetPostsByAuthorHandler } from "./queries/get-posts-by-author"

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])],
  providers: [
    PostsResolver,

    // Commands.
    CreatePostHandler,
    GetPresignedPostImageURLHandler,

    // Queries.
    GetPostsByAuthorHandler,
    GetPostByIDHandler
  ]
})
export class PostsModule {}
