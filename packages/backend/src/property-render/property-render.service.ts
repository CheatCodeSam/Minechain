import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PropertyRenderService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  private async getHighestBlocks(tokenId: number): Promise<string[][]> {
    return this.amqpConnection.request<string[][]>({
      exchange: 'minecraft',
      routingKey: 'getBlock',
      payload: {
        tokenId: tokenId.toString(),
      },
      timeout: 10000,
    })
  }

  public async getPropertyRender(tokenId: number): Promise<string> {
    const map = await this.getHighestBlocks(tokenId)
    console.log(map)
    return "null"
  }

}
