import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { Injectable, RequestTimeoutException } from '@nestjs/common'
import Jimp from 'jimp'
import { ColorTable } from './color-table'
import { StorageService } from '../storage/storage.service'

@Injectable()
export class PropertyRenderService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly storageService: StorageService
  ) {}

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

  private async upload(tokenId: number, buffer: Buffer) {
    return this.storageService.upload(
      `property-render/${tokenId.toString()}.png`,
      buffer,
      'image/png'
    )
  }

  private async drawProperty(propertyData: string[][]) {
    const image = new Jimp(16, 16)
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        image.setPixelColor(ColorTable[propertyData[y][x].toLowerCase()], x, y)
      }
    }
    return image.getBufferAsync(Jimp.MIME_PNG)
  }

  public async getPropertyRender(tokenId: number): Promise<string> {
    try {
      const map = await this.getHighestBlocks(tokenId)
      const buffer = await this.drawProperty(map)
      const key = this.upload(tokenId, buffer)
      return key
    } catch (error) {
      throw new RequestTimeoutException(
        `getBlock for token ${tokenId} took too long`
      )
    }
  }
}
