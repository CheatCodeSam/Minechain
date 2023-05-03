import { abi, Minechain } from '@minechain/eth-types'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BigNumber, ethers } from 'ethers'
import {
  EthersContract,
  InjectContractProvider,
  InjectEthersProvider,
} from 'nestjs-ethers'
import { BlockchainService } from './blockchain.service'

@Injectable()
export class BlockchainProvider {
  constructor(
    @InjectContractProvider('lcl')
    private readonly ethersContract: EthersContract,
    @InjectEthersProvider('lcl')
    private readonly rpcProvider: ethers.providers.StaticJsonRpcProvider,
    private readonly configService: ConfigService,
    private readonly blockchainService: BlockchainService
  ) {
    const contractAddress = this.configService.get('CONTRACT_ADDRESS')
    const contract = this.ethersContract.create(
      contractAddress,
      abi
    ) as Minechain

    this.rpcProvider.once('block', () => {
      contract.on(contract.filters.Sold(), this.sold)
      contract.on(contract.filters.Repossessed(), this.repossessed)
      contract.on(contract.filters.PriceChanged(), this.pricechanged)
    })
  }

  async pricechanged(
    owner: string,
    tokenId: BigNumber,
    oldPrice: BigNumber,
    newPrice: BigNumber
  ) {
    this.blockchainService.priceChanged(owner, tokenId, oldPrice, newPrice)
  }

  async repossessed(from: string, to: string, tokenId: BigNumber) {
    this.blockchainService.repossessed(from,to,tokenId)
  }

  async sold(from: string, to: string, tokenId: BigNumber, price: BigNumber) {
    this.blockchainService.sold(from, to, tokenId, price)
  }
}
