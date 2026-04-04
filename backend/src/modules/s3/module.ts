import { S3Client } from "@aws-sdk/client-s3"
import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { ConfigSchema } from "src/config/config"
import { Provider } from "src/utils/providers"
import z from "zod"

@Module({
  providers: [
    {
      provide: Provider.S3_CLIENT,

      inject: [ConfigService],
      useFactory: (configService: ConfigService<z.infer<typeof ConfigSchema>>) =>
        new S3Client({
          region: configService.getOrThrow("AWS_REGION"),
          credentials: {
            accessKeyId: configService.getOrThrow("AWS_ACCESS_KEY_ID"),
            secretAccessKey: configService.getOrThrow("AWS_SECRET_ACCESS_KEY")
          }
        })
    }
  ],
  exports: [Provider.S3_CLIENT]
})
export class S3Module {}
