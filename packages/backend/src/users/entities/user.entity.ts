import { generate as generateShortUuid } from "short-uuid"
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm"

import { Token } from "../../blockchain/token.entity"

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

  @Column({ nullable: true })
  mojangId: string

  @CreateDateColumn()
  dateJoined: Date

  @Column({ nullable: true })
  lastLogin: Date

  @Column({ default: false })
  isSuperUser: boolean

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[]

  @BeforeInsert()
  private addNonce() {
    this.nonce = generateShortUuid()
  }
}
