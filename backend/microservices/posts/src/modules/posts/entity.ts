import { POST_DESCRIPTION_MAX_LENGTH } from "@instagram-clone/lib/validators/validators"
import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm"

@ObjectType({ isAbstract: true })
@Entity({ name: "posts" })
export class PostEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => Int)
  @Index()
  @Column({ type: "integer" })
  authorID: number

  @Field()
  @Column({ type: "text" })
  imageURL: string

  @Field({ nullable: true })
  @Column({ type: "varchar", nullable: true, length: POST_DESCRIPTION_MAX_LENGTH })
  description?: string
}
