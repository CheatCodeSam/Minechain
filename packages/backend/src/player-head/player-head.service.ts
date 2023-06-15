import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { User } from '../user/user.entity'
import { StorageService } from '../storage/storage.service'

@Injectable()
export class PlayerHeadService {
  constructor(
    private readonly storageService: StorageService,
    private readonly httpService: HttpService
  ) {}

  async getPlayerHead(user: User) {
    const nameServerResponse = await firstValueFrom(
      this.httpService.get(`https://crafatar.com/avatars/${user.mojangId}`, {
        responseType: 'arraybuffer',
      })
    )
    const contentType: string = nameServerResponse.headers['content-type']
    const key = `player-head/${user.publicAddress}.png`

    return this.storageService.upload(key, nameServerResponse.data, contentType)
  }
}
