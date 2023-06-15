import { Injectable, StreamableFile } from '@nestjs/common'
import { InjectS3, S3 } from 'nestjs-s3'

@Injectable()
export class StorageService {
  constructor(@InjectS3() private readonly s3: S3) {}

  public async getStream(key: string) {
    const object = await this.s3.getObject({ Bucket: 'minechain', Key: key })
    const stream = await object.Body.transformToByteArray()
    return new StreamableFile(stream)
  }

  public async upload(key: string, object: Buffer, contentType: string) {
    await this.s3.putObject({
      Bucket: 'minechain',
      Body: object,
      Key: key,
      ContentType: contentType,
      ContentDisposition: 'inline',
    })
    return key
  }
}
