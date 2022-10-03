import { ISession } from "connect-typeorm"
import { BaseEntity, Column, DeleteDateColumn, Entity, Index, PrimaryColumn } from "typeorm"

@Entity()
export class Session extends BaseEntity implements ISession {
  @Index()
  @Column("bigint")
  public expiredAt = Date.now()

  @PrimaryColumn("varchar", { length: 255 })
  public id = ""

  @Column("text")
  public json = ""

  @DeleteDateColumn()
  public destroyedAt?: Date
}
