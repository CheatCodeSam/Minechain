import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { PublicAddressDto } from "./dto/publicAddress.dto"
import { VerificationDto } from "./dto/verification.dto"
import { TokensService } from "./tokens.service"
import { Request, Response } from "express"
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
      sameSite: true,
      path: "/api/v1/auth/refresh",
      expires: new Date(Date.now() + ms("14d"))
    })
    return retVal
  }

  @Post("refresh")
  @HttpCode(HttpStatus.ACCEPTED)
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies["refreshToken"]
    const retVal = await this.tokenService.refresh(refreshToken)
    response.cookie("refreshToken", retVal.refreshToken, {
      httpOnly: true,
      sameSite: true,
      path: "/api/v1/auth/refresh",
      expires: new Date(Date.now() + ms("14d"))
    })
    return retVal
  }
}
