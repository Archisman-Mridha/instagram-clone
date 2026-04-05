import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "followships" })
export class FollowshipEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @Column({ type: "integer" })
  followerID: number

  @Index()
  @Column({ type: "integer" })
  followeeID: number
}
