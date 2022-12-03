import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq"

import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { User } from "../users/entities/user.entity"
import { UsersModule } from "../users/users.module"
import { UsersService } from "../users/users.service"
import { BlockchainController } from "./blockchain.controller"
import { BlockchainService } from "./blockchain.service"
import { Token } from "./token.entity"

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: "amqp://localhost:5672",
      exchanges: [
        { name: "blockchain", type: "direct" },
        { name: "minecraft", type: "direct" }
      ],
      enableControllerDiscovery: true
    }),
    TypeOrmModule.forFeature([User, Token]),
    UsersModule
  ],
  controllers: [BlockchainController],
  providers: [BlockchainService]
})
export class BlockchainModule {}
