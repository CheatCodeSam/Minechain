import { BigNumber } from "ethers"

export interface Token {
    owner: string
    price: BigNumber
    deposit: BigNumber
    lastTaxPaidDate: BigNumber
    lastPriceChangeDate: BigNumber
    cumulativePrice: BigNumber
    priceChangeCount: BigNumber
}