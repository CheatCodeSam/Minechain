import { Injectable } from '@nestjs/common'
import { BlockchainService } from '../blockchain/blockchain.service'
import { ethers } from 'ethers'

@Injectable()
export class PropertyService {
  constructor(private readonly blockchainService: BlockchainService) {}

  private SECONDS_IN_YEAR = 31536000
  
  public async serializeProperty(tokenId: number) {
    const prop = await this.blockchainService.findOne(tokenId)

    const firstDayOfNextMonth = new Date()
    firstDayOfNextMonth.setMonth(firstDayOfNextMonth.getMonth() + 1, 1)
    const now = new Date(Date.now())

    return {
      owner: prop.owner,
      price: prop.price.toString(),
      deposit: prop.deposit.toString(),
      lastTaxPaidDate: prop.lastTaxPaidDate.toString(),
      lastPriceChangeDate: prop.lastPriceChangeDate.toString(),
      cumulativePrice: prop.cumulativePrice.toString(),
      priceChangeCount: prop.priceChangeCount.toString(),

      dueNow: this.calculateTax(prop, now).toString(),
      dueOnFirst: this.calculateTax(prop, firstDayOfNextMonth).toString(),
    }
  }

  private calculateTax(token: Awaited<ReturnType<typeof this.blockchainService.findOne>>, when: Date): ethers.BigNumber {
    const whenInSeconds = ethers.BigNumber.from(
      Math.floor(when.getTime() / 1000)
    )
    const holdingDuration = whenInSeconds.sub(token.lastTaxPaidDate)
    const averagePrice = token.cumulativePrice.div(token.priceChangeCount + 1)
    const taxAmount = averagePrice.mul(10).mul(holdingDuration)
    return taxAmount.div(100 * this.SECONDS_IN_YEAR)
  }
}
