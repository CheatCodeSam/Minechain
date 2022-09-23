import { EvmChain } from "@moralisweb3/evm-utils"
import Moralis from "moralis"

import { Controller, Get, UseGuards } from "@nestjs/common"

import { AuthenticatedGuard } from "../auth/guards/authenticated.guard"
import { CurrentUser } from "./decorators/current-user.decorator"
import { User } from "./entities/user.entity"
import { UsersService } from "./users.service"

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("whoami")
  @UseGuards(AuthenticatedGuard)
  async whoami(@CurrentUser() user: User) {
    return user
  }

  @Get("nfts")
  @UseGuards(AuthenticatedGuard)
  async getNFTS(@CurrentUser() user: User) {
    return this.usersService.getNfts(user.publicAddress)
  }
}
