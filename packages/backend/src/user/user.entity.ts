import { generate as generateShortUuid } from 'short-uuid'
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Exclude, Expose } from 'class-transformer'
import { Property } from '../property/property.entity'

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

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  playerHeadKey: string

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'timestamptz', nullable: true })
  playerHeadRefresh: Date

  @OneToMany(() => Property, (property: Property) => property.owner)
  properties: Property[]

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

  @Expose()
  public get profilePicture(): string {
    return "/api/player-head/" + this.playerHeadKey
  }

}
