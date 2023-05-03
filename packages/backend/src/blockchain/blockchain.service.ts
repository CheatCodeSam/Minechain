import { Injectable } from '@nestjs/common'
import { EthersContract, InjectContractProvider } from 'nestjs-ethers'
import { BigNumber } from 'ethers'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { Minechain, abi } from '@minechain/eth-types'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class BlockchainService {
  private readonly contract: Minechain

  constructor(
    @InjectContractProvider('lcl')
    private readonly ethersContract: EthersContract,
    private readonly configService: ConfigService,
    private readonly amqpConnection: AmqpConnection
  ) {
    const contractAddress = this.configService.get('CONTRACT_ADDRESS')
    this.contract = this.ethersContract.create(
      contractAddress,
      abi
    ) as Minechain
  }

  public async findOne(tokenId: number) {
    return this.contract.tokens(tokenId)
  }

  public async priceChanged(
    owner: string,
    tokenId: BigNumber,
    oldPrice: BigNumber,
    newPrice: BigNumber
  ) {
    this.amqpConnection.publish('blockchain', 'priceChanged', {
      owner,
      tokenId: tokenId.toNumber(),
      oldPrice: oldPrice.toString(),
      newPrice: newPrice.toString()
    })
  }

  public async repossessed(from: string, to: string, tokenId: BigNumber) {
    this.amqpConnection.publish('blockchain', 'repossessed', {
        from, to, tokenId: tokenId.toNumber()
      })
  }

  public async sold(
    from: string,
    to: string,
    tokenId: BigNumber,
    price: BigNumber
  ) {
    this.amqpConnection.publish('blockchain', 'sold', {
        from,
        to,
        tokenId: tokenId.toNumber(),
        price: price.toString()
    })
  }
}
