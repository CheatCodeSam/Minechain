import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { ClientsModule, Transport } from "@nestjs/microservices"
import { PassportModule } from "@nestjs/passport"
import { TypeOrmModule } from "@nestjs/typeorm"

import { User } from "../users/entities/user.entity"
import { UsersModule } from "../users/users.module"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { Session } from "./session.entity"
import { SessionSerializer } from "./session.serializer"
import { Web3Strategy } from "./strategies/web3.strategy"

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ session: true }),
    JwtModule.register({ secret: "secret" }),
    TypeOrmModule.forFeature([User, Session])
  ],
  providers: [AuthService, Web3Strategy, SessionSerializer],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}