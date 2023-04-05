import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { Session } from './auth/session/session.entity'
import { User } from './user/user.entity'
import { BlockchainModule } from './blockchain/blockchain.module'
import { MinecraftModule } from './minecraft/minecraft.module'
import { AccountLinkModule } from './account-link/account-link.module'
import { MessagingModule } from './messaging/messaging.module'
import { PlayerHeadModule } from './player-head/player-head.module'

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: configService.get('ENV') === 'DEBUG',
        entities: [User, Session],
      }),
    }),
    AuthModule,
    BlockchainModule,
    MessagingModule,
    MinecraftModule,
    AccountLinkModule,
    PlayerHeadModule,
  ],
})
export class AppModule {}
