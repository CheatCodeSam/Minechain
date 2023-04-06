import { Controller, Get, Header, Param, StreamableFile } from '@nestjs/common'
import { InjectS3, S3 } from 'nestjs-s3'

@Controller('player-head')
export class PlayerHeadController {

    constructor( @InjectS3() private readonly s3: S3) {}
    
    @Get(':userKey')
    @Header('Content-Disposition', 'inline')
    @Header('Content-Type', 'image/png')
    async getPlayerHead(@Param('userKey') userKey: string)
    {
        const stream = this.s3.getObject({Bucket: "bucket", Key: userKey}).createReadStream()
        return new StreamableFile(stream)
    }
}