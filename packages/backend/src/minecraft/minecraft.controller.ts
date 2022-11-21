import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq"
import { Server } from "socket.io"

import { Controller } from "@nestjs/common"
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from "@nestjs/websockets"

import { EventsGateway } from "./events.gateway"
import { RegistrationService } from "./registration.service"

@Controller("minecrafft")
export class MinecraftController {
  constructor(private io: EventsGateway, private registrationService: RegistrationService) {}

  @RabbitSubscribe({
    exchange: "registration",
    routingKey: "playerJoin",
    queue: "nestRegistration",
    createQueueIfNotExists: true,
    queueOptions: { durable: true },
    allowNonJsonMessages: false
  })
  public async playerJoin(msg: { uuid: string; displayName: string }) {
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
    this.io.emit("g", msg)
  }
}
