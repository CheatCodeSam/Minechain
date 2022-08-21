import { AmqpConnection } from "@golevelup/nestjs-rabbitmq"
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq"
import { createSecretKey } from "crypto"
import "dotenv/config"
import * as jose from "jose"
import Moralis from "moralis"
import { Repository } from "typeorm"

import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { User } from "../users/entities/user.entity"

@Injectable()
export class RegistrationService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}
  @RabbitSubscribe({
    exchange: "registration",
    routingKey: "playerJoin",
    queue: "",
    createQueueIfNotExists: true,
    queueOptions: { durable: true },
    allowNonJsonMessages: false
  })
  public async pubSubHandler(msg: { uuid: string; displayName: string }) {
    const registrationToken = await this.createJwt(msg.uuid, msg.displayName)
    this.amqpConnection.publish("registration", "registerToken", { token: registrationToken })
    console.log(`Received message: ${JSON.stringify(msg)}`)
  }

  public async createJwt(mojangId: string, displayName: string): Promise<string> {
    const privatekey = createSecretKey(process.env.JWT_SECRET, "utf-8")

    const jwt = await new jose.SignJWT({ mojangId, displayName })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer("minechain:backend")
      .setAudience("minechain:backend")
      .setExpirationTime("15m")
      .sign(privatekey)
    return jwt
  }

  public async validateRegistration(token: string, user: User) {
    const privatekey = createSecretKey(process.env.JWT_SECRET, "utf-8")

    const { payload } = await jose.jwtVerify(token, privatekey, {
      issuer: "minechain:backend",
      audience: "minechain:backend"
    })

    user.mojangId = payload.mojangId as string
    this.userRepo.save(user)

    this.amqpConnection.publish("registration", "success", {
      msg: `Minecraft user "${payload.displayName}" is now linked to address "${user.publicAddress}"`
    })
  }
}
