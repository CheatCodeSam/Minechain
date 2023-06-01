import { Module, forwardRef } from '@nestjs/common'
import { PropertyController } from './property.controller'
import { PropertyService } from './property.service'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { Property } from './property.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '../user/user.module'
import { MessagingModule } from '../messaging/messaging.module'
import { WebsocketModule } from '../websocket/websocket.module'
import { PropertyProvider } from './property.provider'

@Module({
  imports: [
    MessagingModule,
    BlockchainModule,
    TypeOrmModule.forFeature([Property]),
    UserModule,
    WebsocketModule,
  ],
  controllers: [PropertyController],
  providers: [PropertyService, PropertyProvider],
  exports: [PropertyService],
})
export class PropertyModule {}
