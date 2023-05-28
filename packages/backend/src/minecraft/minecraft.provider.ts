import { RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'
import { Injectable } from '@nestjs/common'
import { MojangIdDto } from '../account-link/dto/mojang-id-dto'
import { MinecraftService } from './minecraft.service'

@Injectable()
export class MinecraftProvider {
  constructor(
    private readonly minecraftService: MinecraftService,
  ) {}

  @RabbitRPC({
    exchange: 'minecraft',
    routingKey: 'authenticate',
    queueOptions: { autoDelete: true },
  })
  public async authenticate({ uuid }: MojangIdDto) {
    return await this.minecraftService.getUser(uuid)
  }

  @RabbitSubscribe({
    exchange: 'minecraft',
    routingKey: 'playerLeave',
    queueOptions: { autoDelete: true },
    allowNonJsonMessages: false,
  })
  public async playerLeave(msg: { uuid: string }) {
    return this.minecraftService.playerLeave(msg.uuid)
  }

  @RabbitSubscribe({
    exchange: 'minecraft',
    routingKey: 'regionEnter',
    queueOptions: { autoDelete: true },
    allowNonJsonMessages: false,
  })
  public async regionEnter(msg: { uuid: string; region: string }) {
    return this.minecraftService.regionEnter(msg.uuid, msg.region)
  }
}
