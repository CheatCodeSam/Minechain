import { Controller, Get, UseGuards } from "@nestjs/common"

import Moralis from "../Moralis.import"
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard"
import { CurrentUser } from "./decorators/current-user.decorator"
import { User } from "./entities/user.entity"

@Controller("users")
export class UsersController {
  @Get("whoami")
  @UseGuards(AuthenticatedGuard)
  async whoami(@CurrentUser() user: User) {
    return user
  }

  @Get("nfts")
  @UseGuards(AuthenticatedGuard)
  async nfts(@CurrentUser() user: User) {
    const price = await Moralis.Web3API.account.getNFTs({
      chain: "rinkeby",
      address: user.publicAddress
    })
    return price
  }
}
