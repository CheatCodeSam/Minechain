import { EvmChain } from "@moralisweb3/evm-utils"
import Moralis from "moralis"

import { Controller, Get, UseGuards } from "@nestjs/common"

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
    const price = await Moralis.EvmApi.account.getNFTs({
      chain: EvmChain.RINKEBY,
      address: user.publicAddress
    })
    return price
  }
}
