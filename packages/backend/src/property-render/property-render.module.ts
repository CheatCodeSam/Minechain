import { Module } from '@nestjs/common'
import { MessagingModule } from '../messaging/messaging.module'
import { PropertyRenderService } from './property-render.service'
import { StorageModule } from '../storage/storage.module'
import { PropertyRenderController } from './property-render.controller'

@Module({
  imports: [MessagingModule, StorageModule],
  providers: [PropertyRenderService],
  exports: [PropertyRenderService],
  controllers: [PropertyRenderController],
})
export class PropertyRenderModule {}
