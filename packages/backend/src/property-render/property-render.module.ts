import { Module } from '@nestjs/common'
import { MessagingModule } from '../messaging/messaging.module'
import { PropertyRenderService } from './property-render.service'

@Module({
  imports: [MessagingModule],
  providers: [PropertyRenderService],
  exports: [PropertyRenderService]
})
export class PropertyRenderModule {}
