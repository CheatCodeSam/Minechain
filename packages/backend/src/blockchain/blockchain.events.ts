import { BigNumber } from 'ethers'

export interface SoldEvent {
  from: string
  to: string
  tokenId: BigNumber
  price: BigNumber
}

export interface RepossessedEvent {
  from: string
  to: string
  tokenId: BigNumber
}

export interface PriceChangedEvent {
  owner: string
  tokenId: BigNumber
  oldPrice: BigNumber
  newPrice: BigNumber
}
