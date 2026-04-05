import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { ElasticsearchModule } from "@nestjs/elasticsearch"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigSchema } from "src/config/config"
import z from "zod"
import { CreateProfileHandler } from "./commands/create-profile"
import { IndexProfileHandler } from "./commands/index-profile"
import { ProfileEntity } from "./entity"
import { GetProfileByIDHandler } from "./queries/get-profile-by-id"
import { GetProfilePreviewByIDHandler } from "./queries/get-profile-preview-by-id"
import { SearchProfilesHandler } from "./queries/search-profiles"
import { ProfilesResolver } from "./resolver"

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
    GetProfilePreviewByIDHandler,
    GetProfileByIDHandler
  ]
})
export class ProfilesModule {}
