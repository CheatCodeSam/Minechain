import { Injectable } from '@nestjs/common'
import { BigNumber as bn } from 'ethers'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { WebSocketGateway } from '../websocket/websocket.gateway'
import { PropertyService } from './property.service'

@Injectable()
export class PropertyEventsService {
  constructor(
    private readonly webSocketGateway: WebSocketGateway,
    private readonly amqpConnection: AmqpConnection,
    private readonly propertyService: PropertyService
  ) {}

  public async priceChange(
    owner: string,
    tokenId: bn,
    oldPrice: bn,
    newPrice: bn
  ) {
    const property = await this.propertyService.updateProperty(
      tokenId.toNumber()
    )
    this.webSocketGateway.emit('blockchain', 'priceChanged', {
      owner,
      tokenId: tokenId.toNumber(),
      oldPrice: oldPrice.toString(),
      newPrice: newPrice.toString(),
      property,
    })
    this.amqpConnection.publish('blockchain', 'priceChanged', {
      owner,
      tokenId: tokenId.toNumber(),
      oldPrice: oldPrice.toString(),
      newPrice: newPrice.toString(),
      property,
    })
  }

  public async sold(from: string, to: string, tokenId: bn, price: bn) {
    const property = await this.propertyService.updateProperty(
      tokenId.toNumber()
    )
    this.webSocketGateway.emit('blockchain', 'sold', {
      from,
      to,
      tokenId: tokenId.toNumber(),
      price: price.toString(),
      property,
    })
    this.amqpConnection.publish('blockchain', 'sold', {
      from,
      to,
      tokenId: tokenId.toNumber(),
      price: price.toString(),
      property,
    })
  }

  public async repossessed(from: string, to: string, tokenId: bn) {
    const property = await this.propertyService.updateProperty(
      tokenId.toNumber()
    )
    this.webSocketGateway.emit('blockchain', 'repossessed', {
      from,
      to,
      tokenId: tokenId.toNumber(),
      property,
    })
    this.amqpConnection.publish('blockchain', 'repossessed', {
      from,
      to,
      tokenId: tokenId.toNumber(),
      property,
    })
  }

  async deposit(from: string, tokenId: bn, newAmount: bn, amountAdded: bn) {
    const property = await this.propertyService.updateProperty(
      tokenId.toNumber()
    )
    this.webSocketGateway.emit('blockchain', 'deposit', {
      from,
      tokenId: tokenId.toNumber(),
      newAmount: newAmount.toString(),
      amountAdded: amountAdded.toString(),
      property,
    })
  }
  async withdrawal(
    to: string,
    tokenId: bn,
    newAmount: bn,
    amountWithdrawn: bn
  ) {
    const property = await this.propertyService.updateProperty(
      tokenId.toNumber()
    )
    this.webSocketGateway.emit('blockchain', 'withdrawal', {
      to,
      tokenId: tokenId.toNumber(),
      newAmount: newAmount.toString,
      amountWithdrawn: amountWithdrawn.toString(),
      property,
    })
  }
}
