import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq"

import { Controller } from "@nestjs/common"

import { EventsGateway } from "./events.gateway"
import { RegistrationService } from "./registration.service"

@Controller("minecrafft")
export class MinecraftController {
  constructor(private io: EventsGateway, private registrationService: RegistrationService) {}

  @RabbitSubscribe({
    exchange: "minecraft",
    routingKey: "playerLeave",
    queue: "minecraftfPlayerLeave",
    createQueueIfNotExists: true,
    queueOptions: { durable: true },
    allowNonJsonMessages: false
  })
  public async playerLeave(msg: { uuid: string; displayName: string }) {
    console.log(msg.uuid + " left")
    this.io.emit("authorizedLeave", msg)
  }

  @RabbitSubscribe({
    exchange: "minecraft",
    routingKey: "playerJoin",
    queue: "minecraftfPlayerJoin",
    createQueueIfNotExists: true,
    queueOptions: { durable: true },
    allowNonJsonMessages: false
  })
  public async playerJoin(msg: { uuid: string; region: string }) {
    console.log(msg.region)
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
  public async regionEnter(msg) {
    this.io.emit("regionEnter", msg)
  }
}
