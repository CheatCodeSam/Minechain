import { AmqpConnection } from "@golevelup/nestjs-rabbitmq"
import { createSecretKey } from "crypto"
import "dotenv/config"
import * as jose from "jose"
import { Repository } from "typeorm"

import { ForbiddenException, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { User } from "../users/entities/user.entity"
import { EventsGateway } from "./events.gateway"

@Injectable()
export class RegistrationService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    @InjectRepository(User) private userRepo: Repository<User>,
    private io: EventsGateway
  ) {}

  public async authenticateUser(uuid: string) {
    console.log(uuid)

    const user = await this.userRepo.findOne({ where: { mojangId: uuid } })
    if (user) {
      this.authorizeJoin(user)
    } else {
      const registrationToken = await this.createJwt(uuid)
      this.amqpConnection.publish("registration", "registerToken", {
        registerToken: registrationToken,
        uuid
      })
    }
  }

  public async validateRegistration(token: string, user: User) {
    if (user.mojangId)
      throw new ForbiddenException("User already has linked account, unlink account to reregister")

    const privatekey = createSecretKey(process.env.JWT_SECRET, "utf-8")

    let payload: jose.JWTPayload
    try {
      const verification = await jose.jwtVerify(token, privatekey, {
        issuer: "minechain:backend",
        audience: "minechain:backend"
      })
      payload = verification.payload
    } catch (error) {
      throw new ForbiddenException("Token is invalid")
    }
    user.mojangId = payload.mojangId as string
    this.userRepo.save(user)
    this.authorizeJoin(user)
  }

  private async createJwt(mojangId: string): Promise<string> {
    const privatekey = createSecretKey(process.env.JWT_SECRET, "utf-8")

    return new jose.SignJWT({ mojangId })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer("minechain:backend")
      .setAudience("minechain:backend")
      .setExpirationTime("15m")
      .sign(privatekey)
  }

  private async authorizeJoin(user: User) {
    this.amqpConnection.publish("registration", "authorizeJoin", user)
    this.io.emit("authorizeJoin", user)
  }
}
