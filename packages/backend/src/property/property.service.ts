import { Injectable, Logger } from '@nestjs/common'
import { BlockchainService } from '../blockchain/blockchain.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Property } from './property.entity'
import { Repository } from 'typeorm'
import { UserService } from '../user/user.service'
import { instanceToPlain } from 'class-transformer'
import { User } from '../user/user.entity'
import { PropertyRenderService } from '../property-render/property-render.service'

@Injectable()
export class PropertyService {
  private readonly logger = new Logger(PropertyService.name)

  constructor(
    private readonly blockchainService: BlockchainService,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    private readonly userService: UserService,
    private readonly propertyRenderService: PropertyRenderService
  ) {}

  public async initialize() {
    this.logger.log('Initializing property information from blockchain')
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
    let property = await this.propertyRepo.findOneBy({ id: tokenId })
    if (property) {
      property = await this.updatePropertyRenderIfNeeded(property)
    }
    return property
  }

  public async findAll(take: number | null, skip: number | null) {
    take = take || 10
    skip = skip || 0
    const [result, total] = await this.propertyRepo.findAndCount({
      order: { id: 'ASC' },
      take: take,
      skip: skip,
    })

    const updatedProperties = result.map((p) => this.updatePropertyRenderIfNeeded(p))
    const awaitedPromises = await Promise.all(updatedProperties)
    return {
      data: awaitedPromises,
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
    return retVal
  }

  private async updatePropertyRenderIfNeeded(property: Property) {
    if (
      !property.propertyRenderRefresh ||
      property.propertyRenderRefresh.getTime() < Date.now()
    ) {
      await this.updatePropertyRender(property)
      return this.propertyRepo.save(property)
    }
    return property
  }

  private async updatePropertyRender(property: Property) {
    const key = await this.propertyRenderService.getPropertyRender(property.id)
    property.propertyRenderKey = key
    // 15 Minutes
    property.propertyRenderRefresh = new Date(
      new Date().getTime() + 15 * 60 * 1000
    )
  }
}
