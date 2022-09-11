import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq"

import { Module } from "@nestjs/common"

import { BlockchainController } from "./blockchain.controller"
import { BlockchainService } from "./blockchain.service"

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: "amqp://localhost:5672",
      exchanges: [{ name: "blockchain", type: "direct" }],
      enableControllerDiscovery: true
    })
  ],
  controllers: [BlockchainController],
  providers: [BlockchainService]
})
export class BlockchainModule {}
