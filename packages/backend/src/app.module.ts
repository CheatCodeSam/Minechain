import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { User } from './user/user.entity'
import { BlockchainModule } from './blockchain/blockchain.module'
import { MinecraftModule } from './minecraft/minecraft.module'
import { AccountLinkModule } from './account-link/account-link.module'
import { MessagingModule } from './messaging/messaging.module'
import { PlayerHeadModule } from './player-head/player-head.module'
import { PropertyModule } from './property/property.module'
import { Property } from './property/property.entity'
import { WebsocketModule } from './websocket/websocket.module'
import { PropertyRenderModule } from './property-render/property-render.module'
import { StorageModule } from './storage/storage.module'
import { EventEmitterModule } from '@nestjs/event-emitter';

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
        entities: [User, Property],
      }),
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    BlockchainModule,
    PropertyModule,
    MessagingModule,
    MinecraftModule,
    AccountLinkModule,
    PlayerHeadModule,
    WebsocketModule,
    PropertyRenderModule,
    StorageModule,
  ],
})
export class AppModule {}
