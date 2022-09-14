import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { Token } from "../blockchain/token.entity"
import { User } from "./entities/user.entity"
import { UsersController } from "./users.controller"

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  controllers: [UsersController]
})
export class UsersModule {}
