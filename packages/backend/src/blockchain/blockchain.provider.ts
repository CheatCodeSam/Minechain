import { abi, Minechain } from '@minechain/eth-types'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BigNumber as bn, ethers } from 'ethers'
import {
  EthersContract,
  InjectContractProvider,
  InjectEthersProvider,
} from 'nestjs-ethers'
import { PropertyService } from '../property/property.service'

@Injectable()
export class BlockchainProvider {
  constructor(
    @InjectContractProvider('lcl')
    private readonly ethersContract: EthersContract,
    @InjectEthersProvider('lcl')
    private readonly rpcProvider: ethers.providers.StaticJsonRpcProvider,
    private readonly configService: ConfigService,
    private readonly propertyService: PropertyService
  ) {
    const contractAddress = this.configService.get('CONTRACT_ADDRESS')
    const contract = this.ethersContract.create(
      contractAddress,
      abi
    ) as Minechain

    this.rpcProvider.once('block', () => {
      contract.on(
        contract.filters.Sold(),
        (from: string, to: string, tokenId: bn, price: bn) =>
          this.propertyService.sold(from, to, tokenId, price)
      )
      contract.on(
        contract.filters.Repossessed(),
        (from: string, to: string, tokenId: bn) =>
          this.propertyService.repossessed(from, to, tokenId)
      )
      contract.on(
        contract.filters.PriceChanged(),
        (owner: string, tokenId: bn, oldPrice: bn, newPrice: bn) =>
          this.propertyService.priceChange(owner, tokenId, oldPrice, newPrice)
      )
    })
  }
}
