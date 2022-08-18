import { AmqpConnection } from "@golevelup/nestjs-rabbitmq"
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq"

import { Injectable } from "@nestjs/common"

@Injectable()
export class RegistrationService {
  @RabbitSubscribe({
    exchange: "registration",
    routingKey: "",
    queue: "",
    createQueueIfNotExists: true,
    queueOptions: { durable: true },
    allowNonJsonMessages: false
  })
  public async pubSubHandler(msg: any) {
    console.log(`Received message: ${JSON.stringify(msg)}`)
  }
}
