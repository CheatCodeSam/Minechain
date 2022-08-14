import { Strategy } from "passport-local"

import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"

import { AuthService } from "../auth.service"

@Injectable()
export class Web3Strategy extends PassportStrategy(Strategy, "web3") {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: "publicAddress", passwordField: "signedNonce" })
  }
  async validate(publicAddress: string, signedNonce: string) {
    console.log(publicAddress)

    const user = await this.authService.verify({ publicAddress, signedNonce })
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
