import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { PlayerHeadService } from './player-head.service'
import { PlayerHeadController } from './player-head.controller'
import { StorageModule } from '../storage/storage.module'

@Module({
  imports: [
    HttpModule,
    StorageModule
  ],
  providers: [PlayerHeadService],
  exports: [PlayerHeadService],
  controllers: [PlayerHeadController],
})
export class PlayerHeadModule {}
