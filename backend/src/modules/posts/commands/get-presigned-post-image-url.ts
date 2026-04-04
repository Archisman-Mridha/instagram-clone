import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { Inject } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Command, CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { randomUUID } from "crypto"
import { ConfigSchema } from "src/config/config"
import { Provider } from "src/utils/providers"
import z from "zod"

const PRESIGNED_POST_IMAGE_URL_TTL = 300 // seconds.

export interface GetPresignedPostImageURLInput {
  userID: number
}

export class GetPresignedPostImageURLCommand extends Command<string> {
  constructor(readonly input: GetPresignedPostImageURLInput) {
    super()
  }
}

@CommandHandler(GetPresignedPostImageURLCommand)
export class GetPresignedPostImageURLHandler implements ICommandHandler<GetPresignedPostImageURLCommand> {
  imageBucket: string

  constructor(
    private readonly configService: ConfigService<z.infer<typeof ConfigSchema>>,

    @Inject(Provider.S3_CLIENT)
    private readonly s3Client: S3Client
  ) {
    this.imageBucket = this.configService.getOrThrow("AWS_S3_BUCKET")
  }

  async execute({ input }: GetPresignedPostImageURLCommand): Promise<string> {
    const objectKey = `posts/${input.userID}/${randomUUID()}`

    const putObjectCommand = new PutObjectCommand({ Bucket: this.imageBucket, Key: objectKey })

    return getSignedUrl(this.s3Client, putObjectCommand, {
      expiresIn: PRESIGNED_POST_IMAGE_URL_TTL
    })
  }
}
