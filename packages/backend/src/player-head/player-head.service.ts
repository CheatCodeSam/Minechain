import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectS3, S3 } from 'nestjs-s3'
import { firstValueFrom } from 'rxjs'
import { User } from '../user/user.entity'

@Injectable()
export class PlayerHeadService {
  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly httpService: HttpService
  ) {}

  async getPlayerHead(user: User) {
    const nameServerResponse = await firstValueFrom(
      this.httpService.get('https://crafatar.com/avatars/' + user.mojangId, {
        responseType: 'arraybuffer',
      })
    )

    const contentType: string = nameServerResponse.headers['content-type']
    return await this.s3
      .upload({
        Bucket: 'bucket',
        Body: nameServerResponse.data,
        Key: user.publicAddress + ".png",
        ContentType: contentType,
        ContentDisposition: 'inline',
      })
      .promise()
  }
}