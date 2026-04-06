import { NAME_MAX_LENGTH, USERNAME_MAX_LENGTH } from "@instagram-clone/lib/validators/validators"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import * as bcrypt from "bcrypt"
import { Exclude } from "class-transformer"
import { BeforeInsert, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm"

const EMAIL_MAX_LENGTH = 254

const HASHED_PASSWORD_MAX_LENGTH = 200

const SALT_GENERATION_ROUNDS = 10

@ObjectType({ isAbstract: true })
@Entity({ name: "users" })
export class UserEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column({ type: "varchar", length: NAME_MAX_LENGTH })
  name: string

  @Index({ unique: true })
  @Field()
  @Column({ type: "varchar", length: USERNAME_MAX_LENGTH })
  username: string

  @Index({ unique: true })
  @Field()
  @Column({ type: "varchar", length: EMAIL_MAX_LENGTH })
  email: string

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
