import { AmqpConnection } from "@golevelup/nestjs-rabbitmq"

import { Controller, Get, Post } from "@nestjs/common"

import { RegistrationService } from "./registration.service"

@Controller("registration")
export class RegistrationController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly registrationService: RegistrationService
  ) {}

  @Get("send")
  async send() {
    this.amqpConnection.publish("registration", "hello", { pattern: "join", msg: "hello world" })
    // this.registrationService.createJwt("hello")
    return ""
  }
}
