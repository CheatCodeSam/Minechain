import { Controller, Get, Param, Query } from '@nestjs/common'
import { PropertyService } from './services/property.service'

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.propertyService.findOne(id)
  }

  @Get()
  async findAll(@Query('take') take: number, @Query('skip') skip: number) {
    return this.propertyService.findAll(take, skip)
  }
}
