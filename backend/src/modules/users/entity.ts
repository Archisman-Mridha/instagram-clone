import { Field, ID, ObjectType } from "@nestjs/graphql"
import * as bcrypt from "bcrypt"
import { Exclude } from "class-transformer"
import { IsEmail, IsString, Length, Validate } from "class-validator"
import { BeforeInsert, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm"
import { UsernameValidator } from "./validators"

export const NAME_MIN_LENGTH = 3,
  NAME_MAX_LENGTH = 30

export const USERNAME_MIN_LENGTH = 3,
  USERNAME_MAX_LENGTH = 30

const EMAIL_MAX_LENGTH = 254

const HASHED_PASSWORD_MAX_LENGTH = 200

const SALT_GENERATION_ROUNDS = 10

@ObjectType({ isAbstract: true })
@Entity({ name: "users" })
export class UserEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @IsString()
  @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
  @Field()
  @Column({ type: "varchar", length: NAME_MAX_LENGTH })
  name: string

  @Validate(UsernameValidator)
  @Index({ unique: true })
  @Field()
  @Column({ type: "varchar", length: USERNAME_MAX_LENGTH })
  username: string

  @IsEmail()
  @Index({ unique: true })
  @Field()
  @Column({ type: "varchar", length: EMAIL_MAX_LENGTH })
  email: string

  @IsString()
  @Exclude({ toPlainOnly: true }) // Ignore this field when serializing.
  @Field()
  @Column({ type: "varchar", length: HASHED_PASSWORD_MAX_LENGTH })
  password: string

  @BeforeInsert()
  async hashPassword() {
    const hashedPassword = await bcrypt.hash(this.password, SALT_GENERATION_ROUNDS)
    this.password = hashedPassword
  }
}
