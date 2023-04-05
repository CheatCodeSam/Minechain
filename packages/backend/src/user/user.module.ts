import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { PlayerHeadModule } from '../player-head/player-head.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]), BlockchainModule, PlayerHeadModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
