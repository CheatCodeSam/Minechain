import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common"

import { AuthService } from "./auth.service"
import { PublicAddressDto } from "./dto/publicAddress.dto"
import { Web3Guard } from "./guards/web3.guard"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signin")
  @HttpCode(HttpStatus.CREATED)
  async signin(@Body() publicAddress: PublicAddressDto) {
    return this.authService.signIn(publicAddress)
  }

  @Post("verify")
  @UseGuards(Web3Guard)
  @HttpCode(HttpStatus.ACCEPTED)
  async verify(@Request() req: any) {
    return req.user
  }

  @Post("/logout")
  logout(@Request() req): any {
    req.session.destroy()
    return { msg: "The user session has ended" }
  }
}
