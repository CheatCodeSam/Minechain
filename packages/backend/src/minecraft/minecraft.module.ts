import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq"

import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { User } from "../users/entities/user.entity"
import { UsersModule } from "../users/users.module"
import { EventsGateway } from "./events.gateway"
import { MinecraftController } from "./minecraft.controller"
import { MinecraftService } from "./minecraft.service"
import { RegistrationController } from "./registration.controller"
import { RegistrationService } from "./registration.service"

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: "amqp://localhost:5672",
      exchanges: [
        { name: "registration", type: "direct" },
        { name: "minecraft", type: "direct" },
        { name: "proxy", type: "direct" }
      ],
      enableControllerDiscovery: true
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule
  ],
  controllers: [RegistrationController, MinecraftController],
  providers: [RegistrationService, EventsGateway, MinecraftService]
})
export class MinecraftModule {}
