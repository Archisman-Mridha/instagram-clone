import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CreateProfileHandler } from "./commands/create-profile"
import { IndexProfileHandler } from "./commands/index-profile"
import { ProfileEntity } from "./entity"
import { ProfilesResolver } from "./graphql/resolvers"
import { GetProfileByIDHandler } from "./queries/get-profile-by-id"
import { GetProfilePreviewByIDHandler } from "./queries/get-profile-preview-by-id"
import { SearchProfilesHandler } from "./queries/search-profiles"
import { ConfigService } from "@nestjs/config"
import z from "zod"
import { ConfigSchema } from "../../config/config"
import { ElasticsearchModule } from "@nestjs/elasticsearch"

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
