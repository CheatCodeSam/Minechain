import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { AuthenticatedGuard } from '../auth/guard/authenticated.guard'
import { CurrentUser } from '../user/decorator/current-user.decorator'
import { User } from '../user/user.entity'
import { AccountLinkService } from './account-link.service'
import { RegisterTokenDto } from './dto/register-token.dto'

@Controller('account-link')
export class AccountLinkController {
  constructor(private readonly accountLinkService: AccountLinkService) {}

  @Post()
  @HttpCode(202)
  @UseGuards(AuthenticatedGuard)
  async register(@Body() { token }: RegisterTokenDto, @CurrentUser() user: User) {
    return this.accountLinkService.validateRegistration(token, user)
  }
}
