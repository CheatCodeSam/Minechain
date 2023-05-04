export interface Token {
  owner: string
  price: string
}

export interface SoldAction {
  from: string
  to: string
  tokenId: number
  price: string
}

export interface RepossessedAction {
  from: string
  to: string
  tokenId: number
}

export interface PriceChangedAction {
  owner: string
  tokenId: number
  oldPrice: string
  newPrice: string
}
