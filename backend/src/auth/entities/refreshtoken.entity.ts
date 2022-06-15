import { User } from "../../users/entities/user.entity"
import { Entity, Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

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
