import { Controller, Get, Param } from '@nestjs/common'
import { PropertyService } from './property.service'

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.propertyService.serializeProperty(id)
  }
}
