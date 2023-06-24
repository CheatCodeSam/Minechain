import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MessagingModule } from '../messaging/messaging.module'
import { UserModule } from '../user/user.module'
import { MinecraftProvider } from './minecraft.provider'
import { MinecraftService } from './minecraft.service'
import { WebsocketModule } from '../websocket/websocket.module'

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MessagingModule,
    UserModule,
    WebsocketModule,
  ],
  providers: [MinecraftProvider, MinecraftService],
})
export class MinecraftModule {}
