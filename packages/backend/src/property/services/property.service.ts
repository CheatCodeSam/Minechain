import { Injectable, Logger } from '@nestjs/common'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { PropertyFindService } from './property-find.service'
import { PropertySyncService } from './property-sync.service'
import { instanceToPlain } from 'class-transformer'
import { User } from '../../user/user.entity'
import { Property } from '../property.entity'

@Injectable()
export class PropertyService {
  private readonly logger = new Logger(PropertyService.name)

  constructor(
    private readonly propertyFindService: PropertyFindService,
    private readonly propertySyncService: PropertySyncService,
    private readonly amqpConnection: AmqpConnection
  ) {}

  public async initialize() {
    const { count } = await this.propertyFindService.findAll()

    if (count < 1024) {
      const logStep = 1024 / 10
      for (let i = 0; i < 1024; i++) {
        await this.propertySyncService.syncSinglePropertyById(i)
        if (Math.floor(i % logStep) === 0) {
          this.logger.log(
            `Caching smart contract: ${Math.floor((i / 1024) * 100)}%`
          )
        }
      }
    }
  }

  public async accountLink(owner: User) {
    const { data: properties, count } = await this.propertyFindService.find(
      1024,
      0,
      {
        ownerAddress: owner.publicAddress,
      }
    )
    if (count !== 0) {
      await this.propertySyncService.syncProperties(properties)
      this.emitUpdates(properties)
    }
  }

  public async sold(tokenId: number) {
    await this.propertySyncService.syncSinglePropertyById(tokenId)
    const retVal = await this.propertyFindService.findOne(tokenId)
    this.emitUpdates([retVal])
    return retVal
  }

  public async repossessed(tokenId: number) {
    await this.propertySyncService.syncSinglePropertyById(tokenId)
    const retVal = await this.propertyFindService.findOne(tokenId)
    this.emitUpdates([retVal])
    return retVal
  }

  public async priceChange(tokenId: number) {
    await this.propertySyncService.syncSinglePropertyById(tokenId)
    const retVal = await this.propertyFindService.findOne(tokenId)
    this.emitUpdates([retVal])
    return retVal
  }

  public async find(take: number, skip: number) {
    return this.propertyFindService.find(take, skip, {})
  }

  public async findOne(id: number) {
    return this.propertyFindService.findOne(id)
  }

  private async emitUpdates(properties: Property[]) {
    const plainProperties = instanceToPlain(properties)
    this.amqpConnection.publish('blockchain', 'update', {
      properties: plainProperties,
    })
  }
}
