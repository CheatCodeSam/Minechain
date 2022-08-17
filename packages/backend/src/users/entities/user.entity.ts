import { generate as generateShortUuid } from "short-uuid"
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

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

  @BeforeInsert()
  private addNonce() {
    this.nonce = generateShortUuid()
  }
}
