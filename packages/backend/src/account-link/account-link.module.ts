import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MessagingModule } from '../messaging/messaging.module'
import { UserModule } from '../user/user.module'
import { AccountLinkController } from './account-link.controller'
import { AccountLinkProvider } from './account-link.provider'
import { AccountLinkService } from './account-link.service'

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MessagingModule,
    UserModule,
  ],
  providers: [AccountLinkProvider, AccountLinkService],
  controllers: [AccountLinkController],
})
export class AccountLinkModule {}
