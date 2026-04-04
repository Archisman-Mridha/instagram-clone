import { Field, Int, ObjectType } from "@nestjs/graphql"
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm"

@ObjectType()
@Entity({ name: "followships" })
export class FollowshipEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => Int)
  @Index()
  @Column({ type: "integer" })
  followerID: number

  @Field(() => Int)
  @Index()
  @Column({ type: "integer" })
  followeeID: number
}
