import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { Token } from "../blockchain/token.entity"
import { User } from "./entities/user.entity"
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service"

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
