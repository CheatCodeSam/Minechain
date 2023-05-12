import { Injectable } from '@nestjs/common'
import { BlockchainService } from '../blockchain/blockchain.service'
import { BigNumber as bn } from 'ethers'
import { InjectRepository } from '@nestjs/typeorm'
import { Property } from './property.entity'
import { Repository } from 'typeorm'
import { UserService } from '../user/user.service'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'

@Injectable()
export class PropertyService {
  constructor(
    private readonly blockchainService: BlockchainService,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    private readonly userService: UserService,
    private readonly amqpConnection: AmqpConnection
  ) {}

  async findOne(tokenId: number) {
    let property: Property = null
    if (!property) property = await this.updateProperty(tokenId)
    return property
  }

  public async priceChange(
    owner: string,
    tokenId: bn,
    oldPrice: bn,
    newPrice: bn
  ) {
    this.amqpConnection.publish('blockchain', 'priceChanged', {
      owner,
      tokenId: tokenId.toNumber(),
      oldPrice: oldPrice.toString(),
      newPrice: newPrice.toString(),
    })
  }

  public async sold(from: string, to: string, tokenId: bn, price: bn) {
    console.log(from, to, tokenId.toNumber())
    console.log(this.amqpConnection)

    this.amqpConnection.publish('blockchain', 'sold', {
      from,
      to,
      tokenId: tokenId.toNumber(),
      price: price.toString(),
    })
  }

  public async repossessed(from: string, to: string, tokenId: bn) {
    this.amqpConnection.publish('blockchain', 'repossessed', {
      from,
      to,
      tokenId: tokenId.toNumber(),
    })
  }

  private async updateProperty(tokenId: number): Promise<Property> {
    const property = await this.blockchainService.findOne(tokenId)
    const user = await this.userService.findOne({
      publicAddress: property.owner,
    })

    await this.propertyRepo.upsert(
      {
        id: tokenId,
        ownerAddress: property.owner,
        price: property.price.toString(),
        deposit: property.deposit.toString(),
        lastTaxPaidDate: property.lastTaxPaidDate.toString(),
        cumulativePrice: property.cumulativePrice.toString(),
        lastPriceChangeDate: property.lastPriceChangeDate.toString(),
        priceChangeCount: property.priceChangeCount,
        ownerId: user?.id,
      },
      ['id']
    )

    return this.propertyRepo.findOne({
      where: { id: tokenId },
      relations: ['owner'],
    })
  }
}
