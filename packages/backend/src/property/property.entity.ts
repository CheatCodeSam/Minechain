import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'
import { User } from '../user/user.entity'
import { BigNumber as bn } from 'ethers'

@Entity()
export class Property extends BaseEntity {
  @PrimaryColumn()
  id: number

  @Column()
  ownerAddress: string

  @Column({ nullable: true })
  ownerId: number

  @ManyToOne(() => User, (user) => user.properties)
  @JoinColumn({ name: 'ownerId' })
  owner: User

  @Column()
  price: string
  @Column()
  deposit: string
  @Column()
  lastTaxPaidDate: string
  @Column()
  lastPriceChangeDate: string
  @Column()
  cumulativePrice: string
  @Column()
  priceChangeCount: number

  private calculateTax(when: Date): bn {
    const SECONDS_IN_YEAR = 31536000
    const TAX_RATE_IN_PERCENT = 10

    const whenInSeconds = bn.from(Math.floor(when.getTime() / 1000))
    const holdingDuration = whenInSeconds.sub(this.lastTaxPaidDate)
    const averagePrice = bn
      .from(this.cumulativePrice)
      .div(this.priceChangeCount + 1)
    const taxAmount = averagePrice.mul(TAX_RATE_IN_PERCENT).mul(holdingDuration)
    return taxAmount.div(100 * SECONDS_IN_YEAR)
  }
}
