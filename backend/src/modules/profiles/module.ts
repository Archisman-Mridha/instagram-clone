import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { ElasticsearchModule } from "@nestjs/elasticsearch"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigSchema } from "src/config/config"
import z from "zod"
import { CreateProfileHandler } from "./commands/create-profile"
import { IndexProfileHandler } from "./commands/index-profile"
import { ProfileEntity } from "./entity"
import { SearchProfilesHandler } from "./queries/search-profiles"
import { ProfilesResolver } from "./resolver"
import { GetProfilePreviewHandler } from "./queries/get-profile-preview"
import { GetProfilePreviewsByIDsHandler } from "./queries/get-profile-previews-by-ids"

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      inject: [ConfigService],

      useFactory: async (configService: ConfigService<z.infer<typeof ConfigSchema>>) => ({
        nodes: configService.getOrThrow("ELASTICSEARCH_NODES"),
        compression: true
      })
    }),

    TypeOrmModule.forFeature([ProfileEntity])
  ],
  providers: [
    ProfilesResolver,

    // Commads.
    CreateProfileHandler,
    IndexProfileHandler,

    // Queries.
    SearchProfilesHandler,
    GetProfilePreviewHandler,
    GetProfilePreviewsByIDsHandler
  ]
})
export class ProfilesModule {}
