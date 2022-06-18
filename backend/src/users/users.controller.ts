import { JwtAuthGuard } from "src/auth/guards/jwt.guard"

import { Controller, Get, UseGuards } from "@nestjs/common"

import { CurrentUser } from "./decorators/current-user.decorator"
import { User } from "./entities/user.entity"

@Controller("users")
export class UsersController {
  @Get("whoami")
  @UseGuards(JwtAuthGuard)
  async whoami(@CurrentUser() user: User) {
    return user
  }
}
