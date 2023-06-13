import { Module, OnModuleInit } from '@nestjs/common'
import { PropertyController } from './property.controller'
import { PropertyService } from './property.service'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { Property } from './property.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '../user/user.module'
import { MessagingModule } from '../messaging/messaging.module'
import { WebsocketModule } from '../websocket/websocket.module'
import { PropertyProvider } from './property.provider'
import { PropertyEventsService } from './property-events.service'
import { PropertyRenderModule } from '../property-render/property-render.module'

@Module({
  imports: [
    MessagingModule,
    BlockchainModule,
    TypeOrmModule.forFeature([Property]),
    UserModule,
    WebsocketModule,
    PropertyRenderModule
  ],
  controllers: [PropertyController],
  providers: [PropertyService, PropertyProvider, PropertyEventsService],
  exports: [PropertyService],
})
export class PropertyModule implements OnModuleInit {
  constructor(private readonly propertyService: PropertyService) {}

  onModuleInit() {
    this.propertyService.initialize()
  }
}
