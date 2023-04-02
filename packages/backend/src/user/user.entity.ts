import { generate as generateShortUuid } from 'short-uuid'
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Exclude, Expose } from 'class-transformer'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: false })
  isActive: boolean

  @Column()
  @Exclude({ toPlainOnly: true })
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

  @Column({ nullable: true })
  ensName: string

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'timestamptz' })
  ensRefresh: Date

  @BeforeInsert()
  private addNonce() {
    this.nonce = generateShortUuid()
  }

  @Expose()
  public get displayName(): string {
    return this.ensName || (
      this.publicAddress.substring(0, 5) +
      '...' +
      this.publicAddress.substring(this.publicAddress.length - 4)
    )
  }
}
