import { Controller, Get, UseGuards, Request } from "@nestjs/common"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"

@Controller("users")
export class UsersController {
  @Get("whoami")
  @UseGuards(JwtAuthGuard)
  async whoami(@Request() req) {
    return req.user
  }
}
