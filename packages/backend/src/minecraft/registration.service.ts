import { AmqpConnection } from "@golevelup/nestjs-rabbitmq"
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq"
import { createSecretKey } from "crypto"
import "dotenv/config"
import * as jose from "jose"
import Moralis from "moralis"
import { Repository } from "typeorm"

import { ForbiddenException, Injectable } from "@nestjs/common"
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
    const user = await this.userRepo.findOne({ where: { mojangId: msg.uuid } })
    if (user) {
      this.publishWelcome(msg.displayName, user.publicAddress)
    } else {
      const registrationToken = await this.createJwt(msg.uuid, msg.displayName)
      this.amqpConnection.publish("registration", "registerToken", { token: registrationToken })
    }
  }

  @RabbitSubscribe({
    exchange: "blockchain",
    routingKey: "transfer",
    queue: "",
    createQueueIfNotExists: true,
    queueOptions: { durable: true },
    allowNonJsonMessages: false
  })
  public async other(msg: { from: string; to: string; value: string; data: any }) {
    console.log(msg.from, msg.to, msg.value, msg.data)
  }

  private async createJwt(mojangId: string, displayName: string): Promise<string> {
    const privatekey = createSecretKey(process.env.JWT_SECRET, "utf-8")

    return new jose.SignJWT({ mojangId, displayName })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer("minechain:backend")
      .setAudience("minechain:backend")
      .setExpirationTime("15m")
      .sign(privatekey)
  }

  private async publishWelcome(displayName: string, publicAddress: string) {
    let address: string
    try {
      const moralisEns = await Moralis.EvmApi.resolve.resolveAddress({ address: publicAddress })
      address = moralisEns.raw.name
    } catch (error) {
      address = publicAddress
    }
    this.amqpConnection.publish("registration", "success", {
      msg: `Minecraft user "${displayName}" is linked to address "${address}"`
    })
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
    this.publishWelcome(payload.displayName as string, user.publicAddress)
  }
}
