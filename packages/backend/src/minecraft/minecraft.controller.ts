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

@Controller("minecrafft")
export class MinecraftController {
  constructor(private io: EventsGateway) {}

  @RabbitSubscribe({
    exchange: "minecraft",
    routingKey: "regionEnter",
    queue: "minecraftRegionEnter",
    createQueueIfNotExists: true,
    queueOptions: { durable: true },
    allowNonJsonMessages: false
  })
  public async other(msg) {
    this.io.emit("g", msg)
  }
}
