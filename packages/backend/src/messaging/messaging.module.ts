import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('RABBIT_URI'),
        exchanges: [
          { name: 'account-link', type: 'direct', options: { durable: false } },
          { name: 'minecraft', type: 'direct', options: { durable: false } },
          { name: 'blockchain', type: 'direct', options: { durable: false } },
        ],
      }),
    }),
  ],
  exports: [RabbitMQModule],
})
export class MessagingModule {}
