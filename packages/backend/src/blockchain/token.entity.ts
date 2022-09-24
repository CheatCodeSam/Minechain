import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { User } from "../users/entities/user.entity"

@Entity()
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  tokenId: number

  @ManyToOne(() => User, (user) => user.tokens)
  user: User
}
