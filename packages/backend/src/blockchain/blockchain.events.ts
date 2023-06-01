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

export interface DepositEvent {
  from: string
  tokenId: BigNumber
  newAmount: BigNumber
  amountAdded: BigNumber
}

export interface WithdrawalEvent {
  to: string
  tokenId: BigNumber
  newAmount: BigNumber
  amountWithdrawn: BigNumber
}
