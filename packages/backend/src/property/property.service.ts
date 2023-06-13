import { Injectable, Logger } from '@nestjs/common'
import { BlockchainService } from '../blockchain/blockchain.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Property } from './property.entity'
import { Repository } from 'typeorm'
import { UserService } from '../user/user.service'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { instanceToPlain } from 'class-transformer'
import { User } from '../user/user.entity'

@Injectable()
export class PropertyService {
  private readonly logger = new Logger(PropertyService.name)

  constructor(
    private readonly blockchainService: BlockchainService,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    private readonly userService: UserService,
    private readonly amqpConnection: AmqpConnection
  ) {}

  public async initialize() {
    this.logger.log("Initializing property information from blockchain")
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

  public async findOne(tokenId: number) {
    return this.propertyRepo.findOneBy({ id: tokenId })
  }

  public async findAll(take: number, skip: number) {
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

  public async updateProperty(tokenId: number): Promise<Property> {
    const property = await this.blockchainService.findOne(tokenId)
    let user = await this.userService.findOne({
      publicAddress: property.owner.toLowerCase(),
    })
    if (!user)
      user = await this.userService.createUser(property.owner.toLowerCase())

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

    const retVal = await this.propertyRepo.findOne({
      where: { id: tokenId },
      relations: ['owner'],
    })
    retVal.owner = instanceToPlain(retVal.owner) as User
    return retVal;
  }

  public async getHighestBlocks(tokenId: number): Promise<string[][]> {
    return this.amqpConnection.request<string[][]>({
      exchange: 'minecraft',
      routingKey: 'getBlock',
      payload: {
        tokenId: tokenId.toString(),
      },
      timeout: 10000,
    });
  }
}
