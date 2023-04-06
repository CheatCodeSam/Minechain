import { Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthenticatedGuard } from '../auth/guard/authenticated.guard'
import { CurrentUser } from './decorator/current-user.decorator'
import { User } from './user.entity'
import { UserService } from './user.service'

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthenticatedGuard)
  async whoami(@CurrentUser() user: User) {
    return user
  }

  //Unlink account
  @Post("unlink-account")
  @UseGuards(AuthenticatedGuard)
  async unlinkAccount(@CurrentUser() user: User) {
    return this.unlinkAccount(user)
  }

  //Refresh ens
  @Post("refresh-ens")
  @UseGuards(AuthenticatedGuard)
  async refreshEns(@CurrentUser() user: User) {
    return this.refreshEns(user)
  }


  //refresh mc head
  @Post("refresh-head")
  @UseGuards(AuthenticatedGuard)
  async refreshHead(@CurrentUser() user: User) {
    return this.refreshHead(user)
  }

}
