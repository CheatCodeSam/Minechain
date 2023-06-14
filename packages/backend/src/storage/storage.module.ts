import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { S3Module } from 'nestjs-s3'

@Module({
  imports: [
    S3Module.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          endpoint: configService.get('S3_ENDPOINT'),
          s3ForcePathStyle: false,
          region: configService.get('S3_REGION'),
          credentials: {
            accessKeyId: configService.get('S3_ACCESS_KEY'),
            secretAccessKey: configService.get('S3_SECRET_KEY'),
          },
        },
      }),
    }),
  ],
  exports: [S3Module],
})
export class StorageModule {}
