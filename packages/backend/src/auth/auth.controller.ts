import { Response } from "express"

import { Body, Controller, HttpCode, HttpStatus, Post, Res } from "@nestjs/common"

import { AuthService } from "./auth.service"
import { Cookies } from "./decorators/cookies.decorator"
import { PublicAddressDto } from "./dto/publicAddress.dto"
import { VerificationDto } from "./dto/verification.dto"
import { TokensService } from "./tokens.service"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ms = require("ms")

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService, private tokenService: TokensService) {}

  @Post("signin")
  @HttpCode(HttpStatus.CREATED)
  async signin(@Body() publicAddress: PublicAddressDto) {
    return this.authService.signIn(publicAddress)
  }

  @Post("verify")
  @HttpCode(HttpStatus.ACCEPTED)
  async verify(
    @Body() verification: VerificationDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const retVal = await this.authService.verify(verification)
    response.cookie("refreshToken", retVal.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/api/v1/auth/",
      expires: new Date(Date.now() + ms("14d"))
    })
    response.cookie("fingerprint", retVal.fingerprint, {
      httpOnly: true,
      sameSite: "strict",
      path: "/"
    })
    return retVal
  }

  @Post("refresh")
  @HttpCode(HttpStatus.ACCEPTED)
  async refresh(
    @Cookies("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const retVal = await this.tokenService.refresh(refreshToken)
    response.cookie("refreshToken", retVal.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/api/v1/auth/",
      expires: new Date(Date.now() + ms("14d"))
    })
    response.cookie("fingerprint", retVal.fingerprint, {
      httpOnly: true,
      sameSite: "strict",
      path: "/"
    })
    return retVal
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Cookies("refreshToken") refreshToken: string) {
    return this.tokenService.blacklistToken(refreshToken)
  }
}
