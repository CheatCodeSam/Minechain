import { Module } from '@nestjs/common'
import { PropertyController } from './property.controller'
import { PropertyService } from './property.service'
import { BlockchainModule } from '../blockchain/blockchain.module'

@Module({
  imports: [BlockchainModule],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}
