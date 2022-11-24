import { Exclude } from "class-transformer"
import { generate as generateShortUuid } from "short-uuid"
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm"

import { Token } from "../../blockchain/token.entity"

@Entity()
export class User extends BaseEntity {
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

  @Column({ nullable: true })
  lastKnownRegion: string

  @CreateDateColumn()
  dateJoined: Date

  @Column({ nullable: true })
  lastLogin: Date

  @Column({ default: true })
  isSuperUser: boolean

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[]

  @BeforeInsert()
  private addNonce() {
    this.nonce = generateShortUuid()
  }

  public get fullName(): string {
    return (
      this.publicAddress.substring(0, 5) +
      "..." +
      this.publicAddress.substring(this.publicAddress.length - 4)
    )
  }
}
