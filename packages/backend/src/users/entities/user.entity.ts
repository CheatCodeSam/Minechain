import { generate as generateShortUuid } from "short-uuid"
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm"

import { RefreshToken } from "../../auth/entities/refreshtoken.entity"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: false })
  isActive: boolean

  @Column()
  nonce: string

  @Column({ unique: true })
  publicAddress: string

  @CreateDateColumn()
  dateJoined: Date

  @Column({ nullable: true })
  lastLogin: Date

  @Column({ default: false })
  isSuperUser: boolean

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[]

  @BeforeInsert()
  private addNonce() {
    this.nonce = generateShortUuid()
  }
}
