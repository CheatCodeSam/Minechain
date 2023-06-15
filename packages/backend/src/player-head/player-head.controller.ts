import { Controller, Get, Header, Param } from '@nestjs/common'
import { StorageService } from '../storage/storage.service'

@Controller('player-head')
export class PlayerHeadController {
  constructor(private readonly storageService: StorageService) {}

  @Get(':userKey')
  @Header('Content-Disposition', 'inline')
  @Header('Content-Type', 'image/png')
  async getPlayerHead(@Param('userKey') userKey: string) {
    return this.storageService.getStream(`player-head/${userKey}`)
  }
}
