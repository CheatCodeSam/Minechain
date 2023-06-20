import { Injectable } from '@nestjs/common'
import { PropertyService } from './services/property.service'
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq'

@Injectable()
export class PropertyInitializeProvider {
  constructor(
    private readonly propertyService: PropertyService
  ) {}

  @RabbitRPC({
    exchange: 'property',
    routingKey: 'initialize',
    queueOptions: { autoDelete: true },
  })
  public async initialize() {
    return this.propertyService.findAll()
  }

}
