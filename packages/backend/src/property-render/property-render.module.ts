import { Module } from '@nestjs/common'
import { MessagingModule } from '../messaging/messaging.module'
import { PropertyRenderService } from './property-render.service'
import { S3Module } from 'nestjs-s3'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    MessagingModule,
    S3Module.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          endpoint: configService.get("S3_ENDPOINT"),
          s3ForcePathStyle: false,
          region: configService.get("S3_REGION"),
          credentials: {
            accessKeyId: configService.get("S3_ACCESS_KEY"),
            secretAccessKey: configService.get("S3_SECRET_KEY"),
          },
        },
      }),
    }),
  ],
  providers: [PropertyRenderService],
  exports: [PropertyRenderService],
})
export class PropertyRenderModule {}
