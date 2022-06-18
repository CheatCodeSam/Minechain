import { generate as generateShortUuid } from "short-uuid"
import { RefreshToken } from "src/auth/entities/refreshtoken.entity"
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm"

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
