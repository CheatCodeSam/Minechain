import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
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

  @Get(':publicaddress')
  async findOne(@Param('publicaddress') publicAddress: string) {
    return this.userService.findOne({
      publicAddress: publicAddress.toLowerCase(),
    })
  }

  @Post('refresh-ens')
  @UseGuards(AuthenticatedGuard)
  async refreshEns(@CurrentUser() user: User) {
    return this.userService.updateEns(user)
  }

  @Post('refresh-head')
  @UseGuards(AuthenticatedGuard)
  async refreshHead(@CurrentUser() user: User) {
    return this.userService.updatePlayerHead(user)
  }
}
