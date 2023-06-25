import { Injectable, Logger } from '@nestjs/common'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { PropertyFindService } from './property-find.service'
import { PropertySyncService } from './property-sync.service'
import { instanceToPlain } from 'class-transformer'
import { Property } from '../property.entity'
import { OnEvent } from '@nestjs/event-emitter'
import { PropertyUpdateEvent } from '../events/property-update.event'
import { In } from 'typeorm'
import { WebSocketGateway } from '../../websocket/websocket.gateway'

@Injectable()
export class PropertyService {
  private readonly logger = new Logger(PropertyService.name)

  constructor(
    private readonly propertyFindService: PropertyFindService,
    private readonly propertySyncService: PropertySyncService,
    private readonly amqpConnection: AmqpConnection,
    private readonly webSocketGateway: WebSocketGateway
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

  public async updatePropertyById(tokenId: number) {
    const retVal = await this.propertyFindService.findOne(tokenId)
    this.handlePropertyUpdate({properties: [retVal]})
  }

  public async find(take: number, skip: number) {
    return this.propertyFindService.find(take, skip, {})
  }

  public async findAll() {
    return this.propertyFindService.findAll()
  }

  public async findOne(id: number) {
    return this.propertyFindService.findOne(id)
  }

  private async emitUpdates(properties: Property[]) {
    const plainProperties = instanceToPlain(properties)
    this.amqpConnection.publish('property', 'update', {
      properties: plainProperties,
    })
    this.webSocketGateway.emit('property', 'update', {
      properties: plainProperties
    })
  }

  @OnEvent('property.update', { async: true })
  async handlePropertyUpdate(payload: PropertyUpdateEvent) {
    await this.propertySyncService.syncProperties(payload.properties)
    const ids = payload.properties.map(prop => prop.id)
    const properties = await this.propertyFindService.find(1024, 0, {
      id: In(ids),
    })
    this.emitUpdates(properties.data)
  }
}
