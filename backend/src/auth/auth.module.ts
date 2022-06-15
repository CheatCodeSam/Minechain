import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { UsersModule } from "../users/users.module"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { AuthController } from "./auth.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "../users/entities/user.entity"
import { RefreshToken } from "./entities/refreshtoken.entity"
import { TokensService } from "./tokens.service"
import { JwtStrategy } from "./strategies/jwt.strategy"

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({ secret: "secret" }),
    TypeOrmModule.forFeature([User, RefreshToken])
  ],
  providers: [AuthService, TokensService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
