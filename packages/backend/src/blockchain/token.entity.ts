import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { User } from "../users/entities/user.entity"

@Entity()
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  tokenId: number

  @Column({ name: "userId" })
  public userId: number

  @ManyToOne(() => User, (user) => user.tokens)
  @JoinColumn({ name: "userId" })
  user: User
}
