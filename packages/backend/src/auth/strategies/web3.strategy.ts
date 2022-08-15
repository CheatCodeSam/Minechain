import { Strategy } from "passport-local"

import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"

import { AuthService } from "../auth.service"

@Injectable()
export class Web3Strategy extends PassportStrategy(Strategy, "web3") {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: "publicAddress", passwordField: "signedNonce" })
  }
  async validate(publicAddress: string, signedNonce: string) {
    return await this.authService.verify({ publicAddress, signedNonce })
  }
}
