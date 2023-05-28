import { Injectable } from '@nestjs/common'
import { instanceToPlain } from 'class-transformer'
import { UserService } from '../user/user.service'
import { WebSocketGateway } from '../websocket/websocket.gateway'

@Injectable()
export class MinecraftService {
  constructor(private readonly userService: UserService,
    private readonly websocketGateway: WebSocketGateway
    ) {}

  public async getUser(uuid: string) {
    const user = await this.userService.findOne({ mojangId: uuid })
    return instanceToPlain(user)
  }

  public async regionEnter(uuid: string, region: string) {
    console.log(uuid, ' entered', region)
    const user = await this.userService.findOne({ mojangId: uuid })
    this.websocketGateway.emit("minecraft", "regionEnter", { region, user })
  }

  public async playerLeave(uuid: string) {
    const user = await this.userService.findOne({ mojangId: uuid })
    this.websocketGateway.emit("minecraft", "playerLeave", { user })
  }
}
