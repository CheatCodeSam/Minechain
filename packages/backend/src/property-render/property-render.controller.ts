import { Controller, Get, Header, Param } from '@nestjs/common'
import { StorageService } from '../storage/storage.service'

@Controller('property-render')
export class PropertyRenderController {
  constructor(private readonly storageService: StorageService) {}

  @Get(':propertyKey')
  @Header('Content-Disposition', 'inline')
  @Header('Content-Type', 'image/png')
  async getPropertyRender(@Param('propertyKey') propertyKey: string) {
    return this.storageService.getStream(`property-render/${propertyKey}`)
  }
}
