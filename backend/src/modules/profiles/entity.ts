import { Field, ID, ObjectType } from "@nestjs/graphql"
import { IsAlpha, Length, Max, Validate } from "class-validator"
import { Column, Entity, Index, PrimaryColumn } from "typeorm"
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH, USERNAME_MAX_LENGTH } from "../users/entity"
import { UsernameValidator } from "../users/validators"

const BIO_MAX_LENGTH = 100

@ObjectType()
@Entity({ name: "profiles" })
export class ProfileEntity {
  @Field(() => ID)
  @PrimaryColumn()
  id: number

  @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
  @IsAlpha()
  @Field()
  @Column({ type: "varchar", length: NAME_MAX_LENGTH })
  name: string

  @Validate(UsernameValidator)
  @Index({ unique: true })
  @Field()
  @Column({ type: "varchar", length: USERNAME_MAX_LENGTH })
  username: string

  @Max(BIO_MAX_LENGTH)
  @Field({ nullable: true })
  @Column({ type: "varchar", nullable: true, length: BIO_MAX_LENGTH })
  bio?: string
}
