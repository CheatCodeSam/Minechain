import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { S3Module } from 'nestjs-s3'
import { HttpModule } from "@nestjs/axios"
import { PlayerHeadService } from './player-head.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    BlockchainModule,
    HttpModule,
    S3Module.forRootAsync({
      useFactory: () => ({
        config: {
          accessKeyId: 'minioadmin',
          secretAccessKey: 'minioadmin',
          endpoint: 'http://localhost:9000',
          s3ForcePathStyle: true,
          signatureVersion: 'v4',
        },
      }),
    }),
  ],
  providers: [UserService, PlayerHeadService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
