import { Controller, Get, Param, Query } from '@nestjs/common'
import { PropertyService } from './services/property.service'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Controller('property')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private eventEmitter: EventEmitter2
  ) {}

  @Get(':id')
  async findOne(@Param('id') id: number) {
    this.eventEmitter.emit('order.created')

    return this.propertyService.findOne(id)
  }

  @Get()
  async findAll(@Query('take') take: number, @Query('skip') skip: number) {
    return this.propertyService.find(take, skip)
  }
}
