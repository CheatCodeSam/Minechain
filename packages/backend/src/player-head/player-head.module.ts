import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { S3Module } from 'nestjs-s3'
import { PlayerHeadService } from './player-head.service'
import { PlayerHeadController } from './player-head.controller'

@Module({
  imports: [
    ConfigModule.forRoot({}),
    HttpModule,
    S3Module.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          accessKeyId: configService.get('S3_ACCESS_KEY'),
          secretAccessKey: configService.get('S3_SECRET_KEY'),
          endpoint: configService.get('S3_ENDPOINT'),
          s3ForcePathStyle: true,
          signatureVersion: 'v4',
        },
      }),
    }),
  ],
  providers: [PlayerHeadService],
  exports: [PlayerHeadService],
  controllers: [PlayerHeadController],
})
export class PlayerHeadModule {}
