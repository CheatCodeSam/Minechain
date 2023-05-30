import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ethers } from 'ethers'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { instanceToPlain } from 'class-transformer'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(publicAddress: string) {
    const existingUser = await this.userService.findOne({ publicAddress: publicAddress.toLowerCase() })
    if (existingUser) {
      return existingUser.nonce
    } else {
      const user = await this.userService.createUser(publicAddress.toLowerCase())
      return user.nonce
    }
  }

  async verify(publicAddress: string, signedNonce: string) {
    if (!this.isValidSignature(signedNonce))
      throw new ForbiddenException('Signature is invalid.')
    const user = await this.userService.findOne({ publicAddress })
    if (!user)
      throw new NotFoundException('User with public address does not exist.')

    const decodedAddress = ethers.utils.verifyMessage(user.nonce, signedNonce)
    if (publicAddress.toLowerCase() === decodedAddress.toLowerCase()) {
      const authenticatedUser = await this.userService.activateUser(user.id)
      const access_token = await this.jwtService.signAsync({ sub: authenticatedUser.id })
      const plainuser = instanceToPlain(authenticatedUser)
      const returnValue = {...plainuser, access_token }
      return returnValue
    } else {
      throw new ForbiddenException('Invalid public address.')
    }
  }

  private isValidSignature(signature: string): boolean {
    try {
      ethers.utils.splitSignature(signature)
    } catch (error) {
      return false
    }
    return true
  }
}
