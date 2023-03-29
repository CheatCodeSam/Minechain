import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MessagingModule } from '../messaging/messaging.module'
import { UserModule } from '../user/user.module'
import { MinecraftProvider } from './minecraft.provider'
import { MinecraftService } from './minecraft.service'

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MessagingModule,
    UserModule,
  ],
  providers: [MinecraftProvider, MinecraftService],
})
export class MinecraftModule {}
