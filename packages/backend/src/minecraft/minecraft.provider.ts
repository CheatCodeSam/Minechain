import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'
import { Injectable } from '@nestjs/common'
import { MinecraftService } from './minecraft.service'

@Injectable()
export class MinecraftProvider {
  constructor(
    private readonly minecraftService: MinecraftService
  ) {}

  @RabbitSubscribe({
    exchange: 'minecraft',
    routingKey: 'playerLeave',
    queue: 'minecraftfPlayerLeave',
    createQueueIfNotExists: true,
    allowNonJsonMessages: false,
  })
  public async playerLeave(msg: { uuid: string }) {
    return this.minecraftService.playerLeave(msg.uuid)
  }

  @RabbitSubscribe({
    exchange: 'minecraft',
    routingKey: 'regionEnter',
    queue: 'minecraftRegionEnter',
    createQueueIfNotExists: true,
    allowNonJsonMessages: false,
  })
  public async regionEnter(msg: { uuid: string; region: string }) {
    return this.minecraftService.regionEnter(msg.uuid, msg.region)
  }
}
