import { Injectable } from '@nestjs/common'
import { BlockchainProvider } from '../blockchain/blockchain.provider'
import { BigNumber as bn } from 'ethers'
import { PropertyService } from './property.service'

@Injectable()
export class PropertyProvider {
  constructor(
    private readonly blockchainProvider: BlockchainProvider,
    private readonly propertyService: PropertyService
  ) {
    this.blockchainProvider.sold$.subscribe(({ from, to, tokenId, price }) => {
      this.sold(from, to, tokenId, price)
    })
    this.blockchainProvider.repossessed$.subscribe(({ from, to, tokenId }) => {
      this.repossessed(from, to, tokenId)
    })
    this.blockchainProvider.priceChanged$.subscribe(
      ({ owner, tokenId, oldPrice, newPrice }) => {
        this.priceChange(owner, tokenId, oldPrice, newPrice)
      }
    )
    this.blockchainProvider.deposit$.subscribe(
      ({ from, tokenId, newAmount, amountAdded }) => {
        this.deposit(from, tokenId, newAmount, amountAdded)
      }
    )
    this.blockchainProvider.withdrawal$.subscribe(
      ({ to, tokenId, newAmount, amountWithdrawn }) => {
        this.withdrawal(to, tokenId, newAmount, amountWithdrawn)
      }
    )
  }

  withdrawal(to: string, tokenId: bn, newAmount: bn, amountWithdrawn: bn) {
    this.propertyService.withdrawal(to, tokenId, newAmount, amountWithdrawn)
  }

  deposit(from: string, tokenId: bn, newAmount: bn, amountAdded: bn) {
    this.propertyService.deposit(from, tokenId, newAmount, amountAdded)
  }

  sold(from: string, to: string, tokenId: bn, price: bn) {
    this.propertyService.sold(from, to, tokenId, price)
  }

  repossessed(from: string, to: string, tokenId: bn) {
    this.propertyService.repossessed(from, to, tokenId)
  }

  priceChange(owner: string, tokenId: bn, oldPrice: bn, newPrice: bn) {
    this.propertyService.priceChange(owner, tokenId, oldPrice, newPrice)
  }
}
