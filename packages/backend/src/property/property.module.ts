import { Module } from '@nestjs/common'
import { PropertyController } from './property.controller'
import { PropertyService } from './property.service'
import { BlockchainModule } from '../blockchain/blockchain.module'
import { Property } from './property.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '../user/user.module'

@Module({
  imports: [BlockchainModule, TypeOrmModule.forFeature([Property]), UserModule],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [PropertyService]
})
export class PropertyModule {}
