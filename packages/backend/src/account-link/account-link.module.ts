import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserModule } from '../user/user.module'
import { AccountLinkController } from './account-link.controller'
import { AccountLinkProvider } from './account-link.provider'
import { AccountLinkService } from './account-link.service'

@Module({
  imports: [
    ConfigModule.forRoot({}),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('RABBIT_URI'),
        exchanges: [
          { name: 'account-link', type: 'direct', options: { durable: false } },
          { name: 'minecraft', type: 'direct', options: { durable: false } },
        ],
      }),
    }),
    UserModule,
  ],
  providers: [AccountLinkProvider, AccountLinkService],
  controllers: [AccountLinkController],
})
export class AccountLinkModule {}
