import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors
} from "@nestjs/common"

import { AuthenticatedGuard } from "../auth/guards/authenticated.guard"
import { CurrentUser } from "./decorators/current-user.decorator"
import { UserDto } from "./dto/user.dto"
import { User } from "./entities/user.entity"
import { UsersService } from "./users.service"

@Controller("users")
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("whoami")
  @UseGuards(AuthenticatedGuard)
  async whoami(@CurrentUser() user: User) {
    return new UserDto(user)
  }

  @Get("nfts")
  @UseGuards(AuthenticatedGuard)
  async getNFTS(@CurrentUser() user: User) {
    return this.usersService.getNfts(user.publicAddress)
  }
  //TODO Move to Properties
  @Get("properties")
  async getProperties() {
    return this.usersService.getProperties()
  }
}
