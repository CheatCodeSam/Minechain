import { AmqpConnection } from "@golevelup/nestjs-rabbitmq"

import { Controller, Get, Post } from "@nestjs/common"

@Controller("registration")
export class RegistrationController {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  @Get("send")
  async send() {
    this.amqpConnection.publish("registration", "", { pattern: "join", msg: "hello world" })
    return ""
  }
}
