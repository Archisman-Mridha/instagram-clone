import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { S3Module } from "../s3/module"
import { CreatePostHandler } from "./commands/create-post"
import { GetPresignedPostImageURLHandler } from "./commands/get-presigned-post-image-url"
import { PostEntity } from "./entity"
import { GetPostsByAuthorHandler } from "./queries/get-posts-by-author"
import { GetPostsByIDsHandler } from "./queries/get-posts-by-ids"
import { PostsResolver } from "./resolver"

@Module({
  imports: [S3Module, TypeOrmModule.forFeature([PostEntity])],
  providers: [
    PostsResolver,

    // Commands.
    CreatePostHandler,
    GetPresignedPostImageURLHandler,

    // Queries.
    GetPostsByAuthorHandler,
    GetPostsByIDsHandler
  ]
})
export class PostsModule {}
