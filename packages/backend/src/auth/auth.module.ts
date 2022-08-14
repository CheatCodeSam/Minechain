import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { TypeOrmModule } from "@nestjs/typeorm"

import { User } from "../users/entities/user.entity"
import { UsersModule } from "../users/users.module"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { RefreshToken } from "./entities/refreshtoken.entity"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { Web3Strategy } from "./strategies/web3.strategy"
import { TokensService } from "./tokens.service"

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({ secret: "secret" }),
    TypeOrmModule.forFeature([User, RefreshToken])
  ],
  providers: [AuthService, TokensService, JwtStrategy, Web3Strategy],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
