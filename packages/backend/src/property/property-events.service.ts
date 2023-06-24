import { Injectable } from '@nestjs/common'
import { BigNumber as bn } from 'ethers'
import { WebSocketGateway } from '../websocket/websocket.gateway'
import { PropertyService } from './services/property.service'

@Injectable()
export class PropertyEventsService {
  constructor(
    private readonly webSocketGateway: WebSocketGateway,
    private readonly propertyService: PropertyService
  ) {}

  public async priceChange(
    _owner: string,
    tokenId: bn,
    _oldPrice: bn,
    _newPrice: bn
  ) {
    this.propertyService.priceChange(tokenId.toNumber())
  }

  public async sold(_from: string, _to: string, tokenId: bn, _price: bn) {
    this.propertyService.sold(tokenId.toNumber())
    console.log('sold')
  }

  public async repossessed(from: string, to: string, tokenId: bn) {
    this.propertyService.repossessed(tokenId.toNumber())
  }

  async deposit(from: string, tokenId: bn, newAmount: bn, amountAdded: bn) {
    this.webSocketGateway.emit('blockchain', 'deposit', {
      from,
      tokenId: tokenId.toNumber(),
      newAmount: newAmount.toString(),
      amountAdded: amountAdded.toString(),
    })
  }
  async withdrawal(
    to: string,
    tokenId: bn,
    newAmount: bn,
    amountWithdrawn: bn
  ) {
    this.webSocketGateway.emit('blockchain', 'withdrawal', {
      to,
      tokenId: tokenId.toNumber(),
      newAmount: newAmount.toString,
      amountWithdrawn: amountWithdrawn.toString(),
    })
  }
}
