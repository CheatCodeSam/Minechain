import { Injectable } from '@nestjs/common'
import { instanceToPlain } from 'class-transformer'
import { UserService } from '../user/user.service'

@Injectable()
export class MinecraftService {
  constructor(private readonly userService: UserService) {}

  public async getUser(uuid: string) {
    const user = this.userService.findOne({ mojangId: uuid })
    return instanceToPlain(user)
  }

  public async regionEnter(uuid: string, region: string) {
    console.log(uuid, ' entered', region)
  }

  public async playerLeave(uuid: string) {
    console.log(uuid, ' left')
  }
}
