import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq"

import { Controller } from "@nestjs/common"

import { MinecraftService } from "./minecraft.service"
import { RegistrationService } from "./registration.service"

@Controller("minecraft")
export class MinecraftController {
  constructor(
    private registrationService: RegistrationService,
    private minecraftService: MinecraftService
  ) {}

  @RabbitSubscribe({
    exchange: "minecraft",
    routingKey: "playerLeave",
    queue: "minecraftfPlayerLeave",
    createQueueIfNotExists: true,
    queueOptions: { durable: true },
    allowNonJsonMessages: false
  })
  public async playerLeave(msg: { uuid: string }) {
    return this.minecraftService.playerLeave(msg.uuid)
  }

  @RabbitSubscribe({
    exchange: "minecraft",
    routingKey: "playerJoin",
    queue: "minecraftfPlayerJoin",
    createQueueIfNotExists: true,
    queueOptions: { durable: true },
    allowNonJsonMessages: false
  })
  public async playerJoin(msg: { uuid: string }) {
    return this.registrationService.authenticateUser(msg.uuid)
  }

  @RabbitSubscribe({
    exchange: "minecraft",
    routingKey: "regionEnter",
    queue: "minecraftRegionEnter",
    createQueueIfNotExists: true,
    queueOptions: { durable: true },
    allowNonJsonMessages: false
  })
  public async regionEnter(msg: { uuid: string; region: string }) {
    return this.minecraftService.regionEnter(msg.uuid, msg.region)
  }
}
