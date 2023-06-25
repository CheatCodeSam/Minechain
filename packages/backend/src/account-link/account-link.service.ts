import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class AccountLinkService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService
  ) {}

  public async validateRegistration(token: string, user: User) {
    if (user.mojangId)
      throw new ForbiddenException(
        'User already has linked account, unlink account to reregister'
      )

    const mojangId = await this.verifyJwt(token)
    if (!mojangId) throw new ForbiddenException('Token is invalid.')
    this.userService.updateUserMojangId(user.id, mojangId)
    this.eventEmitter.emit('property.update', { properties: user.properties })
    this.authorizeJoin(mojangId)
  }

  public async isLinked(mojangId: string): Promise<boolean> {
    const user = await this.userService.findOne({ mojangId })
    return !!user
  }

  public async generateRegistrationToken(uuid: string) {
    return { token: await this.createJwt(uuid), uuid }
  }

  public async unlinkAccount(user: User) {
    return this.userService.unlinkMinecraftAccount(user.id)
  }

  private async createJwt(mojangId: string): Promise<string> {
    return this.jwtService.sign({ mojangId })
  }

  private async verifyJwt(token: string): Promise<string> {
    try {
      const payload = this.jwtService.verify(token)
      return payload.mojangId as string
    } catch (error) {
      return ''
    }
  }

  private async authorizeJoin(uuid: string) {
    this.amqpConnection.publish('account-link', 'authorizeJoin', { uuid })
  }
}
