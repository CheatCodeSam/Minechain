import { Body, Controller, Post, UseGuards } from "@nestjs/common"

import { AuthenticatedGuard } from "../auth/guards/authenticated.guard"
import { CurrentUser } from "../users/decorators/current-user.decorator"
import { User } from "../users/entities/user.entity"
import { registerToken } from "./registerToken.dto"
import { RegistrationService } from "./registration.service"

@Controller("registration")
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @UseGuards(AuthenticatedGuard)
  async register(@Body() test: registerToken, @CurrentUser() user: User) {
    this.registrationService.validateRegistration(test.token, user)
    return
  }
}
