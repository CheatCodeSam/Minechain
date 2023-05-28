import { Module, forwardRef } from '@nestjs/common'
import { PropertyController } from './property.controller'
import { PropertyService } from './property.service'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { Property } from './property.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '../user/user.module'
import { MessagingModule } from '../messaging/messaging.module'
import { WebsocketModule } from '../websocket/websocket.module'

@Module({
  imports: [
    MessagingModule,
    forwardRef(() => BlockchainModule),
    TypeOrmModule.forFeature([Property]),
    forwardRef(() => UserModule),
    WebsocketModule
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}
