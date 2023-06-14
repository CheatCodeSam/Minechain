import { Controller, Get, Header, Param, StreamableFile } from '@nestjs/common'
import { InjectS3, S3 } from 'nestjs-s3'

@Controller('property-render')
export class PropertyRenderController {
    constructor(@InjectS3() private readonly s3: S3) {}

    @Get(':propertyKey')
    @Header('Content-Disposition', 'inline')
    @Header('Content-Type', 'image/png')
    async getPlayerHead(@Param('propertyKey') propertyKey: string) {
      const object = await this.s3.getObject({ Bucket: 'minechain', Key: "property-render/" + propertyKey })
      const stream = await object.Body.transformToByteArray()
      return new StreamableFile(stream)
    }
}
