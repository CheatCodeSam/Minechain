
import { EvmChain } from "@moralisweb3/evm-utils"
import Moralis from "moralis"
import { Controller, Get, UseGuards,} from "@nestjs/common"

import { AuthenticatedGuard } from "../auth/guards/authenticated.guard"
import { CurrentUser } from "./decorators/current-user.decorator"
import { UserDto } from "./dto/user.dto"
import { User } from "./entities/user.entity"
import { Serialize } from "./user.serilalize.interceptor"
import { UsersService } from "./users.service"

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Serialize(UserDto)
  @Get("whoami")
  @UseGuards(AuthenticatedGuard)
  async whoami(@CurrentUser() user: User) {
    console.log(user.fullName)

    return user
  }

  @Get("nfts")
  @UseGuards(AuthenticatedGuard)
  async getNFTS(@CurrentUser() user: User) {
    return this.usersService.getNfts(user.publicAddress)
  }
}
