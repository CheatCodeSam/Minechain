import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MessagingModule } from '../messaging/messaging.module'
import { UserModule } from '../user/user.module'
import { AccountLinkController } from './account-link.controller'
import { AccountLinkProvider } from './account-link.provider'
import { AccountLinkService } from './account-link.service'
import { PropertyModule } from '../property/property.module'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    MessagingModule,
    UserModule,
    PropertyModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m',
          issuer: 'minechain:backend',
          audience: 'minechain:backend',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AccountLinkProvider, AccountLinkService],
  controllers: [AccountLinkController],
})
export class AccountLinkModule {}
