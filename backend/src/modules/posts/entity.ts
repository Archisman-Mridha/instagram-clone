import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm"
import { ProfilePreview } from "../profiles/dtos"

const DESCRIPTION_MAX_LENGTH = 100

@ObjectType()
@Entity({ name: "posts" })
export class PostEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => Int)
  @Index()
  @Column({ type: "integer" })
  authorID: number

  @Field(() => ProfilePreview)
  authorProfilePreview: ProfilePreview

  @Field()
  @Column({ type: "text" })
  imageURL: string

  @Field({ nullable: true })
  @Column({ type: "varchar", nullable: true, length: DESCRIPTION_MAX_LENGTH })
  description?: string
}
