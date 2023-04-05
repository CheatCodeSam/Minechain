import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthenticatedGuard } from '../auth/guard/authenticated.guard'
import { CurrentUser } from './decorator/current-user.decorator'
import { User } from './user.entity'

@Controller('user')
export class UserController {
  @Get()
  @UseGuards(AuthenticatedGuard)
  async whoami(@CurrentUser() user: User) {
    return user
  }
}
