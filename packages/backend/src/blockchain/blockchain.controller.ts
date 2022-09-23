import { AmqpConnection, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq"

import { Controller } from "@nestjs/common"

import { BlockchainService } from "./blockchain.service"

@Controller("blockchain")
export class BlockchainController {
  constructor(private blockchainService: BlockchainService) {}

  @RabbitSubscribe({
    exchange: "blockchain",
    routingKey: "transfer",
    queue: "nestTransfer",
    createQueueIfNotExists: true,
    queueOptions: { durable: true },
    allowNonJsonMessages: false
  })
  public async other(msg: { from: string; to: string; value: string; data }) {
    this.blockchainService.transfer(msg.from, msg.to, msg.value, msg.data)
  }
}
