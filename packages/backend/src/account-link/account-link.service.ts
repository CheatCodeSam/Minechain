import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { createSecretKey } from 'crypto'
import * as jose from 'jose'

import { ForbiddenException, Injectable } from '@nestjs/common'
import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AccountLinkService {

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  public async validateRegistration(token: string, user: User) {
    if (user.mojangId)
      throw new ForbiddenException(
        'User already has linked account, unlink account to reregister'
      )

    const mojangId = await this.verifyJwt(token)
    if (!mojangId) throw new ForbiddenException('Token is invalid.')
    this.userService.updateUserMojangId(user.id, mojangId)
    this.authorizeJoin(mojangId)
  }

  public async isLinked(mojangId: string): Promise<boolean> {
    const user = await this.userService.findOne({ mojangId })
    return !!user
  }

  public async generateRegistrationToken(uuid: string) {
    return { token: await this.createJwt(uuid), uuid }
  }

  public async unlinkAccount(user: User)
  {
    return this.userService.unlinkMinecraftAccount(user.id)
  }

  private async createJwt(mojangId: string): Promise<string> {
    const privatekey = createSecretKey(
      this.configService.get('JWT_SECRET'),
      'utf-8'
    )
    return new jose.SignJWT({ mojangId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer('minechain:backend')
      .setAudience('minechain:backend')
      .setExpirationTime('15m')
      .sign(privatekey)
  }

  private async verifyJwt(token: string): Promise<string> {
    try {
      const privatekey = createSecretKey(
        this.configService.get('JWT_SECRET'),
        'utf-8'
      )
      const verification = await jose.jwtVerify(token, privatekey, {
        issuer: 'minechain:backend',
        audience: 'minechain:backend',
      })
      return verification.payload.mojangId as string
    } catch (error) {
      return ''
    }
  }

  private async authorizeJoin(uuid: String) {
    this.amqpConnection.publish('account-link', 'authorizeJoin', {uuid})
  }
}
