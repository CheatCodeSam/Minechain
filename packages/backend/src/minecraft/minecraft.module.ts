import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq"

import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { User } from "../users/entities/user.entity"
import { UsersModule } from "../users/users.module"
import { RegistrationController } from "./registration.controller"
import { RegistrationService } from "./registration.service"

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: "amqp://localhost:5672",
      exchanges: [{ name: "registration", type: "direct" }]
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService]
})
export class MinecraftModule {}
