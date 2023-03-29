import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserModule } from '../user/user.module'
import { MinecraftProvider } from './minecraft.provider'
import { MinecraftService } from './minecraft.service'

@Module({
  imports: [
    ConfigModule.forRoot({}),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('RABBIT_URI'),
        exchanges: [
          { name: 'minecraft', type: 'direct', options: { durable: false } },
        ],
      }),
    }),
    UserModule,
  ],
  providers: [MinecraftProvider, MinecraftService],
})
export class MinecraftModule {}
