import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { BlockchainService } from '../blockchain/blockchain.service'
import { BigNumber as bn } from 'ethers'
import { InjectRepository } from '@nestjs/typeorm'
import { Property } from './property.entity'
import { Repository } from 'typeorm'
import { UserService } from '../user/user.service'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { WebSocketGateway } from '../websocket/websocket.gateway'

@Injectable()
export class PropertyService implements OnModuleInit {
  private readonly logger = new Logger(PropertyService.name)

  constructor(
    private readonly blockchainService: BlockchainService,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    private readonly userService: UserService,
    private readonly webSocketGateway: WebSocketGateway,
    private readonly amqpConnection: AmqpConnection
  ) {}

  async onModuleInit() {
    const items = await this.propertyRepo
      .createQueryBuilder()
      .where('Property.id >= :startId AND Property.id <= :endId', {
        startId: 0,
        endId: 1023,
      })
      .getMany()
    const foundItemIds = new Set(items.map((item) => item.id))
    const allIds = Array.from({ length: 1024 }, (_, i) => i)
    const missingIds = allIds.filter((id) => !foundItemIds.has(id))
    let i = 1
    const logStep = missingIds.length / 10
    for (const id of missingIds) {
      await this.updateProperty(id)
      i++
      if (Math.floor(i % logStep) === 0) {
        this.logger.log(
          `Caching smart contract: ${Math.floor(
            (i / missingIds.length) * 100
          )}%`
        )
      }
    }
    if (missingIds.length) this.logger.log(`Caching smart contract: 100%`)
  }

  async findOne(tokenId: number) {
    return this.propertyRepo.findOneBy({ id: tokenId })
  }

  async findAll(take: number, skip: number) {
    take = take || 10
    skip = skip || 0
    const [result, total] = await this.propertyRepo.findAndCount({
      order: { id: 'ASC' },
      take: take,
      skip: skip,
    })
    return {
      data: result,
      count: total,
    }
  }

  public async priceChange(
    owner: string,
    tokenId: bn,
    oldPrice: bn,
    newPrice: bn
  ) {
    this.updateProperty(tokenId.toNumber())
    this.webSocketGateway.emit('blockchain', 'priceChanged', {
      owner,
      tokenId: tokenId.toNumber(),
      oldPrice: oldPrice.toString(),
      newPrice: newPrice.toString(),
    })
    this.amqpConnection.publish('blockchain', 'priceChanged', {
      owner,
      tokenId: tokenId.toNumber(),
      oldPrice: oldPrice.toString(),
      newPrice: newPrice.toString(),
    })
  }

  public async sold(from: string, to: string, tokenId: bn, price: bn) {
    this.updateProperty(tokenId.toNumber())
    this.webSocketGateway.emit('blockchain', 'sold', {
      from,
      to,
      tokenId: tokenId.toNumber(),
      price: price.toString(),
    })
    this.amqpConnection.publish('blockchain', 'sold', {
      from,
      to,
      tokenId: tokenId.toNumber(),
      price: price.toString(),
    })
  }

  public async repossessed(from: string, to: string, tokenId: bn) {
    this.updateProperty(tokenId.toNumber())
    this.webSocketGateway.emit('blockchain', 'repossessed', {
      from,
      to,
      tokenId: tokenId.toNumber(),
    })
    this.amqpConnection.publish('blockchain', 'repossessed', {
      from,
      to,
      tokenId: tokenId.toNumber(),
    })
  }

  private async updateProperty(tokenId: number): Promise<Property> {
    const property = await this.blockchainService.findOne(tokenId)
    let user = await this.userService.findOne({
      publicAddress: property.owner.toLowerCase(),
    })
    if (!user) user = await this.userService.createUser(property.owner.toLowerCase())

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
        ownerId: user.id,
      },
      ['id']
    )

    return this.propertyRepo.findOne({
      where: { id: tokenId },
      relations: ['owner'],
    })
  }
}
