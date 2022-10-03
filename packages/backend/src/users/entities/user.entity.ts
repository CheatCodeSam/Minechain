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

const formatPublicAddress = (address: string) => {
  return address.substring(0, 5) + "..." + address.substring(address.length - 4)
}

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

  public get fullName(): string {
    return formatPublicAddress(this.publicAddress)
  }
}
