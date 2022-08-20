import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq"

import { Module } from "@nestjs/common"

import { RegistrationController } from "./registration.controller"
import { RegistrationService } from "./registration.service"

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: "amqp://localhost:5672",
      exchanges: [{ name: "registration", type: "direct" }]
    })
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService]
})
export class MinecraftModule {}
