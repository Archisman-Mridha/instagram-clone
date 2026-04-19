import { NAME_MAX_LENGTH, USERNAME_MAX_LENGTH } from "@instagram-clone/lib/validators/validators"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { IsAlpha } from "class-validator"
import { Column, Entity, Index, PrimaryColumn } from "typeorm"

const BIO_MAX_LENGTH = 100

@ObjectType({ isAbstract: true })
@Entity({ name: "profiles" })
export class ProfileEntity {
  @Field(() => ID)
  @PrimaryColumn()
  id: number

  @IsAlpha()
  @Field()
  @Column({ type: "varchar", length: NAME_MAX_LENGTH })
  name: string

  @Index({ unique: true })
  @Field()
  @Column({ type: "varchar", length: USERNAME_MAX_LENGTH })
  username: string

  @Field({ nullable: true })
  @Column({ type: "varchar", nullable: true, length: BIO_MAX_LENGTH })
  bio?: string
}
