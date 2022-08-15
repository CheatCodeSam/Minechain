import { Controller, Get, UseGuards } from "@nestjs/common"

import Moralis from "../Moralis.import"
import { AuthenticatedGuard } from "../auth/strategies/authenticated.guard"
import { CurrentUser } from "./decorators/current-user.decorator"
import { User } from "./entities/user.entity"

@Controller("users")
export class UsersController {
  @Get("whoami")
  @UseGuards(AuthenticatedGuard)
  async whoami(@CurrentUser() user: User) {
    const price = await Moralis.Web3API.account.getNFTs({
      chain: "rinkeby",
      address: "0x2061dd3a9f09186b5CD82436467dDB79dC737227"
    })
    return price
    return user
  }
}
