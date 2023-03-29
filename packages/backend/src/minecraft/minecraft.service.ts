import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'

@Injectable()
export class MinecraftService {
  constructor(private readonly userService: UserService) {}

  public async getUser(uuid: string) {
    return this.userService.findOne({ mojangId: uuid })
  }

  public async regionEnter(uuid: string, region: string) {
    console.log(uuid, ' entered', region)
  }

  public async playerLeave(uuid: string) {
    console.log(uuid, ' left')
  }
}
