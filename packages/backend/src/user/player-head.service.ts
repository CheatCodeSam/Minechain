import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { createReadStream } from 'fs'
import { InjectS3, S3 } from 'nestjs-s3'
import { map } from 'rxjs'
import { User } from './user.entity'

@Injectable()
export class PlayerHeadService {
  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly httpService: HttpService
  ) {}

  async getPlayerHead(user: string) {
    this.httpService
      .get('https://crafatar.com/avatars/' + user, {
        responseType: 'arraybuffer',
      })
      .subscribe((res) => {
        this.s3.upload({ Bucket: 'bucket', Body: res.data, Key: user }).promise()
      })
  }
}
