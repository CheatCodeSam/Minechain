import { Controller, Get, Header, Param, StreamableFile } from '@nestjs/common'
import { InjectS3, S3 } from 'nestjs-s3'

@Controller('player-head')
export class PlayerHeadController {

    constructor( @InjectS3() private readonly s3: S3) {}
    
    @Get(':publicAddress')
    @Header('Content-Disposition', 'inline')
    @Header('Content-Type', 'image/png')
    async getPlayerHead(@Param('publicAddress') publicAddress: string)
    {
        const stream = this.s3.getObject({Bucket: "bucket", Key: publicAddress}).createReadStream()
        return new StreamableFile(stream)
    }
}
