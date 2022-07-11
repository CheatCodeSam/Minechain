import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { User } from "../../users/entities/user.entity"

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: false })
  blacklisted: boolean

  @CreateDateColumn()
  created: Date

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User
}
